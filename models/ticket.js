const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ticketSchema = new Schema({
    ticketNum: Number,
    CC: String,
    address: String,
    billTo: String,
    confirmationName: String,
    coreDrilling: String,
    date: String,
    detailsNotCovered: String,
    downTime: String,
    dumpYards: String,
    email: String,
    hammerChipping: String,
    handLabor: String,
    haul: String,
    helperTimes: Schema.Types.Mixed,
    jobBegin: String,
    jobEnd: String,
    jobInfoHTML: String,
    jobInfo: Schema.Types.Mixed,
    jobNum: String,
    jobTotal: {
        combined: String,
        hours: Number,
        mins: Number,
        minutes: Number
    },
    loadExcevate: String,
    milage: String,
    other: String,
    otherWorkers: [String],
    poNum: String,
    powerBreak: String,
    release: String,
    slabSaw: String,
    handSawing: String,
    standby: String,
    timeChart: String,
    totalPaidTime: String,
    travelBegin: String,
    travelEnd: String,
    travelTotal: {
        combined: String,
        hours: Number,
        mins: Number,
        minutes: Number
    },
    truckNum: String,
    wallSawing: String,
    waterControl: String,
    miniBreak: String,
    worker: String,
    jobPerQuote: Boolean,
    workAdded: Boolean
})

module.exports = mongoose.model('Ticket', ticketSchema)