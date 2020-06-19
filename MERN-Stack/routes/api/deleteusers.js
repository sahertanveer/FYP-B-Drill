const express = require('express')
const router = express.Router()
const cors = require('cors')
const nodemailer = require('nodemailer')
const { globalEmail, globalEmailPass } = require('../../config/email')
const Organization = require('../../models/Organization')
const Manager = require('../../models/Manager')
const User = require('../../models/User')
const Profile = require ('../../models/Profile')
const auth = require('../../middleware/auth')
router.use(cors())

// @route   POST api/deleteusers/deleteOrganization
// @desc    Delete Managers Profile or Managers or Canidates Profiles or Canidates
// @access  Private
router.post('/deleteOrganization', auth, async (req, res) => {
  if ( req.user.role === "admin" ) {
  try {
    const emailList = []
    await User.find({ organization_id: req.body._id}).then(candidates=>{
      candidates.map(can=>{
        emailList.push(can.email)
    
      })
    })
    .catch(err=>{console.log(err)})
     await Manager.find({ organization_id: req.body._id}).then(managers=>{
      managers.map(man=>{
        emailList.push(man.email)
      })
    })  
    .catch(err=>{console.log(err)})
    const organization = await Organization.findById(req.body._id)
    emailList.push(organization.email)
    await Profile.deleteMany({ organization_id: req.body._id }); 
    await User.deleteMany({ organization_id: req.body._id});
    await Manager.deleteMany({ organization_id: req.body._id}) 
    await Organization.findOneAndDelete({ _id: req.body._id}) 
     res.status(200).json({ msg: 'Organization Deleted' });
   
try{
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: globalEmail,
        pass: globalEmailPass
      }
    });
    const mailOptions = {
      from: globalEmail, // sender address
      to: emailList, // list of receivers
      subject: 'Account Deleted', // Subject line
      html: '<h1><b>B-Drill</b></h1><p><b>We give wings to your skills, you decide where to fly.</b></p><br /><br />' +
        '<h3> Account Deletion Email</h3 >' +
        '<p>Unfortunately we are here to inform you that your account has been deleted. We hope you have enjoyed our services.</p>' +
        '<br />' +
        '<p>We hope you will rejoin us soon!</p>' +
        '<br /><br />' +
        '<p>Regards: <b>B-Drill</b></p>'// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    })
  }
  catch(err){
    console.log(err)
  }
     

  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error')
  }
}
else {
  res.status(401).send('Unauthorized Access')
}
});

// @route   POST api/deleteusers/deleteManager
// @desc    Delete Managers Profile or Managers or Canidates Profiles or Canidates
// @access  Private
router.post('/deleteManager', auth, async (req, res) => {
  if ( req.user.role === "admin" || req.user.role === "organization" ) {
  try {
    
    const emailList = []
    await User.find({ manager_id: req.body._id}).then(candidates=>{
      candidates.map(can=>{
        emailList.push(can.email)
    
      })
    })
    .catch(err=>{console.log(err)});

    const manager = await Manager.findById(req.body._id)
    emailList.push(manager.email)

    await Profile.deleteMany({ manager_id: req.body._id }); 
    await User.deleteMany({ manager_id: req.body._id});
    await Profile.findOneAndDelete({ manager: req.body._id }); 
    await Manager.findOneAndDelete({ _id: req.body._id}) 
    
    res.status(200).json({ msg: 'Manager Deleted' });

try{
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: globalEmail,
        pass: globalEmailPass
      }
    });
    const mailOptions = {
      from: globalEmail, // sender address
      to: emailList, // list of receivers
      subject: 'Account Deleted', // Subject line
      html: '<h1><b>B-Drill</b></h1><p><b>We give wings to your skills, you decide where to fly.</b></p><br /><br />' +
        '<h3> Account Deletion Email</h3 >' +
        '<p>Unfortunately we are here to inform you that your account has been deleted. We hope you have enjoyed our services.</p>' +
        '<br />' +
        '<p>We hope you will rejoin us soon!</p>' +
        '<br /><br />' +
        '<p>Regards: <b>B-Drill</b></p>'// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    })
  }
  catch(err){
    console.log(err)
  }
  
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error')
  }
}
else {
  res.status(401).send('Unauthorized Access')
}
});

// @route   POST api/deleteusers/deleteCandidate
// @desc    Delete User Profile or User
// @access  Private
router.post('/deleteCandidate', auth, async (req, res) => {
  if ( req.user.role === "admin" || req.user.role === "organization" || req.user.role === "manager") {
  try {
    const candidate = await User.findById(req.body._id).select('email')
    await Profile.findOneAndDelete({ user: req.body._id }); 
    await User.findOneAndDelete({ _id: req.body._id});
    
    res.status(200).json({ msg: 'Candidate Deleted' });
    try{
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: globalEmail,
        pass: globalEmailPass
      }
    });
    const mailOptions = {
      from: globalEmail, // sender address
      to: candidate.email, // list of receivers
      subject: 'Account Deleted', // Subject line
      html: '<h1><b>B-Drill</b></h1><p><b>We give wings to your skills, you decide where to fly.</b></p><br /><br />' +
        '<h3> Account Deletion Email</h3 >' +
        '<p>Unfortunately we are here to inform you that your account has been deleted. We hope you have enjoyed our services.</p>' +
        '<br />' +
        '<p>We hope you will rejoin us soon!</p>' +
        '<br /><br />' +
        '<p>Regards>: <b>B-Drill</b></p>'// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    })
  }
  catch(err){
   console.log(err)
  }
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