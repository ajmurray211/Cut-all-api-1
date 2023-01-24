const express = require('express')
const router = express.Router()
const Ticket = require('../models/ticket')

//Show all tickets
router.get('/', (req, res) => {
    Ticket.find({})
        .then(data => res.status(200).json({ data: data }))
})

// Make a new ticket
router.post('/', (req, res) => {
    const data = req.body
    Ticket.create(data)
        .then(ticket => res.status(201).json({ ticket: ticket }))
})

//Update one ticket by ID
router.put('/:ticketID', (req, res) => {
    Ticket.findByIdAndUpdate(req.params.ticketID, req.body, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
})

module.exports = router