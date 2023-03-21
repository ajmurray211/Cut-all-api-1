const express = require('express')
const router = express.Router()
const {
    getTimeCards,
    createTimeCard,
    updateTimeCard,
    deleteTimeCard
} = require('../controllers/timeCards')

//Show all TimeCards
router.get('/', getTimeCards)

// Make a new TimeCard and add to a parts draw list 
router.post('/', createTimeCard)

//Update one TimeCard by ID
router.put('/:name', updateTimeCard)

//Delete a TimeCard by ID
router.delete('/:id', deleteTimeCard)

module.exports = router