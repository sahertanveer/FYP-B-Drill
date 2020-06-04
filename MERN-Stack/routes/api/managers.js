const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('config')
const nodemailer = require('nodemailer')
const generator = require('generate-password')
const { check, validationResult } = require('express-validator')
const { globalEmail, globalEmailPass } = require('../../config/email')

const Admin = require('../../models/Admin')
const Organization = require('../../models/Organization')
const Manager = require('../../models/Manager')
const User = require('../../models/User')
const Assignments = require('../../models/Assignments')
const Machine = require('../../models/Machine')
const AttackInventory = require('../../models/Attack_Inventory')
const Schedule = require('../../models/Schedule')
const auth = require('../../middleware/auth')

router.use(cors())

// @route   GET api/managers/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/manager/registerCandidate
// @desc    Register user
// @access  Public

router.post('/registerCandidate', auth,
  [
    check('organization_id', 'Organization ID is required')
      .not()
      .isEmpty(),
    check('manager_id', 'Manager ID is required')
      .not()
      .isEmpty(),
    check('firstname', 'First name is required')
      .not()
      .isEmpty(),

    check('lastname', 'Last name is required')
      .not()
      .isEmpty(),

    check('email', 'Email is required')
      .isEmail()
      .exists()
      .trim()
      .normalizeEmail(),

  ],
  async (req, res) => {
    if (req.user.role === "manager") {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { organization_id, manager_id, firstname, lastname, email } = req.body;

      try {
        //check if user exists
        let user = await Admin.findOne({ email }) || await Organization.findOne({email}) || await Manager.findOne({ email }) || await User.findOne({email})

        if (user) {
          return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        //Get user gravatar
        // const avatar = gravatar.url(email, { s: '100', r: 'x', d: 'retro'}, true)
        const avatar = null
        //random password generation
        const password = generator.generate({
          length: 8,
          numbers: true,
          uppercase: true
        });

        user = new User({
          organization_id,
          manager_id,
          firstname,
          lastname,
          email,
          avatar,
          password
        })

        //Encrypy password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user
          .save()
          .then(user => {
            return res.status(200).json({ message: 'User added successfully. Refreshing data...' })

          }).catch(err => console.log(err));


        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: globalEmail,
            pass: globalEmailPass
          }
        });
        const mailOptions = {
          from: globalEmail, // sender address
          to: email, // list of receivers
          subject: 'Verify Registration', // Subject line
          html: '<h1><b>B-Drill</b></h1><p><b>We give wings to your skills, you decide where to fly.</b></p><br /><br />' +
            '<h3>' + firstname + lastname + '</h3 >' +
            '<p>Thanks for signing up!</p>' +
            '<p>Your account has been created, you can login after you have activated your account by using the credentials below.</p>' +
            '<p>Email: ' + email + '</p>' +
            '<p />Password: ' + password + '</p>' +
            '<p>Click on url to access the platform.' + '</p>' +
            '<a href=" http://localhost:3000/"> http://localhost:3000/ </a>' +
            '<br /><br />' +
            '<p>Delivered By: <b>B-Drill</b></p>'// plain text body
        };

        transporter.sendMail(mailOptions, function (err, info) {
          if (err)
            console.log(err)
          else
            console.log(info);
        })

        console.log("password1" + password)


      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  }


)

// @route   GET api/users
// @desc    Login User / Returning JWT Token
// @access  Public
router.get('/', auth, async (req, res) => {
  try {

    if (req.user.role === "manager") {
      const user = await Manager.findById(req.user.id).select('-password');
      let roleBasedUser = user.toObject()
      roleBasedUser["role"] = "manager"
      console.log(roleBasedUser)
      res.json(roleBasedUser)
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }

});

// @route   GET api/managers/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login',
  [
    check('email', 'Email is required')
      .isEmail(),

    check('password', 'Password is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      //check if user exists
      let user = await Manager.findOne({ email });


      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      //check if password matches
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(404).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      //return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: "manager"
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) console.log({ err });
          res.json({ token });
        }
      )
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
  });

// @route   GET api/managers/getusers
// @desc    Get All Users
// @access  Public
router.post('/getusers', auth, async (req, res) => {
  if (req.user.role === "manager" || req.user.role === "organization") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      console.log(req.body)
      let users = await User.find({ "manager_id": req.body.id }, function (err, docs) {
        if (err) res.json(err);
        // else console.log('index', {users: docs});
      })
        .select('-password')
        .select('-date')
        .select('-__v')
        .select('-manager_id')
        .select('-organization_id')

      return res.json({ users });
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
  }
  else {
    res.status(401).send('Unauthorized Access')
  }
});


// @route   GET api/managers/getmachines
// @desc    Get All Users
// @access  Public
router.post('/getmachines', auth, async (req, res) => {
  if (req.user.role === "manager") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      console.log(req.body)
      let machines = await Machine.find({ "platform": req.body.platform }, function (err, docs) {
        if (err) res.json(err);
        // else console.log('index', {users: docs});
      })
        .select('-plaform')

      return res.json({ machines });
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
  }
  else {
    res.status(401).send('Unauthorized Access')
  }
});

// @route   POST api/managers/checkuser
// @desc    POST Users Checking
// @access  Public
router.post('/checkuser', auth,
  [
    check('user_id', 'user_id is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    if (req.user.role === "manager") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        //check if user exists
        let candidate = await User.findOne({ _id: req.body.user_id })
          .select('_id')
        console.log(candidate)
        if (candidate.length < 1)
          return res.status(400).send('candidate not exist')

        return res.json({ candidate })

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }

    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  });

// @route   POST api/managers/assignattack
// @desc    POST Attack Assignment
// @access  Public
router.post('/assignattack', auth,
  [
    check('manager_id', 'platform is required')
      .not()
      .isEmpty(),
    check('user_id', 'platform is required')
      .not()
      .isEmpty(),
    check('platform', 'platform is required')
      .not()
      .isEmpty(),
    check('machine', 'machine is required')
      .not()
      .isEmpty(),
    check('schedule', 'schedule is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    if (req.user.role === "manager") {
      console.log(req.body)
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const {
         EndTime, StartTime, Subject } = req.body.schedule;
      const {
        user_id, manager_id, procedure_id, machine, platform, category, tactic_name } = req.body

      try {
        if(category === "Scenario"){

        let attack = await AttackInventory.findOne({ procedure_id: procedure_id }, function (err, docs) {
          if (err) res.json(err);
        })
        if (attack.length < 1)
          return res.status(400).send('Procedure does not exist')
      }

        let machines = await Machine.findOne({ platform: platform, machine_name: machine }, function (err, docs) {
          if (err) res.json(err);
        })
        if (machines.length < 1)
          return res.status(400).send('machine does not exist')

        const scheduleFields = {};
        console.log(req.body.schedule)
        if (user_id) scheduleFields.candidate_id = user_id;
        if (EndTime) scheduleFields.EndTime = EndTime;
        if (StartTime) scheduleFields.StartTime = StartTime;
        if (Subject) scheduleFields.Subject = Subject;
        if (machine) scheduleFields.machine_name = machine;
        if (platform) scheduleFields.platform = platform;
        
        scheduleFields.IsBlock = true;
        console.log(44)
        // let machine = await Machine.find({ "platform": platform, "machine_name": machine_name }, function (err, docs) {
        //   if (err) res.json(err);
        // });
        // console.log(machine)
        // if (machine.length < 1) return res.status(404).send('Machine Not Found')

        let schedule = new Schedule(scheduleFields)
        schedule.save().then(record => {
          console.log(req.body)
          // let assignment = new Assignments({ user_id: req.body.user_id, manager_id: req.body.manager_id, procedure_id: req.body.procedure_id, platform: req.body.platform })
          let assignment = new Assignments({ user_id: user_id, manager_id: manager_id, procedure_id: procedure_id, platform: platform, schedule: record._id, category:category, tactic_name:tactic_name, end_time: EndTime })
          assignment.save(function (err, new_assignment) {
            if (err) return res.status(422).json({ errors: errors.array() });
            console.log(new_assignment._id + "save to database")
            return res.status(200).send("Assignment Added Successfully")
          });
        })
          .catch(err => { return res.status(422).json({ errors: errors.array() }) });
      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
    } else {
      res.status(401).send('Unauthorized Access')
    }
  });

// @route   GET api/managers/setschedule
// @desc    Set Calendar Schedule
// @access  Public
router.post('/setschedule', auth,
  [
    check('candidate_id', 'candidate_id is required')
      .not()
      .isEmpty(),
    check('EndTime', 'EndTime is required')
      .not()
      .isEmpty(),
    check('StartTime', 'StartTime is required')
      .not()
      .isEmpty(),
    check('platform', 'platform is required')
      .not()
      .isEmpty(),
    check('machine_name', 'machine_name is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    if (req.user.role === "manager") {
      console.log(req.body)
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        const {
          candidate_id, EndTime, StartTime, Subject, machine_name, platform } = req.body;

        const scheduleFields = {};

        if (candidate_id) scheduleFields.candidate_id = candidate_id;
        if (EndTime) scheduleFields.EndTime = EndTime;
        if (StartTime) scheduleFields.StartTime = StartTime;
        if (Subject) scheduleFields.Subject = Subject;
        if (machine_name) scheduleFields.machine_name = machine_name;
        if (platform) scheduleFields.platform = platform;
        scheduleFields.IsBlock = true;

        let machine = await Machine.find({ "platform": platform, "machine_name": machine_name }, function (err, docs) {
          if (err) res.json(err);
        });
        console.log(machine)
        if (machine.length < 1) return res.status(404).send('Machine Not Found')

        let schedule = new Schedule(scheduleFields)
        schedule.save(function (err, schedule) {
          if (err) return res.status(422).json({ errors: errors.array() });
          console.log(schedule._id + "save to database")
        });
        return res.json({ result: "success" });

      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
    } else {
      res.status(401).send('Unauthorized Access')
    }
  });


// @route   POST api/managers/getschedule
// @desc    POST Schedule
// @access  Public
router.post('/getschedule', auth, [
  check('machine_name', 'machine_name is required')
    .not()
    .isEmpty()
],
  async (req, res) => {
    if (req.user.role === "manager") {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        console.log(req.body)
        let schedules = await Schedule.find({ "machine_name": req.body.machine_name }, function (err, docs) {
          if (err) res.json(err);
          // else console.log('index', {users: docs});
        })
          .select('-platform')
          .select('-date')
          .select('-__v')
          .select('-candidate_id')
          .select('-_id')

        return res.json({ schedules });
      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  });

// @route   POST api/managers/getassignments
// @desc    POST managers given pending assignments
// @access  Public
router.post('/getassignments', auth, async (req, res) => {
  if (req.user.role === "manager") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      console.log(req.body)
      
const {manager_id} = req.body
      console.log(new Date())

//let assignments =
       await Assignments.find({end_time:{"$gte":new Date()}, manager_id:manager_id}).populate("schedule").then(   //populate("schedule_id",null,{EndTime:{"$gte":new Date()
       assignments=> {
        return res.json({ assignments });
        // else console.log('index', {users: docs});
        }) .catch(err => { return res.status(422).json({ errors: errors.array() }) });

     // return res.json({ assignments });
     
      // let schedules = await Schedule.find({ candidate_id: candidate_id, EndTime:{"$gte":new Date()} }, function (err, docs) {
      //   if (err) res.json(err);
      //   // else console.log('index', {users: docs});
      // })
      //   .select('-plaform')

      // return res.json({ schedules });
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
  }
  else {
    res.status(401).send('Unauthorized Access')
  }
});

// @route   POST api/managers/deleteassignment
// @desc    Delete Assignment
// @access  Private
router.post('/deleteassignment', auth, async (req, res) => {
  if (req.user.role === "manager") {
  try {
    //Remove Attack
    await Assignments.findOneAndDelete({ _id: req.body._id})
    .then(async assignment=>{
      await Schedule.findByIdAndDelete(assignment.schedule)
    })

    res.status(200).json({ msg: 'Assignment Deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error')
  }
}
else {
  res.status(401).send('Unauthorized Access')
}
});


module.exports = router