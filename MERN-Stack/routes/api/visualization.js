const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');
const moment = require('moment')

const config = require('config')
const Attack_Session = require('../../models/AttackSession')
const AttackSessionsEvaluation = require('../../models/AttackSessionsEvaluation')
const Admin = require('../../models/Admin')
const Assignments = require('../../models/Assignments')
const Organization = require('../../models/Organization')
const User = require('../../models/User')
const Manager = require('../../models/Manager')
const AttackInventory = require('../../models/Attack_Inventory')
const auth = require('../../middleware/auth')

router.use(cors())

// @route   GET api/visualization/test
// @desc    Tests visualization route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/visualization/tacticsbargraph
// @desc    Post tactics bar graph data
// @access  Public
router.post('/tacticsbargraph', auth, async (req, res) => {
    if (req.user.role === "admin" || req.user.role === "organization" || req.user.role === "manager") {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            var initalAccess = await AttackInventory.find({ tactic_name: 'Initial_Access' }).countDocuments();
            var execution = await AttackInventory.find({ tactic_name: 'Execution' }).countDocuments();
            var persistance = await AttackInventory.find({ tactic_name: 'Persistence' }).countDocuments();
            var privilegeEscalation = await AttackInventory.find({ tactic_name: 'Privilege_Escalation' }).countDocuments();
            var defenseEvasion = await AttackInventory.find({ tactic_name: 'Defense_Evasion' }).countDocuments();
            var credentialAccess = await AttackInventory.find({ tactic_name: 'Credential_Access' }).countDocuments();
            var discovery = await AttackInventory.find({ tactic_name: 'Discovery' }).countDocuments();
            var lateralMovement = await AttackInventory.find({ tactic_name: 'Lateral_Movement' }).countDocuments();
            var collection = await AttackInventory.find({ tactic_name: 'Collection' }).countDocuments();
            var commandAndControl = await AttackInventory.find({ tactic_name: 'Command_and_Control' }).countDocuments();
            var exfiltration = await AttackInventory.find({ tactic_name: 'Exfiltration' }).countDocuments();
            var impact = await AttackInventory.find({ tactic_name: 'Impact' }).countDocuments();

            return res.json([initalAccess, execution, persistance, privilegeEscalation, defenseEvasion, credentialAccess,
                    discovery, lateralMovement, collection, commandAndControl, exfiltration, impact]
            )

        }
        catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error')
        }
    }
    else {
        return res.status(401).send('Unauthorized Access')
    }
});

// @route   POST api/visualization/assignmentstatusdoughnutchart
// @desc    Post assignments status in Doughnut Chart
// @access  Public
router.post('/assignmentsstatusdoughnutchart', [
    check('user_id', 'user id is required')
    .not()
    .isEmpty(),

  ],
    auth, async (req, res) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (req.user.role === "admin" || req.user.role === "organization" || req.user.role === "manager"  ||  req.user.role === "candidate") {


            const totalAssignments = await Assignments.find({ user_id: req.body.user_id }).countDocuments();
            const passedAssignments = await Attack_Session.find({ user_id: req.body.user_id, result: { $ne: null }, result: { $gte: 50 } }).countDocuments();
            const failedAssignments = await Attack_Session.find({ user_id: req.body.user_id, result: { $ne: null }, result: { $lt: 50 } }).countDocuments();

            const Attempted = passedAssignments + failedAssignments;

            return res.json({ passedAssignments: passedAssignments, failedAssignments: failedAssignments, unAttempted: totalAssignments - Attempted })

        }
        else {
            return res.status(401).send('Unauthorized Access')
        }
    })


// @route   POST api/visualization/assignedscenariosandcampaignsradarchart
// @desc    Post assigned category month wise for previous one year in Radar Chart
// @access  Public
router.post('/assignedscenariosandcampaignsradarchart', [
    check('user_id', 'user id is required')
    .not()
    .isEmpty(),

  ],
    auth, async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        if (req.user.role === "admin" || req.user.role === "organization" || req.user.role === "manager"  ||   req.user.role === "candidate") {

            let campaignArray = new Array(12).fill(0)
            let scenarioArray = new Array(12).fill(0)

            var oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
            await Assignments.find({ user_id: req.body.user_id, date: { $gte: oneYearFromNow } })
                .then(assignments => {
                    assignments.map(assignment => {
                        if (assignment.category === "Scenario") {
                            scenarioArray[assignment.date.getMonth()] += 1
                        }
                        else {
                            campaignArray[assignment.date.getMonth()] += 1
                        }
                    })
                })
                .catch(err => {
                    return res.status(422).json(err)
                })
            return res.json({ scenarioArray: scenarioArray, campaignArray: campaignArray })
        }
        else {
            return res.status(401).send('Unauthorized Access')
        }
    })


// @route   POST api/visualization/sessionsbubblechart
// @desc    Post sessions with their start time, Date, and time taken in hours in bubble chart
// @access  Public
router.post('/sessionsbubblechart', [
    check('user_id', 'user id is required')
    .not()
    .isEmpty(),

  ],
    auth, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (req.user.role === "admin" || req.user.role === "organization" || req.user.role === "manager"  || req.user.role === "candidate") {

            let data = []
            var oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
            await Attack_Session.find({ user_id: req.body.user_id, start_time: { $gte: oneYearFromNow }, end_time: { $ne: null } })
                .sort({ start_time: 'ascending' })
                .select('start_time')
                .select('end_time')
                .select('result')
                .then(sessions => {
                    sessions.map(session => {

                        // moment(session.start_time).hour()
                        data.push({ y: session.result.toFixed(), x: moment(session.start_time).format('D MMM YY h:mm:ss a '), r: (moment.duration(moment(session.end_time).diff(moment(session.start_time))).asMinutes()).toFixed(2) })
                    })
                })
                .catch(err => {
                    return res.status(422).json(err)
                })
            return res.json(data)
        }
        else {
            return res.status(401).send('Unauthorized Access')
        }
    })


// @route   POST api/visualization/performancelinechart
// @desc    Post session performance calculated seperately for scenario, campaign and overall, in line chart
// @access  Public
router.post('/performancelinechart', [
    check('user_id', 'user id is required')
    .not()
    .isEmpty(),

  ],
    auth, async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (req.user.role === "admin" || req.user.role === "organization" || req.user.role === "manager"  ||  req.user.role === "candidate") {

            
            let ScenarioPerformance = []
            let CampaignPerformance = []
            let months = []

            var oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
            var elevenMonthFromNow = new Date(oneYearFromNow.getMonth() + 1)
            await Attack_Session.find({ user_id: req.body.user_id, start_time: { $gte: elevenMonthFromNow }, end_time: { $ne: null }, incomplete_attack_error:{$ne:true} })
                .sort({ start_time: 'ascending' })
                .populate({
                    path: 'assignment',
                    select: ['category']
                })
                .select('start_time')
                .select('result')
                .then(sessions => {

                    sessions.map(session => {
                        //as at one time one session could be alloted,
                        //so at tha time other is considered as null
                        if(session.assignment && session.assignment.category)
                        if (session.assignment.category === "Scenario") {
                            ScenarioPerformance.push(session.result.toFixed())
                            CampaignPerformance.push(null)
                        }
                        else {
                            CampaignPerformance.push(session.result.toFixed())
                            ScenarioPerformance.push(null)
                        }
                        months.push(moment(session.start_time).format('D MMM YYYY'))
                    })

                    return res.json({ label: months, ScenarioPerformance: ScenarioPerformance, CampaignPerformance: CampaignPerformance })
                })
                .catch(err => {
                    console.log(err)
                    return res.status(422).json({errors:[{msg:"Could not get visualization data for performance"}]})
                })

        }
        else {
            return res.status(401).send('Unauthorized Access')
        }
    })


// @route   POST api/visualization/mitreperformancevisitlinechart
// @desc    Post session mitre performance calculated for each Tactic visit line chart
// @access  Public
router.post('/mitreperformancevisitlinechart', [
    check('user_id', 'user id is required')
    .not()
    .isEmpty(),

  ],
    auth, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (req.user.role === "admin" || req.user.role === "organization" || req.user.role === "manager"  ||   req.user.role === "candidate") {
            // tacticId = scenarioId.split('_')[0];
            let tactics =
            {
                TA01: "Initial_Access",
                TA02: "Execution",
                TA03: "Persistence",
                TA04: "Privilege_Escalation",
                TA05: "Defense_Evasion",
                TA06: "Credential_Access",
                TA07: "Discovery",
                TA08: "Lateral_Movement",
                TA09: "Collection",
                TA11: "Command_and_Control",
                TA10: "Exfiltration",
                TA040: "Impact"
            }

            var data = {
                Initial_Access: [],
                Execution: [],
                Persistence: [],
                Privilege_Escalation: [],
                Defense_Evasion: [],
                Credential_Access: [],
                Discovery: [],
                Lateral_Movement: [],
                Collection: [],
                Command_and_Control: [],
                Exfiltration: [],
                Impact: []

            }

            let tacticsArray = Object.keys(data)
            let averageScore = []


            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            let scenarioIds = []
            await AttackSessionsEvaluation.find({ user_id: req.body.user_id })
                .populate({
                    path: 'attack_session_id',
                    select: ['in_progress']
                })
                .select('-user_id')
                .select('-_id')
                .select('-_v')
                .select('-in_progress_scenarios')
                .then(evaluations => {

                    let tacticId = ""
                    evaluations.map(evaluation => {
                        try {
                            if ('in_progress' in evaluation.attack_session_id) {
                                scenarioIds = Object.keys(evaluation['_doc'])
                                scenarioIds.map(scenarioId => {
                                    try {
                                        tacticId = scenarioId.split('_')[0];

                                        if (tacticId in tactics) {
                                            data[tactics[tacticId]].push(evaluation['_doc'][scenarioId].score.score_aggregate)
                                        }
                                    }
                                    catch (err) {
                                        console.log(err)
                                    }
                                })

                            }
                        }
                        catch (err) {
                            console.log(err)
                        }
                    })
                    console.log(data)
                    tacticsArray.map(tactic => {
                        averageScore.push(average(data[tactic]))
                    })

                    return res.json({ label: tacticsArray, averageScore: averageScore })
                })
                .catch(err => {
                    return res.status(422).json(err)
                })

        }
        else {
            return res.status(401).send('Unauthorized Access')
        }
    })

// takes int array as an argument and return its average
function average(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        // if there is an undefined value (e.g a session 
        //ended with no scenario answered so score_aggregate)
        //is undefined in that case
        sum += arr[i] || 0 
    }

    return (sum / arr.length || 0).toFixed(2);
}

module.exports = router