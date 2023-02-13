const express = require('express')
const SerialNum = require('../models/serialNum')
const router = express.Router()

//Show all SerialNums
router.get('/', (req, res) => {
    SerialNum.find({})
        .then(data => res.status(200).json({ data: data }))
})

// Make a new SerialNum
router.post('/', (req, res) => {
    const data = req.body
    SerialNum.create(data)
        .then(serialNum => res.status(201).json({ serialNum: serialNum }))
})

//Update one serialNum by ID
router.put('/:serialNumID', (req, res) => {
    SerialNum.findByIdAndUpdate(req.params.serialNumID, req.body, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
})

//Delete a serialNum by ID
router.delete('/:id', (req, res) => {
    SerialNum.findByIdAndDelete(req.params.id)
        .then((updatedPost) => res.status(204).json({ updatedPost: updatedPost }))
})

module.exports = router
