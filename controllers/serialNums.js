const express = require('express')
const { populate, findById, findByIdAndUpdate } = require('../models/serialNum')
const SerialNum = require('../models/serialNum')
const router = express.Router()

//Show all SerialNums
router.get('/', (req, res) => {
    SerialNum.find({}).sort({ tool: 1 })
        .then(data => res.status(200).json({ data: data }))
})

// Make a new SerialNum
router.post('/', (req, res) => {
    const data = req.body
    SerialNum.create(data)
        .then(serialNum => res.status(201).json({ serialNum: serialNum }))
})

// get only serial numbers
router.get('/numsList', (req, res) => {
    SerialNum.find({}, 'serialNum')
        .then(data => res.status(200).json({ data: data }))
})

router.put('/editJobInfo', (req, res) => {
    console.log('hit update', req.body)
    SerialNum.findOne({
        serialNum: req.body.serialNum,
        history: {
            $elemMatch: { date: req.body.date }
        }
    },
        {
            "history.$": 1
        })
        .then(serialNumData => {
            const historyItem = serialNumData.history[0];
            console.log(historyItem._id);
            return SerialNum.findOneAndUpdate({
                "history._id": historyItem._id
            }, {
                $set: {
                    "history.$.runLength": req.body.runLength,
                    "history.$.depth": req.body.depth
                }
            }, {
                new: true
            });
        })
        .then(updatedHistoryItem => {
            console.log(updatedHistoryItem)
            res.status(200).json({ data: updatedHistoryItem });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: error });
        })
})

router.get('/:name', (req, res) => {
    SerialNum.find({ serialNum: req.params.name })
        .then(data => res.status(200).json({ data: data }))
})

//Update one serialNum by ID
router.put('/update/:operation', (req, res) => {
    let { operation } = req.params
    let update = null
    if (operation == '2') {
        update = {
            assignedTo: req.body.assignedTo,
            $push: {
                history: req.body.history
            }
        }
    } else {
        update = {
            history: req.body.history
        }
    }
    SerialNum.findOneAndUpdate({ serialNum: req.body.serialNum }, update, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
})

//Delete a serialNum by ID
router.delete('/:id', (req, res) => {
    SerialNum.findByIdAndDelete(req.params.id)
        .then((updatedPost) => res.status(204).json({ updatedPost: updatedPost }))
})

module.exports = router
