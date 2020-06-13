const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const NotificationSchema = new Schema({
  sender:{
    type: mongoose.Schema.Types.String,
    default: "System"
  },
  reciever_role:{
    type: mongoose.Schema.Types.String,
    // required: true
  },
  notification_id:{
    type: mongoose.Schema.Types.String,
    required: true
  },
  reciever_email:{
    type: mongoose.Schema.Types.String,
    required: true
  },
  notification_type:{
    type: mongoose.Schema.Types.String,
    required: true
  },
  message: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  url:{
    type: mongoose.Schema.Types.String,
    default: ""
  },
  read: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
})
// chat:{
  //   type: mongoose.Schema.Types.Boolean,
  //   default: false
  // },
    // reciever_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true
  // },

module.exports = Notification = mongoose.model('notifications', NotificationSchema)