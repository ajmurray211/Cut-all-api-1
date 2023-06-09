const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    onHand: Number,
    tool: {
        type: String,
        required: true
    },
    emailed: {
        type: Boolean,
        default: false,
        set: function (value) {
            const now = new Date();
            const startOfWeek = getStartOfWeek();
            if (now >= startOfWeek) {
                return value;
            } else {
                return false;
            }
        }
    },
    drawList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Worker'
        }
    ],
    image: {
        type: String,
        default: 'uploads/cutall_logo.png'
    },
});

function getStartOfWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysSinceMonday = dayOfWeek - 1; // Sunday is 0, Monday is 1, etc.
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday, 0, 0, 0, 0);
    return startOfWeek;
}

module.exports = mongoose.model('Part', partSchema);