const express = require('express')
const router = express.Router()
const Part = require('../models/part')

//Show all parts
router.get('/', (req, res) => {
    Part.find({}).sort({ onHand: 1 }).populate({ path: 'drawList', options: { limit: 5, sort: { date: 1 } } })
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
    let searchQuery = {}
    if (name) {
        searchQuery.name = { $regex: `${name}` }
    } else if (tool) {
        searchQuery.tool = { $regex: `${tool}` }
    }

    let sortQuery = {}
    if (sort === 'dec') {
        sortQuery.onHand = -1
    } else {
        sortQuery.onHand = 1
    }

    Part.find(searchQuery)
        .sort(sortQuery)
        .populate({ path: 'drawList', options: { limit: 5, sort: { date: 1 } } })
        .then(data => res.status(200).json({ data: data }));
})

// get a part by id
router.get('/:id', (req, res) => {
    Part.findById(req.params.id).populate('drawList')
        .then(data => res.status(200).json({ data: data }))
})

module.exports = router
