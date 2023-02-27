const express = require('express')
const SerialNum = require('../models/serialNum')
const router = express.Router()

//Show all SerialNums
router.get('/', (req, res) => {
    SerialNum.find({}).sort({tool: 1})
        .then(data => res.status(200).json({ data: data }))
})

// Make a new SerialNum
router.post('/', (req, res) => {
    const data = req.body
    SerialNum.create(data)
        .then(serialNum => res.status(201).json({ serialNum: serialNum }))
})

// get only serial numbers
router.get('/numsList', (req,res) => {
    SerialNum.find({}, 'serialNum')
    .then(data => res.status(200).json({ data: data }))
})

//Update one serialNum by ID
router.put('/:serialNumID', (req, res) => {
    let update = {
        assignedTo: req.body.assignedTo,
        $push : {
            history: req.body.history
        }
    }
    console.log(req.body.assignedTo)
    SerialNum.findOneAndUpdate({ serialNum: req.params.serialNumID }, update, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
})

//Delete a serialNum by ID
router.delete('/:id', (req, res) => {
    SerialNum.findByIdAndDelete(req.params.id)
        .then((updatedPost) => res.status(204).json({ updatedPost: updatedPost }))
})

module.exports = router
