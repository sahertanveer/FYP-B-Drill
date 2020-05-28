const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const AdminSchema = new Schema({
  username: {
    type: String,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {  //it allows to attach profile image 
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = User = mongoose.model('admin', AdminSchema)