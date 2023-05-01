const express = require('express')
const router = express.Router()
const {
    getTickets,
    searchTickets,
    createTicket,
    topTicketNum,
    getSingleTicket,
    updateSingleTicket,
    deleteTicket,
    getWorkerList
} = require('../controllers/tickets.js')

//Show all tickets
router.get('/', getTickets)

// search tickets
router.get('/search', searchTickets)

// get the top ticket number
router.get('/topTicketNum', topTicketNum)

// get a workers ticket list
router.get('/workerList/:who', getWorkerList)

// get a single ticket
router.get('/:id', getSingleTicket)

// Make a new ticket
router.post('/', createTicket)

//Update one ticket by ID
router.put('/:id', updateSingleTicket)

//Delete a ticket by ID
router.delete('/:id', deleteTicket)

module.exports = router
