const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema

// Create Schema
const ScheduleSchema = new Schema({
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'candidates',
        required: true,
    },
    EndTime: {
        type: Date,
        required: true
    },
    StartTime: {
        type: Date,
        required: true
    },
    Subject: {
        type: String,
        default: "Session"
    },
    IsBlock: {
        type: Boolean,
        default: false
    },
    machine_name: {
        type: String,
        ref: 'machines',
        required: true
    },
    platform: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }

},
    { collection: "schedules" });

module.exports = User = mongoose.model('schedules', ScheduleSchema)