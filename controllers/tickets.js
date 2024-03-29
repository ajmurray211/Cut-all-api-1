const Ticket = require('../models/ticket')
const mongoose = require('mongoose')
const { emailTicket } = require('../services/send-ticket')

//Show all tickets
const getTickets = async (req, res) => {
    Ticket.find({}).sort({ _id: -1 })
        .then(data => res.status(200).json({ data: data }))
}

const searchTickets = async (req, res) => {
    const { worker, ticketNum, sort } = req.query
    let searchQuery = {}
    if (worker) {
        searchQuery.worker = { $regex: `${worker}` }
    } else if (ticketNum) {
        searchQuery.ticketNum = { $regex: `${ticketNum}` }
    }

    let sortQuery = {}
    if (sort === 'dec') {
        sortQuery.ticketNum = -1
    } else if (sort === 'acd') {
        sortQuery.ticketNum = 1
    }

    Ticket.find(searchQuery)
        .sort(sortQuery)
        .then(data => res.status(200).json({ data: data }));
}

// Make a new ticket
const createTicket = async (req, res) => {
    try {
        const data = req.body;
        const ticket = await Ticket.create(data);
        await emailTicket(ticket);
        res.status(201).json({ ticket: ticket, message: 'You have created a new job ticket in the ledger!' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'An error occurred while creating the ticket.' });
    }
};

const topTicketNum = async (req, res) => {
    await Ticket.findOne({}, 'ticketNum').sort({ ticketNum: -1 })
        .then(data => res.status(200).json({ data: data }))
}

const getWorkerList = async (req, res) => {
    try {
        const { who } = req.params;
        const data = await Ticket.find({ worker: who }).sort({ _id: -1 });
        res.status(200).json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

const getSingleTicket = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Ticket exsists.' })
    }

    Ticket.findById(id).sort({ _id: -1 })
        .then(data => res.status(200).json({ data: data }))
}

//Update one ticket by ID
const updateSingleTicket = async (req, res) => {
    console.log('hit update')
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Ticket exsists.' })
    }

    Ticket.findByIdAndUpdate(id, req.body, { new: true })
        .then((ticket) => res.status(201).json({ ticket: ticket, message: 'Edited the ticket successfully!' }))
}

//Delete a ticket by ID
const deleteTicket = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such Ticket exsists.' })
    }

    Ticket.findByIdAndDelete(id)
        .then((ticket) => res.status(204).json({ ticket: ticket }))
}

module.exports = {
    getTickets,
    searchTickets,
    createTicket,
    topTicketNum,
    getSingleTicket,
    updateSingleTicket,
    deleteTicket,
    getWorkerList
}