const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');

const config = require('config')
const Assignments = require('../../models/Assignments')
const Admin = require('../../models/Admin')
const Organization = require('../../models/Organization')
const Manager = require('../../models/Manager')
const User = require('../../models/User')
const Schedule = require('../../models/Schedule')
const auth = require('../../middleware/auth')
router.use(cors())

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public

router.post('/register',
  [
    check('username', 'Name is required')
      .not()
      .isEmpty(),

    check('email', 'Email is required')
      .isEmail()
      .exists()
      .trim()
      .normalizeEmail(),

    check('password', 'password is required')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
      .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),

  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      //check if user exists
      let user = await Admin.findOne({ email }) || await Organization.findOne({ email }) || await Manager.findOne({ email }) || await User.findOne({ email })

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = null

      user = new Admin({
        username,
        email,
        avatar,
        password
      })

      //Encrypy password

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save(); //give us promise thats wht await is used

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          username: user.username
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
  })


// @route   GET api/admin/getassignments
// @desc    Get all pending assignments
// @access  Public
router.post('/getassignments', auth, async (req, res) => {
  if (req.user.role === "admin") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await Assignments.find({ end_time: { "$gte": new Date() } }).populate("schedule").then(   //populate("schedule_id",null,{EndTime:{"$gte":new Date()
        assignments => {
          return res.json({ assignments });
        }).catch(err => { return res.status(422).json({ errors: errors.array() }) });
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

// @route   GET api/users
// @desc    Login User / Returning JWT Token
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === "admin") {

      const user = await Admin.findById(req.user.id).select('-password');
      let roleBasedUser = user.toObject();
      roleBasedUser["role"] = "admin";
      res.json(roleBasedUser);

    }
    else {
      res.status(401).send('Unauthorized Access');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }

});

// @route   GET api/users/login
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
      let user = await Admin.findOne({ email });


      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      //check if password matches
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(404).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: "admin"
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

// @route   POST api/admin/getorganizations
// @desc    POST All Organizations
// @access  Public
router.post('/getorganizations', auth, async (req, res) => {
  if (req.user.role === "admin") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      let org = await Organization.find({}, function (err, docs) {
        if (err) res.json(err);
      })
        .select('-password')
        .select('-date')
        .select('-__v')
        .select('-countrycode')
        .select('-phone')
        .select('-address')
        .select('-faxnumber')
        .select('-year')
      return res.json({ org });
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


// @route   POST api/admin/getmanagers
// @desc    POST All Managers
// @access  Public
router.post('/getmanagers', auth, async (req, res) => {
  if (req.user.role === "admin") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let managers = await Manager.find({ "organization_id": req.body.id }, function (err, docs) {
        if (err) res.json(err);
      })
        .select('-password')
        .select('-date')
        .select('-__v')
        .select('-organization_id')

      return res.json({ managers });
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

// @route   GET api/admin/getusers
// @desc    Get All Candidates
// @access  Public
router.post('/getusers', auth, async (req, res) => {
  if (req.user.role === "admin") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let users = await User.find({ "manager_id": req.body.id }, function (err, docs) {
        if (err) res.json(err);
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

// @route   POST api/admin/getschedule
// @desc    POST Schedule
// @access  Public
router.post('/getschedule', auth, [
  check('from', 'Start date is required')
    .not()
    .isEmpty(),
  check('to', 'End date is required')
    .not()
    .isEmpty()
],
  async (req, res) => {
    if (req.user.role === "admin") {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        var { from, to } = req.body;
        let condition = {}
        if (to === "all")
          condition = {
            EndTime:
            {
              $gte: from
            }
          }
        else
          condition = {
            $and: [

              {
                EndTime: { $gte: from }
              }, {
                StartTime: { $lte: to }
              }
            ]
          }
        let schedules = await Schedule.find(condition, function (err, docs) {
          if (err) res.json(err);
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
        return res.status(500).send('Server Error')
      }
    }
    else {
      return res.status(401).send('Unauthorized Access')
    }
  });


module.exports = router