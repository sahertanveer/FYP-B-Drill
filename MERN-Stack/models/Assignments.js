const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const AssignmentsSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'candidates',
    required: true,
  },
  manager_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'managers'
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'schedules',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tactic_name:{
    type: String,
  },
  procedure_id: {
    type: String,
  },
  end_time:{
    type: Date,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  pending: {
    type: Boolean,
    default: true
  }
}, { collection: "assignments" });

module.exports = User = mongoose.model('assignments', AssignmentsSchema)