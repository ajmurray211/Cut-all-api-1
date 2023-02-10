const express = require('express')
const router = express.Router()
const Part = require('../models/part')

//Show all parts
router.get('/', (req, res) => {
    Part.find({}).populate('drawList')
        .then(data => res.status(200).json({ data: data }))
})

// Make a new part
router.post('/', (req, res) => {
    const data = req.body
    Part.create(data)
        .then(part => res.status(201).json({ part: part }))
})

//Update one part by ID
router.put('/:partID', (req, res) => {
    Part.findByIdAndUpdate(req.params.partID, req.body, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
})

//Delete a part by ID
router.delete('/:id', (req, res) => {
    Part.findByIdAndDelete(req.params.id)
        .then((updatedPost) => res.status(204).json({ updatedPost: updatedPost }))
})

// Sorting parts
router.get('/search', (req, res) => {
    const { name, tool, sort } = req.query
    // console.log(req.query)
    if (name) {
        Part.find({ name: { $regex: `${name}` } }).populate('drawList')
            .then(data => { res.status(200).json({ data: data }) })
    } else if (tool) {
        Part.find({ tool: { $regex: `${tool}` } }).populate('drawList')
            .then(data => res.status(200).json({ data: data }))
    } else if (sort) {
        if (sort == 'dec') {
            Part.aggregate([{ $sort: { onHand: -1 } }]).populate('drawList')
                .then(data => res.status(200).json({ data: data }))
        } else if (sort == 'acd') {
            Part.aggregate([{ $sort: { onHand: 1 } }]).populate('drawList')
                .then(data => res.status(200).json({ data: data }))
        }
    }
})

module.exports = router
