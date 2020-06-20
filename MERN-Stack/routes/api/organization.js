const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const generator = require('generate-password')
const { check, validationResult } = require('express-validator');
const config = require('config')
const { globalEmail, globalEmailPass } = require('../../config/email')

const Admin = require('../../models/Admin')
const Organization = require('../../models/Organization')
const Manager = require('../../models/Manager')
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const { uiServerUrl } = require('../../config/url')
const auth = require('../../middleware/auth')

router.use(cors())
// @route   GET api/organization/test
// @desc    Tests users route
// @access  Public
router.get('/', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/organization/registerOrganization
// @desc    Register organization
// @access  Public

router.post('/registerOrganization',
  [
    check('username', 'User name is required')
      .not()
      .isEmpty(),
    check('designation', 'Designation name is required')
      .not()
      .isEmpty(),
    check('organizationname', 'Organization name is required')
      .not()
      .isEmpty(),
    check('address', 'Address is required')
      .not()
      .isEmpty(),
    check('email', 'Email is required')
      .isEmail()
      .exists()
      .trim()
      .normalizeEmail(),
    check('year', 'Organization established year is required')
      .not()
      .isEmpty(),
    // check('password', 'password is required')
    //     .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
    //     .withMessage('Password must include one lowercase character, one uppercase character, a number, and a special character.'),

  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, designation, organizationname, address, website, countrycode, phone, faxnumber, email, year } = req.body;

    try {
      //check if user exists
      let org = await Organization.findOne({ email } && { organizationname }) || await Admin.findOne({ email }) || await Manager.findOne({ email }) || await User.findOne({email});

      if (org) {
        return res.status(400).json({ errors: [{ msg: 'Organization already exists' }] });
      }

      //Get user gravatar
      // const avatar = gravatar.url(email, {
      //   s: '200', //size
      //   r: 'pg',   //rating
      //   d: 'mm'    //default
      // })
      const avatar = null

      const contact = Organization.contact = countrycode + "-" + phone;

      const password = generator.generate({
        length: 8,
        numbers: true,
        uppercase: true
      });


      org = new Organization({
        username, designation, organizationname, website, address, contact, faxnumber, avatar, email, password, year
      })
      //Encrypy password
      const salt = await bcrypt.genSalt(10);
      org.password = await bcrypt.hash(password, salt);

      await org.save()
        .then(org => {
          return res.status(200).json({ message: 'Your account has been registered,please verify registration that has been send to your email.' })
        })
      //Return jsonwebtoken
      const payload = { org: { id: org.id } }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) console.log({ err });
          return res.json({ token });
        }
      )

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
          '<h3>' + organizationname + '</h3 >' +
          '<p>Thanks for signing up!</p>' +
          '<p>Your account has been created, you can login after you have activated your account by using the credentials below.</p>' +
          '<p>Email: ' + email + '</p>' +
          '<p />Password: ' + password + '</p>' +
          '<p>Click on url to access the platform.' + '</p>' +
          '<a href=" '+uiServerUrl+'"> '+uiServerUrl+' </a>' +
          '<br /><br />' +
          '<p>Delivered By: <b>B-Drill</b></p>'// plain text body
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err)
          console.log(err)
        else
        return res.status(200).json({ message: 'Your account has been registered,please verify registration that has been send to your email.' })
      })


    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error')
    }
    // }
    // else {
    //      res.status(401).send('Unauthorized Access')
    // }
  }


)

// @route   GET api/organization/login
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
      let user = await Organization.findOne({ email });
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
          role: "organization"
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) console.log({ err });
          return res.json({ token });
        }
      )
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error')
    }
  });

// @route   POST api/organization/registerManager
// @desc    Register Manager
// @access  Public

router.post('/registerManager', auth,
  [
    check('organization_id', 'Organization ID is required')
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
    if (req.user.role === "organization") {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { organization_id, firstname, middlename, lastname, email } = req.body;

      try {
        //check if user exists
        let user = await Admin.findOne({ email }) || await Organization.findOne({email}) || await Manager.findOne({ email }) || await User.findOne({email})
        if (user) {
          return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        const avatar = null

        //random password generation
        const password = generator.generate({
          length: 8,
          numbers: true,
          uppercase: true
        });
        user = new Manager({ organization_id, firstname, middlename, lastname, email, avatar, password })
        //Encrypy password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save()
          .then(user => {
            return res.status(200).json({ message: 'User added successfully. Refreshing data...' })

          })

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
            '<p>Dear</p><h3>' + firstname + '' + lastname +'</h3 >' +
            '<p>Thanks for signing up!</p>' +
            '<p>Your account has been created, you can login after you have activated your account by using the credentials below.</p>' +
            '<p>Email: ' + email + '</p>' +
            '<p />Password: ' + password + '</p>' +
            '<p>Click on url to access the platform.' + '</p>' +
            '<a href=" '+uiServerUrl+'"> '+uiServerUrl+' </a>' +
            '<br /><br />' +
            '<p>Delivered By: <b>B-Drill</b></p>'// plain text body
        };

        transporter.sendMail(mailOptions, function (err, info) {
          if (err)
            console.log(err)
          else
            console.log(info);
        })


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

// @route   POST api/organization/getmanagers
// @desc    POST All Managers
// @access  Public
router.post('/getmanagers', auth, async (req, res) => {
  if (req.user.role === "organization") {
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



// // @route   Delete api/organization
// // @desc    Delete User Profile or User
// // @access  Private
// router.delete('/', async (req, res) => {
//   try {
//     //Remove Profile
//     await Profile.findOneAndRemove({ user: req.user.id });
//     //Remove Manager
//     await Manager.findOneAndRemove({ user: req.user.id });

//     //Remove User
//     await User.findOneAndRemove({ user: req.user.id });

//     return res.status(200).json({ msg: 'User Deleted' });
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send('Server Error')
//   }
// });



// @route   GET api/organization/searchcandidates
// @desc    Get All Candidates
// @access  Public
router.post('/searchcandidates', auth,
[
  check('organization_id', 'Organization ID is required')
    .not()
    .isEmpty()
], async (req, res) => {

  if ( req.user.role === "organization" ) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let users = await User.find({ organization_id: req.body.organization_id }, function (err, docs) {
        if (err) res.json(err);
      })
        .select('-password')
        .select('-date')
        .select('-avatar')
        .select('-__v')
        .select('-manager_id')
        .select('-organization_id')
      return res.json(users);
      
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


// @route   GET api/organization/getusers
// @desc    Get All Canodidates
// @access  Public
router.post('/getusers', auth, async (req, res) => {
  if ( req.user.role === "organization" ) {
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

// // @route   Delete api/organization
// // @desc    Delete User Profile or User
// // @access  Private
// router.delete('/', async (req, res) => {
//   try {
//     //Remove Profile
//     await Profile.findOneAndRemove({ user: req.user.id });
//     //Remove Manager
//     await Manager.findOneAndRemove({ user: req.user.id });

//     //Remove User
//     await User.findOneAndRemove({ user: req.user.id });

//     return res.status(200).json({ msg: 'User Deleted' });
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send('Server Error')
//   }
// });
module.exports = router;