const express = require('express')
const router = express.Router()
const cors = require('cors')
const { validationResult } = require('express-validator');

const AttackSession = require('../../models/AttackSession')
const Machine = require('../../models/Machine')
const Attack = require('../../models/Attack_Inventory')
const Organization = require('../../models/Organization')
const Manager = require('../../models/Manager')
const User = require('../../models/User')
const auth = require('../../middleware/auth')
router.use(cors())


  // @route   POST api/getlength/getinprogresssessions
  // @desc    Get All Candidates Length
  // @access  Public
  router.post('/getinprogresssessions', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let sessions = await AttackSession.find({ in_progress: true}).countDocuments();
          return res.json({ sessions });
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
});



// @route   POST api/getlength/getmachineslength
// @desc    GET All Organizations Length
// @access  Public
router.post('/getmachineslength', auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
     Machine.countDocuments({}, function(error, machines) {
        return res.json({ machines }); 
    })
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

// @route   POST api/getlength/getattackslength
// @desc    GET All Organizations Length
// @access  Public
router.post('/getattackslength', auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
     Attack.countDocuments({}, function(error, attacks) {
        return res.json({ attacks }); 
    })
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

// @route   POST api/getlength/getorganizationslength
// @desc    GET All Organizations Length
// @access  Public
router.post('/getorganizationslength', auth, async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
         Organization.countDocuments({}, function(error, organizations) {
            return res.json({ organizations });
            
        })

      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
  });
  
      
  // @route   POST api/getlength/getmanagerslength
  // @desc    GET All Managers Lenth
  // @access  Public
  router.post('/getmanagerslength', auth, async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        Manager.countDocuments({}, function(error, managers) {
            return res.json({ managers });
        })

      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
  });
  
  // @route   POST api/getlength/getuserslength
  // @desc    Get All Candidates Length
  // @access  Public
  router.post('/getuserslength', auth, async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        let users = User.countDocuments({}, function(error, users) {
            return res.json({ users });
        })
        
      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
  });
  
  
  
  module.exports = router