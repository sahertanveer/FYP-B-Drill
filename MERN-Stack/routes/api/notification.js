const express = require('express')
const router = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');

const config = require('config')
const User = require('../../models/User')
const Manager = require('../../models/Manager')
const Organization = require('../../models/Organization')
const Admin = require('../../models/Admin')
const Notification = require('../../models/Notification')


const auth = require('../../middleware/auth')
router.use(cors())



// @route   POST api/notification/addnewnotification
// @desc    Create notification
// @access  Public
router.post('/addnewnotification',
  [
    check('reciever_role', 'Reciever role is required')
      .not()
      .isEmpty(),

    check('reciever_email', 'Reciever Id is required')
      .not()
      .isEmpty(),

    check('message', 'Message Id is required')
      .not()
      .isEmpty(),

    check('notification_type', 'Notification type is required')
      .not()
      .isEmpty(),

  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { sender, reciever_role, message, reciever_email, notification_type, url }  = req.body;
    const notificationFields = {};
			if (sender) notificationFields.sender = sender;
			if (url)  notificationFields.url = url;
			notificationFields.reciever_role = reciever_role;
			notificationFields.message = message;
			notificationFields.reciever_email = reciever_email;
			notificationFields.notification_type = notification_type;

    try {
      notification = new Notification(notificationFields);
      await notification.save()
      return res.json(notification);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error')
    }
  });

// @route   POST api/notification/readnotification
// @desc    Change Notification status to read.
// @access  Public
router.post('/readnotification',
[
  check('notification_id', 'Notification id is required')
    .not()
    .isEmpty(),

],
async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
 

  try {
    await Notification.findOneAndUpdate({notification_id:req.body.notification_id}, {$set:{read: true}});
    return res.json({msg:"Success"});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});

// @route   POST api/notification/getuseremail
// @desc    Change Notification status to read.
// @access  Public
router.post('/getuseremail',
[
  check('user_id', 'User id is required')
    .not()
    .isEmpty(),
  check('role', 'User Role is required')
    .not()
    .isEmpty(),

],
async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
 
  const {role, user_id} = req.body;
  try {
    let user = null;
		if (role === "admin") {
      user = await Admin.findById( user_id)
      .select('email');
		}
		else if (role === "organization") {
			user = await Organization.findById(user_id)
      .select('email');
		}
		else if (role === "manager") {
			user = await Manager.findById(user_id)
      .select('email');
		}
		else if (role === "candidate") {
			user = await User.findById(user_id)
      .select('email');
		}
		if (user) {
      return res.json(user)
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});



module.exports = router