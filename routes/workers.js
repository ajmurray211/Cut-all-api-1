const express = require('express')
const router = express.Router()
const {
    getWorkers,
    createWorker,
    updateWorker,
    deleteWorker
} = require('../controllers/workers.js')

//Show all workers
router.get('/', getWorkers)

// Make a new worker and add to a parts draw list 
router.post('/', createWorker)

//Update one worker by ID
router.put('/:id', updateWorker)

//Delete a worker by ID
router.delete('/:id', deleteWorker)

module.exports = router