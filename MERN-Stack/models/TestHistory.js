const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
// we can also Schema.Types.Mixed for Tactics

// for overriding
//var personSchema = new Schema({ name: String, age: Number }, { collection:'people' });
// or
// mongoose.model( 'person', personSchema, 'people' ) so you refer to it as person, but collection name will be people

const TestHistorySchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'candidates',
    required: true,
  },
  Initial_Access: [{
    type: mongoose.Schema.Types.Mixed
  }],
  Execution: [{
    type: mongoose.Schema.Types.Mixed
  }],
  Persistence: [{
    type: mongoose.Schema.Types.Mixed
  }],
  Privilege_Escalation: [{
    type: mongoose.Schema.Types.Mixed
  }],
  Defense_Evasion: [{
    type: mongoose.Schema.Types.Mixed
  }],
  Credential_Access: [{
    type: mongoose.Schema.Types.Mixed
  }],
  Discovery: [{
    type: mongoose.Schema.Types.Mixed
  }],
  Lateral_Movement: [{
    type: mongoose.Schema.Types.Mixed
  }],
  Collection: [{
    type: mongoose.Schema.Types.Mixed
  }],
  Command_and_Control: [{
    type: mongoose.Schema.Types.Mixed
  }],
  Exfiltration: [{
    type: mongoose.Schema.Types.Mixed
  }],
  Impact: [{
    type: mongoose.Schema.Types.Mixed
  }],
}, {collection:'test_history'})

module.exports = TestHistory = mongoose.model('test_history', TestHistorySchema)