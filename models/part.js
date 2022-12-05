const mongoose = require('mongoose')
const Schema = mongoose.Schema

const partSchema = new Schema({
    name: String,
    onHand: Number,
    tool: String,
    drawList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Worker'
        }
    ]
})

module.exports = mongoose.model('Part', partSchema)