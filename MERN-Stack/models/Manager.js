const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const ManagerSchema = new Schema({
  organization_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'organizations'
  },
  firstname: {
    type: String,
    required: true,
  },
  middlename: {
    type: String,
  },
  lastname: {
    type: String,
    required: true,
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

module.exports = User = mongoose.model('managers', ManagerSchema)