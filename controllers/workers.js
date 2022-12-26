const express = require('express')
const Part = require('../models/part')
const router = express.Router()
const Worker = require('../models/worker')

//Show all workers
router.get('/', (req, res) => {
    Worker.find()
        .then(data => res.status(200).json({ data: data }))
})

// Make a new worker and add to a parts draw list 
router.post('/', async (req, res) => {
    const { data, partID } = req.body
    Worker.create(req.body)
        .then(async (worker) => {
            res.status(201).json({ worker: worker })
            const part = await Part.findById(partID)
            part.drawList.push(worker._id)
            await part.save()
        })
})

//Update one worker by ID
router.put('/:id', (req, res) => {
    Worker.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
})

//Delete a worker by ID
router.delete('/:id', (req, res) => {
    Worker.findByIdAndDelete(req.params.id)
        .then((updatedPost) => res.status(204).json({ updatedPost: updatedPost }))
})

module.exports = router