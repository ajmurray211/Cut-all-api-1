const Part = require('../models/part')
const mongoose = require('mongoose')

//Show all parts
const getParts = async (req, res) => {
    Part
        .find({})
        .sort({ onHand: 1 })
        .populate({ path: 'drawList', options: { limit: 5, sort: { date: 1 } } })
        .then(data => res.status(200).json({ data: data }))
        .catch(error => res.status(400).json({ error: error.message }))
}

// Sorting parts
const sortParts = async (req, res) => {
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
        .then(data => res.status(200).json({ data: data }))
        .catch(err => res.status(404).json({ error: 'There was a problem sorting.' }))
}

// get a part by id
const getSinglePart = async (req, res) => {
    Part.findById(req.params.id).populate('drawList')
        .then(data => res.status(200).json({ data: data }))
}

// Make a new part
const createNewPart = async (req, res) => {
    console.log('new part hit')
    const { name, onHand, tool } = req.body

    let emptyFields = []

    if (!name) {
        emptyFields.push('name')
    }
    if (!onHand) {
        emptyFields.push('onHand')
    }
    if (!tool) {
        emptyFields.push('tool')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
    }

    // add doc to db
    try {
        const part = await Part.create({ name, onHand, tool })
        res.status(201).json(part)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//Update one part by ID
const updatePart = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Part exsists.' })
    }

    Part.findByIdAndUpdate(id, ...req.body, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
        .catch(error => res.status(404).json({ error: 'No such Part exsists.' })
        )
}

//Delete a part by ID
const deletePart = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Part exsists.' })
    }

    const part = Part.findByIdAndDelete({ _id: id })

    if (!part) {
        return res.status(400).json({ error: 'No such workout' })
    }

    res.status(204).json(part)
}

module.exports = { getParts, getSinglePart, deletePart, sortParts, createNewPart, updatePart }
