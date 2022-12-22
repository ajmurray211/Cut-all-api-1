const express = require('express')
const router = express.Router()
const Part = require('../models/part')

//Show all parts
router.get('/', (req, res) => {
    Part.find()
        .then(data => res.status(200).json({ data: data }))
})

// Make a new part
router.post('/', (req, res) => {
    const data = req.body
    Part.create(data)
        .then(part => res.status(201).json({ part: part }))
})

//Update one part by ID
router.put('/:id', (req, res) => {
    Part.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
})

//Delete a part by ID
router.delete('/:id', (req, res) => {
    Part.findByIdAndDelete(req.params.id)
        .then((updatedPost) => res.status(204).json({ updatedPost: updatedPost }))
})

router.get('/search', (req, res) => {
    const { name, tool } = req.query
    console.log(req.query)
    if (name) {
        Part.find({ name: { $regex: `${name}` } })
            .then(data => res.status(200).json({ data: data }))
    } else if (tool) {
        Part.find({ tool: { $regex: `${tool}` } })
            .then(data => res.status(200).json({ data: data }))
    }
})

module.exports = router
