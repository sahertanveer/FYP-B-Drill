const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const AttackSessionsEvaluationSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'candidates'
  },

  attack_session_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'attack_sessions',
  }
})

module.exports = AttackSessionsEvaluation = mongoose.model('attack_sessions_evaluation', AttackSessionsEvaluationSchema)