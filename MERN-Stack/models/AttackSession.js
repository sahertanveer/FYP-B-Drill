const mongoose = require('mongoose')
const Double = require('@mongoosejs/double')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const AttackSessionSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'candidates',
    required: true,
  },
  assignment:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'assignments',
    required: true,
  },
  in_progress: {
    type: Boolean,
    default: true
  },
  tactics:{
    type: Array,
    default:[]
  },
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: {
    type: Date,
    default:null
  },
  saved_time_percent: {
    type: Double,
    default:null
  },
  result:{
    type: Double,
    default:null
  },
  incomplete_attack_error:{
    type: Boolean,
    default: false
  }
})

module.exports = AttackSession = mongoose.model('attack_sessions', AttackSessionSchema)