const TimeCard = require('../models/timeCard')

//Show all TimeCards
const getTimeCards = (req, res) => {
    TimeCard.find()
        .then(data => res.status(200).json({ data: data }))
}

// Make a new TimeCard and add to a parts draw list 
const createTimeCard = (req, res) => {
    const { sheetBody } = req.body
    console.log(sheetBody, req.body)
    TimeCard.create(req.body)
        .then(timecard => res.status(201).json({ timecard: timecard }))
}

//Update one TimeCard by ID
const updateTimeCard = (req, res) => {
    console.log(req.params, req.body)
    TimeCard.findOneAndUpdate({ name: req.params.name }, { $push: { cards: req.body.sheetBody } }, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
}

//Delete a TimeCard by ID
const deleteTimeCard = (req, res) => {
    TimeCard.findByIdAndDelete(req.params.id)
        .then((updatedPost) => res.status(204).json({ updatedPost: updatedPost }))
}

module.exports = {
    getTimeCards,
    createTimeCard,
    updateTimeCard,
    deleteTimeCard
}