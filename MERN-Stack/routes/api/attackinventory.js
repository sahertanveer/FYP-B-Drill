const express = require('express')
const router = express.Router()
const cors = require('cors')
const auth = require('../../middleware/auth')
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');

router.use(cors())

// const config = require('config')
const Machine = require('../../models/Machine')
const Platform = require('../../models/Platform')
const AttackInventory = require('../../models/Attack_Inventory')

// @route   GET api/attackinventory/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/attackinventory/addorupdatescenario
// @desc     Add or Update Scenario
// @access  Public
router.post('/addorupdatescenario', auth,
  [
    check('procedure_id', 'procedure_id is required')
      .not()
      .isEmpty(),
    check('procedure_name', 'procedure_name is required')
      .not()
      .isEmpty(),
    check('tactic_name', 'tactic_name is required')
      .not()
      .isEmpty(),
    check('technique_name', 'technique_name is required')
      .not()
      .isEmpty(),
    check('category', 'category is required')
      .not()
      .isEmpty(),
    check('platform', 'platform is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    if (req.user.role === "admin" || req.user.role === "manager") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { procedure_id, procedure_name, tactic_name, technique_name, platform, category } = req.body;

      //Build Attack Object
      const attackFields = {};

      attackFields.procedure_id = procedure_id;
      attackFields.procedure_name = procedure_name;
      attackFields.tactic_name = tactic_name;
      attackFields.technique_name = technique_name;
      attackFields.platform = platform;
      attackFields.category = category
  

      try {
        let attack = await AttackInventory.findOne({ procedure_id: procedure_id });

        if (attack) {
          //Update Attack
          attack = await AttackInventory.findOneAndUpdate(
            { procedure_id: procedure_id },
            { $set: attackFields },
            { new: true }
          );
          return res.json(attack);
        }

        //Create Attack
        attack = new AttackInventory(attackFields);
        await attack.save()
        res.json(attack);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  });

// @route   POST api/attackinventory/addorupdatecampaign
// @desc    Add or Update Campaign
// @access  Public
  router.post('/addorupdatecampaign', auth,
  [
    check('procedure_id', 'procedure_id is required')
      .not()
      .isEmpty(),
    check('procedure_name', 'procedure_name is required')
      .not()
      .isEmpty(),
    check('category', 'category is required')
      .not()
      .isEmpty(),
    check('platform', 'platform is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    if (req.user.role === "admin" || req.user.role === "manager") {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { procedure_id, procedure_name, platform, category } = req.body;

      //Build Attack Object
      const attackFields = {};
     
      attackFields.procedure_id = procedure_id;
      attackFields.procedure_name = procedure_name;
      attackFields.platform = platform;
      attackFields.category = category

      try {
        let attack = await AttackInventory.findOne({ procedure_id: procedure_id });

        if (attack) {
          //Update Attack
          attack = await AttackInventory.findOneAndUpdate(
            { procedure_id: procedure_id },
            { $set: attackFields },
            { new: true }
          );
          return res.json(attack);
        }

        //Create Attack
        attack = new AttackInventory(attackFields);
        await attack.save()
        res.json(attack);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  });

// @route   Post api/attackinventory/getallattacks
// @desc    Post All Attacks
// @access  Public
router.post('/getallattacks', auth, async (req, res) => {
  if (req.user.role === "admin" || req.user.role === "manager" || req.user.role === "organization") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let attacks = await AttackInventory.find({}, function (err, docs) {
        if (err) res.json(err);
      })
        .select('-date')
        .select('-__v')

      return res.json({ attacks });
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


// @route   Post api/attackinventory/getscenariosfromid
// @desc    Post Scenario from ID (for editing attack)
// @access  Public
router.post('/getscenariosfromid', auth, async (req, res) => {
  if (req.user.role === "admin") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let attacks = await AttackInventory.find({procedure_id:req.body.procedure_id}, function (err, docs) {
        if (err) res.json(err);
      })
        .select('-date')
        .select('-__v')
        .select('-_id')

      return res.json({ attacks });
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

// @route   POST api/attackinventory/deleteAttack
// @desc    Delete Attack
// @access  Private
router.post('/deleteattack', auth, async (req, res) => {
  if (req.user.role === "admin") {
  try {
    //Remove Attack
    await AttackInventory.findOneAndDelete({ _id: req.body._id}) 

    res.status(200).json({ msg: 'Attack Deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error')
  }
}
else {
  res.status(401).send('Unauthorized Access')
}
});


// @route   POST api/attackinventory/addorupdatemachine
// @desc     Add or Update Machine
// @access  Public

  router.post('/addorupdatemachine', auth,
  [
    check('platform', 'platform is required')
      .not()
      .isEmpty(),
    check('machine_name', 'machine_name is required')
      .not()
      .isEmpty(),
    check('architecture', 'architecture is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    if (req.user.role === "admin" ) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { platform, machine_name, architecture } = req.body;

      //Build Attack Object
      const machineFields = {};
      machineFields.platform = platform;
      machineFields.machine_name = machine_name;
      machineFields.architecture = architecture;
      
      try {

        let pform = await Platform.findOne({ platform_name: platform });

        if (pform) {
         

          let machines = await Machine.findOne({ machine_name: machine_name });
          console.log("foundOne")
          if (machines) {
            //Update Attack
            machines = await Machine.findOneAndUpdate(
              { machine_name: machine_name },
              { $set: machineFields },
              { new: true }
            );
            return res.json(machines);
          }
  
          //Create Attack
          machines = new Machine(machineFields);
          await machines.save()
          res.json(machines);
        }
        else{
          return res.status(404).json("Platform not found");
        }
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
      }
    }
    else {
      res.status(401).send('Unauthorized Access')
    }
  });

// @route   Post api/attackinventory/getallmachines
// @desc    Post All Machines
// @access  Public
router.post('/getallmachines', auth, async (req, res) => {
  if (req.user.role === "admin" || req.user.role === "manager" || req.user.role === "organization") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let machines = await Machine.find({}, function (err, docs) {
        if (err) res.json(err);
      })
        .select('-date')
        .select('-__v')

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

 // @route   Post api/attackinventory/getmachinesfromname
// @desc    Post platform from name (for editing platform)
// @access  Public
router.post('/getmachinesfromname', auth, async (req, res) => {
  if (req.user.role === "admin") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let machines = await Machine.find({machine_name:req.body.machine_name}, function (err, docs) {
        if (err) res.json(err);
      })
        .select('-date')
        .select('-__v')
        .select('-_id')

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


// @route   POST api/attackinventory/deletemachine
// @desc    Delete Attack
// @access  Private
router.post('/deletemachine', auth, async (req, res) => {
  if (req.user.role === "admin") {
  try {
    //Remove Attack
    await Machine.findOneAndDelete({ _id: req.body._id}) 

    res.status(200).json({ msg: 'Machine Deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error')
  }
}
else {
  res.status(401).send('Unauthorized Access')
}
});

// @route   POST api/attackinventory/addorupdateplatform
// @desc     Add or Update Platform
// @access  Public

router.post('/addorupdateplatform', auth,
[
  check('platform_family', 'platform family is required')
    .not()
    .isEmpty(),
  check('platform_name', 'platform name is required')
    .not()
    .isEmpty()
],
async (req, res) => {
  if (req.user.role === "admin" ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { platform_family, platform_name } = req.body;

    //Build Attack Object
    const platformFields = {};
    platformFields.platform_family = platform_family;
    platformFields.platform_name = platform_name;
    
    try {
      //Create Platform
      let platforms = new Platform(platformFields);
      await platforms.save()
      res.json(platforms);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
  }
  else {
    res.status(401).send('Unauthorized Access')
  }
});


// @route   Post api/attackinventory/getallplatforms
// @desc    Post All Platforms
// @access  Public
router.post('/getallplatforms', auth, async (req, res) => {
  if (req.user.role === "admin" || req.user.role === "manager" || req.user.role === "organization") {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let platforms = await Platform.find({}, function (err, docs) {
        if (err) res.json(err);
      })
        .select('-date')
        .select('-__v')

      return res.json({ platforms });
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

 // @route   Post api/attackinventory/getplatformfromname
// @desc    Post platform from name (for editing platform)
// @access  Public
router.post('/getplatformfromname', auth, async (req, res) => {
  if (req.user.role === "admin") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      let platforms = await Platform.find({platform_name:req.body.platform_name}, function (err, docs) {
        if (err) res.json(err);
      })
        .select('-date')
        .select('-__v')
        .select('-_id')

      return res.json({ platforms });
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

// @route   POST api/attackinventory/deleteplatform
// @desc    Delete Platform
// @access  Private
router.post('/deleteplatform', auth, async (req, res) => {
  if (req.user.role === "admin") {
  try {
    //Remove Attack
    await Platform.findOneAndDelete({ _id: req.body._id}) 

    res.status(200).json({ msg: 'Platform Deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error')
  }
}
else {
  res.status(401).send('Unauthorized Access')
}
});

// @route   Post api/attackinventory/getscenariosfromtactic
// @desc    Post All Attacks
// @access  Public
router.post('/getscenariosfromtactic', auth,
  [
    // check('tacticName', 'Tactic Name is required')
    //   .not()
    //   .isEmpty(),
    check('category', 'category is required')
      .not()
      .isEmpty(),
    check('platform', 'platform is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {
    if (req.user.role === "admin" || req.user.role === "manager") {
      //console.log(res)
      const errors = validationResult(req);
      console.log(req.body)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        if(req.body.category === "Scenario"){
         attacks = await AttackInventory.find({ tactic_name: req.body.tacticName, platform: req.body.platform }, function (err, docs) {
          if (err) res.json(err);
        })
          .select('-date')
          .select('-__v')
          .select('-_id')
          .select('-tactic_name')
          .select('-platform')
          .select('-category')
        }
        else{
           attacks = await AttackInventory.find({category:req.body.category , platform: req.body.platform }, function (err, docs) {
            if (err) res.json(err);
          })
            .select('-date')
            .select('-__v')
            .select('-_id')
            .select('-tactic_name')
            .select('-platform')
            .select('-category')
        }
        return res.json({ attacks });

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