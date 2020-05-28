const express = require('express')
const router = express.Router()
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const { check, validationResult } = require('express-validator');

const User = require('../../models/User')
const Manager = require('../../models/Manager')
const Profile = require('../../models/Profile')
const auth = require('../../middleware/auth')

router.use(cors())

// @route   GET api/profile/test
// @desc    Tests route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Route' }));

const storageEngine = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, fn) {
    fn(null, req.user.id + path.extname(file.originalname)); //+'-'+file.fieldname
  }
});
//init
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 200000 },
  fileFilter: function (req, file, callback) {

    validateFile(file, callback);
  }
}).single('myImage');
var validateFile = function (file, cb) {
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
  }
}

// @route   POST api/profile/uploadphoto
// @desc    Post users profile image
// @access  Private
router.post('/uploadphoto', auth, async (req, res) => {
  upload(req, res, async (error) => {
    console.log(req.file)
    if (error) {
      let msg = null
      if (error.message)
        msg = error.message
      else
        msg = error
      return res.status(400).json({ errors: [{ msg: msg }] });
    } else {
      if (req.file == undefined) {

        return res.status(404).json({ errors: [{ msg: 'Image does not exist' }] });
      } else {

        /**
         * Create new record in mongoDB
         */
        var fullPath = "uploads/" + req.file.filename;
        // var document = {
        //   path:fullPath
        // };
        try {
          if (req.user.role === 'candidate') {
            await User.updateOne({ _id: req.user.id }, { avatar: fullPath })
            await Profile.updateOne({ user: req.user.id }, { path: fullPath })
          }
          else {
            await Manager.updateOne({ _id: req.user.id }, { avatar: fullPath })
            await Profile.updateOne({ manager: req.user.id }, { path: fullPath })
          }

          return res.status(200).json({ msg: "Image uploaded successfully" })
        }
        catch (err) {
          return res.status(404).json({ errors: [{ msg: 'Image could not be uploaded' }] })
        }

      }
    }
  })
})

// @route   GET api/profile/getprofilephoto
// @desc    Get users profile image
// @access  Private
router.get('/getprofilephoto', auth, async (req, res) => {
  await Profile.findOne({ user: req.user.id })
    .then(pro => {
      console.log(pro);
      return res.status(200).json({ photo: pro, msg: "Hoooo gaie" })

    })
    .catch(err => {
      console.log(err)
      return res.status(200).json({ photo: pro, msg: "Hoooo gaie" })
    })

  // Profile.findOne({user:req.user.id}, {path:fullPath})
  // .then( re=>{  return res.status(200).json({msg:"Hoooo gaya"})})
  // .catch(err => console.log(err))


})

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile
      .findOne({ user: req.user.id })
      .populate('user', ['firstname', 'lastname', 'avatar']);

    if (!profile) {
      return res.status(400).json({ errors: [{ msg: 'User profile does not exists' }] });
    }
    return res.json(profile);
    // return res.status(400).json({errors:[{msg:'User profile exists'}]});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

// @route   POST api/profile/
// @desc    Create or update users profile
// @access  Private
router.post('/', auth,
  [
    check('status', 'Status is required')
      .not()
      .isEmpty(),
    check('company', 'Company is required')
      .not()
      .isEmpty(),
    check('dob', 'Date of Birth is required')
      .not()
      .isEmpty(),
    check('skills', 'Skills are required')
      .not()
      .isEmpty()
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      dob, areacode, phone, hometown, city, website, bio, status, company, location,
      skills, interests, achievements, social, organization_id, manager_id,
      //  githubusername, twitter, facebook, linkedin, youtube, instagram,
      education, experience
    } = req.body;

    //Build Profile Object
    const profileFields = {};
    if (organization_id) profileFields.organization_id = organization_id
    if (req.user.role === 'candidate') {
      profileFields.user = req.user.id;
      profileFields.manager_id = manager_id

    }
    else profileFields.manager = req.user.id;

    if (dob) profileFields.dob = dob;
    // if (areacode) profileFields.areacode = areacode;
    // if (phone) profileFields.phone = phone;
    if (areacode && phone) profileFields.contact = areacode + "-" + phone;
    if (hometown) profileFields.hometown = hometown;
    if (city) profileFields.city = city;
    if (website) profileFields.website = website;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (company) profileFields.company = company;
    if (location) profileFields.location = location;

    // Skills - Spilt into array
    if (skills) { profileFields.skills = skills.split(','); }
    // skills.map(skill => skill);
    if (interests) { profileFields.interests = interests.split(','); }
    if (achievements) { profileFields.achievements = achievements.split(','); }

    // Build Social Object
    profileFields.social = {};
    if (social) profileFields.social = social;
    // if (githubusername) profileFields.social.githubusername = githubusername;
    // if (youtube) profileFields.social.youtube = youtube;
    // if (twitter) profileFields.social.twitter = twitter;
    // if (facebook) profileFields.social.facebook = facebook;
    // if (linkedin) profileFields.social.linkedin = linkedin;
    // if (instagram) profileFields.social.instagram = instagram;

    //Build Education Object
    profileFields.education = [];

    if (education) {
      education.map(fields => {
        console.log(fields)
        singleObject = {}
        if (fields.school) singleObject.school = fields.school;
        if (fields.degree) singleObject.degree = fields.degree;
        if (fields.fieldofstudy) singleObject.fieldofstudy = fields.fieldofstudy;
        if (fields.educationfrom) singleObject.educationfrom = fields.educationfrom;
        if (fields.educationto) singleObject.educationto = fields.educationto;
        if (fields.educationcurrent) singleObject.educationcurrent = fields.educationcurrent;
        if (fields.educationdescription) singleObject.educationdescription = fields.educationdescription;
        profileFields.education.push(singleObject)
      })
    }

    //Build Experience Object
    profileFields.experience = [];
    if (experience) {
      experience.map(fields => {
        console.log(fields)
        singleObject = {}
        if (fields.jobtitle) singleObject.jobtitle = fields.jobtitle;
        if (fields.jobcompany) singleObject.jobcompany = fields.jobcompany;
        if (fields.joblocation) singleObject.joblocation = fields.joblocation;
        if (fields.jobfrom) singleObject.jobfrom = fields.jobfrom;
        if (fields.jobto) singleObject.jobto = fields.jobto;
        if (fields.jobcurrent) singleObject.jobcurrent = fields.jobcurrent;
        if (fields.jobdescription) singleObject.jobdescription = fields.jobdescription;
        profileFields.experience.push(singleObject)
      })
    }

    console.log(profileFields.experience)

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update Profile

        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //Create Profile
      console.log(profileFields)
      profile = new Profile(profileFields);
      await profile.save()
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error')
    }
  });

// @route   GET api/profile
// @desc    Get All Profiles
// @access  Public
router.post('/getprofiles', auth, async (req, res) => {
  try {
    let filter = null
    if (req.body.requestedRole === "admin") {
      const profiles = await Profile
        .find()
        .populate("user", ['_id', 'firstname', 'lastname', 'avatar', 'email'])
        .populate("manager", ['_id', 'firstname', 'lastname', 'avatar', 'email'])
      return res.json(profiles);
    }
    else {
      
      let nullField;


      if (req.body.requestedRole === 'organization') {
        filter = 'organization_id'
        //  nullField="manager"
      }
      else {
        filter = 'manager_id'
        //  nullField="user"

      }
      console.log(filter)
      // console.log(nullField)
      // const profiles = await Profile
      //   .find({[field] : req.body.id, [nullField]:null})
      //   .populate(field, ['_id', 'firstname', 'lastname', 'avatar', 'email']);

      const profiles = await Profile
        .find({ [filter]: req.body.id, })
        .populate("user", ['_id', 'firstname', 'lastname', 'avatar', 'email'])
        .populate("manager", ['_id', 'firstname', 'lastname', 'avatar', 'email']);
      return res.json(profiles);

    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error')
  }
});

// @route   GET api/profile/:user_id
// @desc    Get Profile by user ID
// @access  Public
router.post('/getuserprofile', async (req, res) => {
  try {
    console.log(req.body)
    const {role, userId} = req.body
    var field = null
    if (role === "candidate")
      field = "user"
    else
      field = "manager"

    const profile = await Profile.findOne({[field]:userId})
    // const profile = await Profile
    //   .findOne({
    //     $or:
    //       [
    //         {
    //           $and: [
    //             {
    //               user: req.body.userId
    //             }, {
    //               user: {
    //                 $ne: null
    //               }
    //             }
    //           ]
    //         }
    //         , {
    //           $and: [
    //             {
    //               manager: req.body.userId
    //             }, {
    //               manager: {
    //                 $ne: null
    //               }
    //             }
    //           ]
    //         }
    //       ]
    //   })
      .populate(field, ['_id', 'firstname', 'lastname', 'avatar', 'email'])
      console.log(profile)
      return res.json(profile);
      
      // .populate("manager", ['_id', 'firstname', 'lastname', 'avatar', 'email'])

    if (!profile)
      return res.status(400).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    return res.status(500).send('Server Error')
  }
});

// @route   Delete api/profilecand
// @desc    Delete User Profile or User
// @access  Private
router.delete('/', async (req, res) => {
  try {
    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove User
    await User.findOneAndRemove({ user: req.user.id });

    res.json({ msg: 'User Deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error')
  }
});

module.exports = router;