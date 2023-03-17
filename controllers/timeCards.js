const express = require('express')
const Part = require('../models/part')
const router = express.Router()
const TimeCard = require('../models/timeCard')

//Show all TimeCards
router.get('/', (req, res) => {
    TimeCard.find()
        .then(data => res.status(200).json({ data: data }))
})

// Make a new TimeCard and add to a parts draw list 
router.post('/', (req, res) => {
    const { sheetBody } = req.body
    console.log(sheetBody, req.body)
    TimeCard.create(req.body)
        .then(timecard => res.status(201).json({ timecard: timecard }))
})

//Update one TimeCard by ID
router.put('/:name', (req, res) => {
    console.log(req.params, req.body)
    TimeCard.findOneAndUpdate({ name: req.params.name }, { $push: { cards: req.body.sheetBody } }, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
})


//Delete a TimeCard by ID
router.delete('/:id', (req, res) => {
    TimeCard.findByIdAndDelete(req.params.id)
        .then((updatedPost) => res.status(204).json({ updatedPost: updatedPost }))
})

module.exports = router