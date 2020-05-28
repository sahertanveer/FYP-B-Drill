const express = require('express')
const router = express.Router()
const cors = require('cors')

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
    // await Profile.findOneAndRemove({ user: req.user.id }); 
    await User.findOneAndDelete({ organization_id: req.body._id});
    await Manager.findOneAndDelete({ organization_id: req.body._id}) 
    await Organization.findOneAndDelete({ _id: req.body._id}) 
    res.status(200).json({ msg: 'Organization Deleted' });
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
    // await Profile.findOneAndRemove({ user: req.user.id }); 
    await User.findOneAndDelete({ manager_id: req.body._id});
    await Manager.findOneAndDelete({ _id: req.body._id}) 
    res.status(200).json({ msg: 'Manager Deleted' });
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
    await Profile.findOneAndDelete({ user: req.body._id }); 
    await User.findOneAndDelete({ _id: req.body._id});
    res.status(200).json({ msg: 'Candidate Deleted' });
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