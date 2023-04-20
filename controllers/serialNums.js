const express = require('express')
const SerialNum = require('../models/serialNum')

//Show all SerialNums
const getAllSerialNums = async (req, res) => {
  try {
    const data = await SerialNum.find({});
    const sortedData = data.map(doc => {
      if (doc.history) {
        doc.history.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      return doc;
    });
    res.status(200).json({ data: sortedData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving serial numbers", error: err });
  }
};


// Make a new SerialNum
const createSerialNum = async (req, res) => {
    const data = req.body
    SerialNum.create(data)
        .then(serialNum => res.status(201).json({ serialNum: serialNum }))
}

// get only serial numbers
const getJustSerialNumbers = (req, res) => {
    SerialNum.find({}, 'serialNum')
        .then(data => res.status(200).json({ data: data }))
}

const editSerialNumberJobData = (req, res) => {
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
}

const getSingleNum = (req, res) => {
    SerialNum.find({ serialNum: req.params.name })
        .then(data => res.status(200).json({ data: data }))
}

//Update one serialNum by ID
const updateSerialNum = (req, res) => {
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
}

//Delete a serialNum by ID
const deleteSerialNum = (req, res) => {
    SerialNum.findByIdAndDelete(req.params.id)
        .then((updatedPost) => res.status(204).json({ updatedPost: updatedPost }))
}

module.exports = {
    getAllSerialNums,
    createSerialNum,
    getJustSerialNumbers,
    editSerialNumberJobData,
    getSingleNum,
    updateSerialNum,
    deleteSerialNum
}
