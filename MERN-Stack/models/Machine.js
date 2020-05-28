const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const MachineSchema = new Schema({
  platform: {
    type: String,
    required: true,
  },
  machine_name: {
    type: String,
    required: true,
    unique: true
  },
  architecture: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { collection :"machines"});

module.exports = User = mongoose.model('machines', MachineSchema)