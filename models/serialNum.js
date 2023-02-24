const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serialNumSchema = new Schema({
    manufacture: String,
    name: String,
    specNum: String,
    serialNum: String,
    history: [
        {
            runLength: String,
            depth: String,
            date: String,
        }
    ]
})

module.exports = mongoose.model('SerialNum', serialNumSchema)