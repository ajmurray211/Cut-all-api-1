const mongoose = require('mongoose')
const Schema = mongoose.Schema

const timeCardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    workCode: {
        type: String,
        required: true
    },
    jobName: {
        type: String,
        required: true
    },
    hours: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model('TimeCard', timeCardSchema);