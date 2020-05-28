const express = require('express')
const router = express.Router()
const cors = require('cors')
const { validationResult } = require('express-validator');

const Organization = require('../../models/Organization')
const Manager = require('../../models/Manager')
const User = require('../../models/User')
const auth = require('../../middleware/auth')
router.use(cors())

// @route   GET api/userslength/getorganizations
// @desc    GET All Organizations Length
// @access  Public
router.get('/getorganizations', auth, async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        let org = Organization.countDocuments({}, function(error, numOfDocs) {
            console.log('I have '+numOfDocs+' documents in my collection');
            return res.json({ numOfDocs });
            
        })

      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
  });
  
      
  // @route   GET api/userslength/getmanagers
  // @desc    GET All Managers Lenth
  // @access  Public
  router.get('/getmanagers', auth, async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        Manager.countDocuments({}, function(error, numOfDocs) {
            console.log('I have '+numOfDocs+' documents in my collection');
            return res.json({ numOfDocs });
        })

      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
  });
  
  // @route   GET api/userslength/getusers
  // @desc    Get All Candidates Length
  // @access  Public
  router.get('/getusers', auth, async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        User.countDocuments({}, function(error, numOfDocs) {
            console.log('I have '+numOfDocs+' documents in my collection');
            return res.json({ numOfDocs });
        })
        
      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
  });
  
  
  module.exports = router