const express = require('express')
const router = express.Router()
const {
    getTimeCards,
    createTimeCard,
    updateTimeCard,
    deleteTimeCard,
    deleteAllTimeCards
} = require('../controllers/timeCards')

//Show all TimeCards
router.get('/', getTimeCards)

// Make a new TimeCard and add to a parts draw list 
router.post('/:userId', createTimeCard)

//Delete a TimeCard by ID
router.delete('/', deleteAllTimeCards)

//Update one TimeCard by ID
router.put('/:name', updateTimeCard)

//Delete a TimeCard by ID
router.delete('/:id', deleteTimeCard)

module.exports = router