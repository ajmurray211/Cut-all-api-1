const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serialNumSchema = new Schema({
    manufacture: String,
    tool: String,
    specNum: String,
    serialNum: String,
})

module.exports = mongoose.model('SerialNum', serialNumSchema)