const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema({
  organization_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'organizations'
  },
  manager_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'managers'
  },
  firstname: {
    type: String,
  },
  middlename: {
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
  avatar: {  
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = User = mongoose.model('candidates', UserSchema)