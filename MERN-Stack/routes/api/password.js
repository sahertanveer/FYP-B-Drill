const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const { check, validationResult } = require('express-validator');

const { globalEmail, globalEmailPass } = require('../../config/email')
const config = require('config')
const User = require('../../models/User')
const Manager = require('../../models/Manager')
const Organization = require('../../models/Organization')
const Admin = require('../../models/Admin')

const auth = require('../../middleware/auth')
router.use(cors())
// @route   GET api/password/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/password/forgotPassword
// @desc    Check Assignment time
// @access  Public
router.post('/forgotPassword',
  [
    check('email', 'Email is required')
      .isEmail()
      .exists()
      .trim()
      .normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email
    try {
      //check if user exists
      var role = null

      let user = await User.findOne({ email: email });
      if (user)
        role = "candidate"
      else {
        user = await Manager.findOne({ email: email })
        if (user)
          role = "manager"
        else {
          user = await Organization.findOne({ email: email })
          if (user)
            role = "organization"
          else {
            user = await Admin.findOne({ email: email })
            if (user)
              role = "admin"
            else {
              return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });
            }
          }
        }
      }


      // if (!user) {
      //   return res.status(400).json({ errors: [{ msg: 'User does not exist' }] });
      // }

      const payload = {
        user: {
          email: email,
          role: role
        },
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) console.log({ err });
          else {
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
              subject: 'Reset Password', // Subject line
              html: '<h1><b>B-Drill</b></h1><p><b>We give wings to your skills, you decide where to fly.</b></p><br /><br />' +
                '<h4><b>Reset Password</b></h4>' +
                '<p>To reset your password, Click on url to access the platform. </p>' +
                '<a href=" http://localhost:3000/resetPassword?token=' + token + '">' + 'http://localhost:3000/resetPassword/' + token + '</a>' +
                '<p>This URL is valid only for an hour. </p>' +
                '<br/>' +
                '<br/>' +
                '<p>Regards: </p>' +
                '<p><b>Team B-Drill</b></p>'// plain text body
            };
            transporter.sendMail(mailOptions, function (err, info) {
              if (err)
                return res.status(400).json({ err: [{ msg: 'Email could not sent' }] });
              else
                return res.json({ info })
              // console.log(info);
            })
          }
        }
      )
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
  })

// @route   POST api/password/resetPassword
// @desc    Check Assignment time
// @access  Public
router.post('/resetPassword',
  [
    check('password', 'password is required')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
      .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),

  ],
  auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;
    let email = null;
    try {

      var Role = null
      if (req.user.role === "candidate") {
        email = req.user.email
        Role = User
      }
      else if (req.user.role === "admin") {
        email = req.user.email
        Role = Admin
      }
      else if (req.user.role === "manager") {
        email = req.user.email
        Role = Manager
      }
      else if (req.user.role === "organization") {
        email = req.user.email
        Role = Organization
      }
      else return (res.status(404).send('No matching role found'))

      const salt = await bcrypt.genSalt(10);
      var pwd = await bcrypt.hash(password, salt);
      console.log(email)
      console.log(pwd)

      Role.findOneAndUpdate({ email: email }, { password: pwd }, { new: true })
        .then(usr => {
          console.log(usr)
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
            subject: 'Reset Password', // Subject line
            html: '<h1><b>B-Drill</b></h1><p><b>We give wings to your skills, you decide where to fly.</b></p><br /><br />' +
              '<h4><b>Reset Password</b></h4>' +
              '<p>Password reset successfully. </p>' +
              '<br/>' +
              '<br/>' +
              '<p>Regards: </p>' +
              '<p><b>Team B-Drill</b></p>'
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if (err)
              console.log(err)
            else
              console.log("Email sent")
            // console.log(info);
          })
          return res.status(200).send("Password updated successfully");
        }).catch(err => {
          return res.status(400).send('Could not reset password due to session timeout.');
        })



    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
  })

// @route   GET api/password/authtoken
// @desc    Login User / Returning JWT Token
// @access  Public
router.get('/authtoken', auth, async (req, res) => {
  console.log("GFGCH")
  return res.status(200).json({ msg: "Valid Token" })
})

// @route   POST api/password/changePassword
// @desc    Check Assignment time
// @access  Public
router.post('/changePassword',
  [
    check('_id', 'ID is required')
      .not()
      .isEmpty(),

    check('password', 'password is required')
      .not()
      .isEmpty(),

    check('newpassword', 'New password is required')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
      .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),

  ],
  auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { _id, password, newpassword } = req.body;
    try {

      var Role = null
      if (req.user.role === "candidate") {
        Role = User
      }
      else if (req.user.role === "admin") {
        Role = Admin
      }
      else if (req.user.role === "manager") {
        Role = Manager
      }
      else if (req.user.role === "organization") {
        Role = Organization
      }
      else return (res.status(404).send('No matching role found'))

      let user = await Role.findOne({ _id: _id });

      await bcrypt.compare(password, user.password)
        .then(isMatch => {
          console.log(isMatch)
        }).catch(err => {
          return res.status(400).send('Invalid old password.');
        })

      const salt = await bcrypt.genSalt(10);
      var newpass = await bcrypt.hash(newpassword, salt);
      console.log("newpassword" + newpass)

      Role.findOneAndUpdate(
        { _id: _id },
        { password: newpass },
        { new: true }
      )
        .then(usr => {
          console.log(usr)
          return res.status(200).send("Password updated successfully");
        }).catch(err => {
          return res.status(400).send('Could not change password.');
        })

    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error')
    }

  })
module.exports = router