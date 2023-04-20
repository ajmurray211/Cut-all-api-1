const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serialNumSchema = new Schema({
    manufacture: String,
    name: String,
    specNum: String,
    serialNum: String,
    assignedTo: String,
    history: [
        {
            runLength: String,
            depth: String,
            date: String,
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('SerialNum', serialNumSchema)