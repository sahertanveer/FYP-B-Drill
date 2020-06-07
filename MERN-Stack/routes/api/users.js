const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');

const config = require('config')
const User = require('../../models/User')
const Sessions = require('../../models/AttackSession')
const Assignments = require('../../models/Assignments')

const auth = require('../../middleware/auth')
router.use(cors())
// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
// router.post('/register',
//   [
//     check('firstname', 'First name is required')
//       .not()
//       .isEmpty(),

//     check('lastname', 'Last name is required')
//       .not()
//       .isEmpty(),

//     check('email', 'Email is required')
//       .isEmail()
//       .exists()
//       .trim()
//       .normalizeEmail(),

//     check('password', 'password is required')
//       .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
//       .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),

//   ],
//   async (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { firstname, middlename, lastname, email, password } = req.body;

//     try {
//       //check if user exists
//       let user = await User.findOne({ email });

//       if (user) {
//         return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
//       }

//       //Get user gravatar
//       const avatar = gravatar.url(email, { s: '100', r: 'x', d: 'retro'}, true)

//       user = new User({
//         firstname,
//         middlename,
//         lastname,
//         email,
//         avatar,
//         password
//       })

//       //Encrypy password

//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);

//       await user.save(); //give us promise thats why await is used

//       //Return jsonwebtoken
//       const payload = {
//         user: {
//           id: user.id
//         }
//       }

//       jwt.sign(
//         payload,
//         config.get('jwtSecret'),
//         { expiresIn: 360000 },
//         (err, token) => {
//           if (err) console.log({ err });
//           res.json({ token });
//         }
//       )



//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error')
//     }
//   })

// @route   GET api/users
// @desc    Login User / Returning JWT Token
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === "candidate") {
      const user = await User.findById(req.user.id).select('-password');
      let roleBasedUser = user.toObject()
      roleBasedUser["role"] = "candidate"
      res.json(roleBasedUser)
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  } catch (err) {
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
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      //check if account has been verified
      // if(!user.active) {
      //   return res.status(404).json({errors:[{msg:'You need to verify Email first.'}]})
      // }

      //check if password matches
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(404).json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: "candidate"
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


// @route   GET api/users/getassignments
// @desc    Get candidates pending assignments
// @access  Public
router.post('/getassignments', auth, async (req, res) => {
  if (req.user.role === "candidate") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const { candidate_id } = req.body

      //let assignments =
      await Assignments.find({ end_time: { "$gte": new Date() }, user_id: candidate_id }).populate("schedule").then(   //populate("schedule_id",null,{EndTime:{"$gte":new Date()
        assignments => {
          return res.json({ assignments });
          // else console.log('index', {users: docs});
        }).catch(err => { return res.status(422).json({ errors: errors.array() }) });

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


// @route   POST api/users/checkassignmentstatus
// @desc    Check Assignment time
// @access  Public
router.post('/checkassignmentstatus', auth, async (req, res) => {
  if (req.user.role === "candidate") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {

      const { _id } = req.body
      //let assignments =
      // .populate("schedule",null,{StartTime:{"$gte":new Date(),EndTime:{"$lte":new Date()}}})
      await Assignments.findById(_id).populate("schedule", null, { StartTime: { "$lte": new Date() }, EndTime: { "$gte": new Date() } }).then(   //populate("schedule_id",null,{EndTime:{"$gte":new Date()
        assignment => {
          if (assignment.schedule !== null)
            return res.json({ assignment_validation: true, assignment: assignment });
          else
            res.status(403).send('Forbidden')
          // else console.log('index', {users: docs});
        }).catch(err => { return res.status(422).json({ errors: errors.array() }) });

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



module.exports = router