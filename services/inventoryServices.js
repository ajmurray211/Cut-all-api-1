const Part = require('../models/part')

async function getInventory() {
    try {
        const inventory = await Part
            .find({ onHand: { $lte: 5 }})
            .sort({ onHand: 1 })
        return inventory
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updateEmailedField(id) {
    try {
        const updateResult = await Part.findByIdAndUpdate(id, { emailed: false });
        console.log(`part updated: ${updateResult.name} `);
    } catch (err) {
        throw new Error(err.message);
    }
}


module.exports = { getInventory, updateEmailedField }