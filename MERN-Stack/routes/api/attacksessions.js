const express = require('express')
const router = express.Router()
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const jwt = require('jsonwebtoken')
const moment = require('moment')
const axios = require('axios');
const { attackMachineBaseUrl } = require('../../config/url')

const AttackSession = require('../../models/AttackSession')
const Assignments = require('../../models/Assignments')
const AttackSessionsEvaluation = require('../../models/AttackSessionsEvaluation')
const TestHistory = require('../../models/TestHistory')
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');

// const AttackSessionsEvaluation = require('../../models/AttackSessionsEvaluation')

router.use(cors())

process.env.SECRET_KEY = 'secret'

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));


// @route   POST api/attacksessions/startattacksession
// @desc    Tests users route
// @access  Public
router.post('/startattacksession', auth,
  [
    check('user_id', 'user id is required')
      .not()
      .isEmpty(),
    check('assignment_id', 'assignment id is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    if (req.user.role === "candidate") {
      const { user_id, assignment_id } = req.body
      var new_attack_session = new AttackSession({ user_id: user_id, assignment: assignment_id, in_progress: true });
      new_attack_session.save(function (err, new_attack_session) {
        if (err) return res.json({ result: "failure", reason: err }), console.log(err);  
        console.log(new_attack_session._id + "saved to database")

        var new_attack_session_evaluation = new AttackSessionsEvaluation({ attack_session_id: new_attack_session._id, user_id: req.body.user_id });
        new_attack_session_evaluation.save(function (err, new_attack_session_evaluation) {
          if (err) return res.json({ result: "failure", reason: err }), console.log(err); 
          console.log(new_attack_session_evaluation._id + "save to database")
        });

        return res.json({ result: "success", attack_session_id: new_attack_session._id })
      });




    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  }
);


router.post('/deletesession', auth,
  [
    check('attack_session_id', 'attack session id is required')
      .not()
      .isEmpty(),


  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (req.user.role === "candidate") {
      try {
        const { attack_session_id } = req.body
        var deleteSession = await AttackSession.findByIdAndDelete(attack_session_id);
        var deleteSessionEvaluation = await AttackSessionsEvaluation.findOneAndDelete({ attack_session_id });

        return res.json(deleteSession)
      }

      catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error')
      }
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  }
);







// @route   POST api/attacksessions/attackrequest
// @desc    Start Candidate's session
// @access  Public
router.post('/attackrequest', auth,
  [
    check('attack_session_id', 'Attack session id is required')
      .not()
      .isEmpty(),
    check('user_id', 'User id is required')
      .not()
      .isEmpty(),
    check('assignment_id', 'Assignment id is required')
      .not()
      .isEmpty(),
    check('platform', 'Platform is required')
      .not()
      .isEmpty(),
    check('category', 'Category is required')
      .not()
      .isEmpty(),
    check('end_time', 'End time is required')
      .not()
      .isEmpty(),
    check('machine_name', 'Machine name is required')
      .not()
      .isEmpty(),
    check('tactic_name', 'Tactic name is required')
      .not()
      .isEmpty(),
    check('procedure_id', 'Procedure id is required')
      .not()
      .isEmpty(),
    check('token', 'token is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (req.user.role === "candidate") {
      try {
        await axios(
          {
            method: 'post',
            url: `${attackMachineBaseUrl}attack_request`,
            data: req.body
          }
        ).then(result => { return res.status(200).send('success') }
        )

          .catch(err => {
            return res.status(400).send(err)
          })

      }

      catch (err) {
        return res.status(500).send('Server Error')
      }
    }
    else {
      return res.status(401).send('Unauthorized Access')
    }
  }
);



// @route   POST api/attacksessions/endsession
// @desc    End Candidate's session
// @access  Public
router.post('/endsession', auth,
  [
    check('attack_session_id', 'attack session id is required')
      .not()
      .isEmpty(),


  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (req.user.role === "candidate") {
      try {
        const { attack_session_id, assignment_id } = req.body

        let totalScore = 0
        let totalAggregatedScore = 0

        //yahn se
        await AttackSessionsEvaluation.findOne({ "attack_session_id": req.body.attack_session_id })
          .then(async evaluation => {
            var evalDict = evaluation['_doc']
            var fields = Object.keys(evalDict)


            for (var i = 0; i < fields.length; i++) {

              try {

                if (evalDict[fields[i]].answered) {

                  // let aggregate = await calculateScenarioAggregate(evalDict[fields[i]].score.obtained_score, evalDict[fields[i]].score.try_count)
                  totalScore += evalDict[fields[i]].score.total_score
                  totalAggregatedScore += evalDict[fields[i]].score.score_aggregate

                }
              }
              catch (e) {
                console.log("caught an error" + (e))
              }
            }


          })
          .catch(err => {
            return res.status(500).send('Server Error')
          })







        totalScenariosAggregate = await calculateTotalScenariosAggregate(totalAggregatedScore, totalScore)
        const [percentSavedTime, aggregatedTime] = await calculatePercentSavedTime(req.body.alloted_start_time, req.body.alloted_end_time, req.body.actual_start_time, req.body.actual_end_time)
        endResult = await calculateSessionResult(totalScenariosAggregate, aggregatedTime)





        //yahan tk
        await AttackSession.findByIdAndUpdate(attack_session_id, { "in_progress": false, "end_time": req.body.actual_end_time, "saved_time_percent": percentSavedTime, "result": endResult });
        await Assignments.findByIdAndUpdate(assignment_id, { "pending": false })

        return res.status(200).send("Session ended successfully")
      }

      catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error')
      }
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  }
);



// @route   POST api/attacksessions/getattacksessiontactics
// @desc    Check if a candidate has an running session and get attack id
// @access  Public
router.post('/getattacksessiontactics', auth,
  [
    check('attack_session_id', 'attack session is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    if (req.user.role === "candidate") {
      try {
        await AttackSession.findById(req.body.attack_session_id)
          .then(session => {
            return res.json(
              {
                tactics: session.tactics
              })
          })
          .catch(err => {
            return res.status(500).json({ msg: 'Server Error' })
          })
      }
      catch{
        return res.status(500).json({ msg: 'Server Error' })
      }
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  }
)


// @route   POST api/attacksessions/checkandgetattacksession
// @desc    Check if a candidate has an running session and get attack id
// @access  Public
router.post('/checkandgetattacksession', auth,
  [
    check('user_id', 'user id is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    if (req.user.role === "candidate") {
      try {
        const { user_id } = req.body

        await AttackSession.find({ user_id: user_id, in_progress: true }).populate('assignment', null, { end_time: { "$gte": new Date() } })
          .then(attackSessions => {
            for (i = attackSessions.length - 1; i >= 0; --i) {

              if (attackSessions[i].assignment && attackSessions[i].assignment !== null) {

              }
              else {

                attackSessions[i]['_doc']["in_progress"] = false
                attackSessions[i].markModified("in_progress");
                attackSessions[i].save()
                  .then().catch((err => {
                    console.error(err.message);
                    return res.status(500).json({ msg: 'Server Error' })
                  }
                  ))
                attackSessions.splice(i, 1)

              }
            }
            if (attackSessions.length === 1) {


              AttackSession.findOne({ user_id: req.body.user_id, in_progress: true }).populate({
                path: 'assignment',
                select: ['schedule', 'end_time'],
                match: {},
                populate: {
                  path: 'schedule'
                }
              })
                .then(session => {
                  return res.json(
                    {
                      result: "success",
                      attack_session_id: session['_doc']._id,
                      machine_name: session.assignment.schedule.machine_name,
                      assignment_id: session.assignment._id,
                      start_time: session.assignment.schedule.StartTime,
                      end_time: session.assignment.end_time,
                      session_start_time: session.start_time,
                      tactics: session.tactics
                    }
                  )

                }).catch(err => {
                  console.error(err.message);
                  return res.status(500).json({ msg: 'Server Error' })
                });
            }
            else if (attackSessions.length >= 1) {
              return res.status(400).json({ msg: 'You have two sessions running at a time please contact manager or admin' })
            }
            else {
              return res.status(404).json({ msg: "No session found" })
            }


          }
          ).catch(err => {
            console.error(err.message);
            return res.status(500).json({ msg: 'Server Error' })
          });

      }
      catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' })
      }

    }
    else {
      res.status(401).send('Unauthorized Access')
    }


  });


// @route   POST api/attacksessions/checkattacksession
// @desc    Check if a session is already in progress
// @access  Public
router.post('/checkattacksession', auth,
  [
    check('user_id', 'user id is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    if (req.user.role === "candidate") {

      const { user_id } = req.body

      await AttackSession.find({ user_id: user_id, in_progress: true }).populate('assignment', null, { end_time: { "$gte": new Date() } })
        .then(attackSessions => {
          for (i = attackSessions.length - 1; i >= 0; --i) {

            if (attackSessions[i].assignment && attackSessions[i].assignment !== null) {

            }
            else {

              attackSessions[i]['_doc']["in_progress"] = false
              attackSessions[i].markModified("in_progress");
              attackSessions[i].save()
                .then().catch((err => {
                  console.error(err.message);
                  res.status(500).send('Server Error')
                }
                ))
              attackSessions.splice(i, 1)

            }
          }
          return res.json({ attackSessions })
        }
        ).catch(err => {
          console.error(err.message);
          res.status(500).send('Server Error')
        });

    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  }
);

router.post('/saveuseranswers', auth, async (req, res) => {
  if (req.user.role === "candidate") {


    AttackSessionsEvaluation.findOne(
      {
        attack_session_id: req.body.attack_session_id,
        "in_progress_scenarios.0":
        {
          "$exists": true
        }
      }
    )
      .then(async evaluation => {
        var attack_session_evaluation = evaluation['_doc'];
        var scenarioId = attack_session_evaluation.in_progress_scenarios[0];
        if (!attack_session_evaluation[scenarioId].answered) {
          attack_session_evaluation[scenarioId].user_answers = req.body.user_answers;
          let actual_answers = attack_session_evaluation[scenarioId].actual_answers;

          /*
          Calculating each scenario score in percent
          */
          
          let score = 0;
          let total_score = actual_answers.length * 10


          for (index in actual_answers) {
            //only two equals, so that type is not checked incase of string vs int
            if (actual_answers[index] == req.body.user_answers[index])
              score += 10;
          }
          score = (score / total_score) * 100

          let aggregatedScore = await calculateScenarioAggregate(score, attack_session_evaluation[scenarioId].score.try_count)

          attack_session_evaluation[scenarioId].score.obtained_score = score
          attack_session_evaluation[scenarioId].answered = true;
          attack_session_evaluation[scenarioId].score.score_aggregate = aggregatedScore
          attack_session_evaluation[scenarioId].submission_time = Date.now();
          // attack_session_evaluation[scenarioId].score = { total_score: "", obtained_score: "" }
          // attack_session_evaluation[scenarioId].try_count = 0
          var try_count = attack_session_evaluation[scenarioId].score.try_count
          attack_session_evaluation.in_progress_scenarios.splice(0, 1);
          evaluation['_doc'] = attack_session_evaluation;
          evaluation.markModified("in_progress_scenarios");
          evaluation.markModified(scenarioId);
          evaluation.save()
            .then(async (record) => {
              res.json({ result: "success", msg: "user answer submitted successfully" })

              //here
              await updateUserHistory(req.body.user_id, scenarioId, try_count, score)

            })
            .catch(err => { return res.json({ result: "failure", reason: { err } }) });
        }
        else {
          return res.json({ result: "failure", msg: "either the scenario has already been solved by the user or someone changed database record" })

        }
      }

      )
      .catch(err => { return res.json({ result: "failure", msg: err }) })

  }
  else {
    return res.status(401).send('Unauthorized Access')
  }
});

updateUserHistory = async (usrId, scenarioId, try_count, score) => {
  //testHistory requires userid, tactic name and scenarioid
  tacticId = scenarioId.split('_')[0];
  let tactics =
  {
    Initial_Access: "TA01",
    Execution: "TA02",
    Persistence: "TA03",
    Privilege_Escalation: "TA04",
    Defense_Evasion: "TA05",
    Credential_Access: "TA06",
    Discovery: "TA07",
    Lateral_Movement: "TA08",
    Collection: "TA09",
    Command_and_Control: "TA11",
    Exfiltration: "TA10",
    Impact: "TA040"
  }

  for (key in tactics) {

    if (tacticId === tactics[key]) {
      var tacticName = key;
      break;
    }
  }
  tacticTechnique = tacticName + "." + scenarioId
  tacTecTry = tacticTechnique + ".try_counts"

  await TestHistory.findOneAndUpdate(
    {
      user_id: usrId
    }, {
    $max:
    {
      [tacticTechnique]:
      {
        max_score: score,
      }
    }
  }, {
    new: true,
    upsert: true
  }
  )
    .then(hist => {

      TestHistory.findOneAndUpdate(
        {
          user_id: usrId
        }, {
        $set:
        {
          [tacTecTry]: try_count
        }
      }, {
        new: true,
        upsert: true
      }
      )
        .then(a => console.log(a)).catch(err => console.log(err))
    })
    .catch(err => console.log(err))


}


router.post('/checknewquestions', auth,
  [
    check('attack_session_id', 'attack session id is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    if (req.user.role === "candidate") {
      AttackSessionsEvaluation.findOne(
        {
          attack_session_id: req.body.attack_session_id,
          "in_progress_scenarios.0":
          {
            "$exists": true
          }
        }
      )
        .then(evaluation => {
          if (!evaluation) {
            return res.json({ result: "failure", msg: 'No evaluation found' })
          }
          else {
            var attack_session_evaluation = evaluation['_doc']
            var scenarioId = attack_session_evaluation.in_progress_scenarios[0];

            if ((attack_session_evaluation[scenarioId]).hasOwnProperty('answered') && !attack_session_evaluation[scenarioId].answered) {

              if (attack_session_evaluation[scenarioId].questions && (attack_session_evaluation[scenarioId].questions).length)
                return res.json({ result: "success", questions: attack_session_evaluation[scenarioId].questions })
            }
            return res.json({ result: "failure", msg: 'No questions available in evaluation form' })

          }
        })
        .catch(err => res.json({ result: "failure", msg: err }))

    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  });

// @route   POST api/attacksessions/getdetailedsessionresult
// @desc    Get a detailed evalution result of a session
// @access  Public
router.post('/getdetailedsessionresult', auth,
  [
    check('attack_session_id', 'attack_session_id is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    if (req.user.role === "candidate") {
      try {

        let tactics =
        {
          Initial_Access: "TA01",
          Execution: "TA02",
          Persistence: "TA03",
          Privilege_Escalation: "TA04",
          Defense_Evasion: "TA05",
          Credential_Access: "TA06",
          Discovery: "TA07",
          Lateral_Movement: "TA08",
          Collection: "TA09",
          Command_and_Control: "TA11",
          Exfiltration: "TA10",
          Impact: "TA040"
        }


        let session = await AttackSession.findOne({ _id: req.body.attack_session_id, in_progress: false }).populate(
          {
            path: 'assignment',
            select: ['category', 'tactic_name', 'platform', 'schedule'],
            match: {},
            populate: {
              path: 'schedule',
              select:['EndTime', 'StartTime']
            }
          }
        )
          .select('-__v')
          .select('-tactics')
          .select('-in_progress')
          .select('-user_id')
          .select('-date')

        let evaluation = await AttackSessionsEvaluation.findOne({ attack_session_id: req.body.attack_session_id })

        var fields = Object.keys(evaluation['_doc']);
        let evaluationDetail = {};
        let tacticId = "";
        var tacticName = "";

        for (var i = 0; i < fields.length; i++) {

          try {
            if (evaluation['_doc'][fields[i]].answered) {

              tacticId = fields[i].split('_')[0];
              for (key in tactics) {
                if (tacticId === tactics[key]) {
                  tacticName = key;
                  break;
                }
              }
              evaluationDetail[tacticName] = evaluation['_doc'][fields[i]].score

            }
          }
          catch (e) {
            console.log("Key not found" + (e))
          }
        }

        return res.json({
          evaluationDetails
            :
          {
            session: session,
            evaluation: evaluationDetail
          }

        });

      }
      catch (err) {
        res.status(500).json({ msg: err.message })
      }
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  })


router.post('/getusersessions', auth,
  [
    check('user_id', 'user id is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    if (req.user.role === "candidate") {
      try {
        await normalizeCandidateAssignmentEvaluation(req.body.user_id)

        await AttackSession.find({ user_id: req.body.user_id, in_progress: false }).populate( //'assignment')
          {
            path: 'assignment',
            select: ['category'],
          })
          .select('-__v')
          .select('-tactics')
          .select('-in_progress')
          .select('-user_id')
          .select('-date')
          .then(sessions => {
            return res.json({ sessions: sessions });
          })
      }
      catch (err) {
        res.status(500).json({ msg: err.message })
      }
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  });

normalizeCandidateAssignmentEvaluation = async (userId) => {
  await AttackSession.find({ user_id: userId, in_progress: true }).populate(
    {
      path: 'assignment',
      match: {
        end_time:
        {
          "$lte": new Date()
        }
      },
      populate: {
        path: 'schedule'
      }
    }
  )

    // 'assignment', null, { end_time: { "$lte": new Date() } })
    .then(async attackSessions => {

      let totalScore = 0;
      let totalAggregatedScore = 0;
      let totalScenariosAggregate = 0;
      // let percentSavedTime = 0;
      let endResult = 0;
      for (var i = 0; i < attackSessions.length; i++) {
        totalScore = 0
        totalAggregatedScore = 0
        //set in_progress to false and also set end_time in attack_Session
        if (attackSessions[i].assignment && attackSessions[i].assignment !== null) {

          await AttackSessionsEvaluation.findOne({ "attack_session_id": attackSessions[i]['_doc']['_id'] })
            .then(async evaluation => {
              var evalDict = evaluation['_doc']
              var fields = Object.keys(evalDict)


              for (var i = 0; i < fields.length; i++) {

                try {

                  if (evalDict[fields[i]].answered) {

                    let aggregate = await calculateScenarioAggregate(evalDict[fields[i]].score.obtained_score, evalDict[fields[i]].score.try_count)
                    totalScore += evalDict[fields[i]].score.total_score
                    totalAggregatedScore += aggregate
                    evaluation['_doc'][fields[i]].score.score_aggregate = aggregate
                    evaluation.markModified([fields[i]])

                  }
                }
                catch (e) {
                  console.log("caught an error" + (e))
                }
              }

              await evaluation.save()
                .then(console.log("score updated for each scenario"))

            })

          totalScenariosAggregate = await calculateTotalScenariosAggregate(totalAggregatedScore, totalScore)
          const [percentSavedTime, aggregatedTime] = await calculatePercentSavedTime(attackSessions[i]['_doc'].assignment.schedule.StartTime, attackSessions[i]['_doc'].assignment.end_time, attackSessions[i]['_doc'].start_time, attackSessions[i]['_doc'].end_time)
          endResult = await calculateSessionResult(totalScenariosAggregate, aggregatedTime)

          attackSessions[i]['_doc']["in_progress"] = false
          attackSessions[i]['_doc']["end_time"] = attackSessions[i]['_doc'].assignment.end_time
          attackSessions[i]['_doc'].saved_time_percent = percentSavedTime
          attackSessions[i]['_doc'].result = endResult
          attackSessions[i].markModified("in_progress");
          attackSessions[i].markModified("end_time");
          attackSessions[i].markModified("saved_time_percent");
          attackSessions[i].markModified("result");
          attackSessions[i].save()
            .then(console.log("normlized the session"))
          // .catch((err => {
          //   return res.json({ result: "failure", msg: err })

          // }
          // ))
        }

      }
      console.log(attackSessions)
    }
    )
  // .catch(err => {
  //   return res.json({ result: "failure", msg: err })
  // })

  //set assignments is_pending to false  
  await Assignments.updateMany({ "user_id": userId, end_time: { "$lte": new Date() }, "pending": true }, { "$set": { "pending": false } }, { multi: true })
    .then(result => {
      console.log({ msg: "Success" })
    })
  // .catch(err => {
  //   return res.json({ result: "failure", msg: err })
  // })
}

calculateScenarioAggregate = async (score, tryCount) => {

  if (tryCount > 1) {
    let aggregateScore = score - tryCount
    if (aggregateScore < 0)
      return 0;

    else
      return aggregateScore
  }
  else
    return score
}

calculateTotalScenariosAggregate = async (aggregatedScore, totalScore) => {
  return (aggregatedScore / totalScore) * 100
}

calculatePercentSavedTime = async (alloted_start, alloted_end, actual_start, actual_end) => {

  let percentConsumedTime = Math.round(
    (
      (moment(actual_end).diff(moment(actual_start))) /
      (moment(alloted_end).diff(moment(alloted_start)))
    ) * 100
  )

  //if time taken is less than 75 percent then efficiency is calculated otherwise considered 0
  let aggregatedEfficiencyPercent = 0
  if (percentConsumedTime < 75) {
    aggregatedEfficiencyPercent = 100 - Math.round((percentConsumedTime / 75) * 100)
  }

  return [100 - percentConsumedTime, aggregatedEfficiencyPercent]
}

calculateSessionResult = async (TotalScenariosAggregate, aggregatedEfficiencyPercent) => {
  //75 % weightage for scenario questions and 25% for Time
  return ((TotalScenariosAggregate * 0.75) + (aggregatedEfficiencyPercent * 0.25)) || 0
}

module.exports = router