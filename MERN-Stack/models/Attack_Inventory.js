const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const AttackInventorySchema = new Schema({
  procedure_id: {
    type: String,
    required: true,
    unique:true,
  },
  procedure_name: {
    type: String,
    required: true,
  },
  tactic_name: {
    type: String,
  },
  technique_name: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { collection :"attack_inventory"});

module.exports = User = mongoose.model('attack_inventory', AttackInventorySchema)