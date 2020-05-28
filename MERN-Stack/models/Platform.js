const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const PlatformSchema = new Schema({
  platform_family: {
    type: String,
    required: true,
  },
  platform_name: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { collection :"platforms"});

module.exports = User = mongoose.model('platforms', PlatformSchema)