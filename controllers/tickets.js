const express = require('express')
const router = express.Router()
const Ticket = require('../models/ticket')

//Show all tickets
router.get('/', (req, res) => {
    Ticket.find({}).sort({ _id: -1 })
        .then(data => res.status(200).json({ data: data }))
})

// Make a new ticket
router.post('/', async (req, res) => {
    const highestIdDoc = await Ticket.find({}).sort({ ticketNum: -1 }).limit(1);
    let customId = highestIdDoc.length > 0 ? highestIdDoc[0].ticketNum + 1 : 1;
    const data = { ...req.body, ticketNum: customId }
    Ticket.create(data)
        .then(ticket => res.status(201).json({ ticket: ticket }))
})

// router.get('/topTicketNum', (req, res) => {
//     Ticket.find({}).sort({ ticketNum: -1 }).limit(1)
//         .then(data => res.status(200).json(data))
// })


router.get('/:id', (req, res) => {
    Ticket.findById(req.params.id).sort({ _id: -1 })
        .then(data => res.status(200).json({ data: data }))
})

//Update one ticket by ID
router.put('/:ticketID', (req, res) => {
    Ticket.findByIdAndUpdate(req.params.ticketID, req.body, { new: true })
        .then((ticket) => res.status(201).json({ ticket: ticket }))
})

//Delete a ticket by ID
router.delete('/:id', (req, res) => {
    Ticket.findByIdAndDelete(req.params.id)
        .then((ticket) => res.status(204).json({ ticket: ticket }))
})

module.exports = router