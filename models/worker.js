const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workerSchema = new Schema({
    name: String,
    amountTaken: Number,
    dateTaken: Date
})

module.exports = mongoose.model('Worker', workerSchema)