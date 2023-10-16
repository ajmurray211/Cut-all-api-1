const SerialNum = require('../models/serialNum');

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
    } catch (error) {
        console.error('Error retrieving serial numbers', error);
        res.status(500).json({ message: 'Error retrieving serial numbers', error: error.message });
    }
};

const createSerialNum = async (req, res) => {
    try {
        const data = req.body;
        const serialNum = await SerialNum.create(data);
        res.status(201).json({ message: 'Created a new serial number successfully!', serialNum });
    } catch (error) {
        console.error('Failed to create a new serial number', error);
        res.status(400).json({ message: 'Failed to create a new serial number', error: error.message });
    }
};

const getJustSerialNumbers = (req, res) => {
    SerialNum.find({}, 'serialNum')
        .then(data => res.status(200).json({ message: 'Successfully found your serial numbers', data }))
        .catch(error => {
            console.error("Failed to retrieve serial numbers", error);
            res.status(500).json({ message: "Failed to retrieve serial numbers", error: error.message });
        });
};

const editSerialNumberJobData = (req, res) => {
    // console.log('hit edit serial number', req.body);
    if (req.body.serialNum) {
        SerialNum.findOne({ serialNum: req.body.serialNum, history: { $elemMatch: { date: req.body.date } } }, { "history.$": 1 })
            .then(serialNumData => {
                const historyItem = serialNumData.history[0];
                console.log(historyItem._id);
                return SerialNum.findOneAndUpdate({ "history._id": historyItem._id }, { $set: { "history.$.runLength": req.body.runLength, "history.$.depth": req.body.depth } }, { new: true });
            })
            .then(updatedHistoryItem => {
                console.log(updatedHistoryItem);
                res.status(200).json({ data: updatedHistoryItem });
            })
            .catch(error => {
                console.error('Error updating serial number job data', error);
                res.status(500).json({ message: 'Error updating serial number job data', error: error.message });
            });
    } else {
        res.status(500).json({ message: 'Error no serial number provided'});
    }
};

const getSingleNum = (req, res) => {
    SerialNum.find({ serialNum: req.params.name })
        .then(data => res.status(200).json({ data }))
        .catch(error => {
            console.error('Error retrieving single serial number', error);
            res.status(500).json({ message: 'Error retrieving single serial number', error: error.message });
        });
};

const updateSerialNum = (req, res) => {
    let { operation } = req.params;
    let update = null;
    if (operation == '2') {
        update = {
            assignedTo: req.body.assignedTo,
            $push: { history: req.body.history },
        };
    } else {
        update = { history: req.body.history };
    }
    SerialNum.findOneAndUpdate({ serialNum: req.body.serialNum }, update, { new: true })
        .then(updatedPost => {
            res.status(201).json({ message: 'Successfully assigned the serial number!', updatedPost });
        })
        .catch(error => {
            console.error('Failed to update the serial number', error);
            res.status(400).json({ message: 'Failed to update the serial number', error: error.message });
        });
};

const deleteSerialNum = (req, res) => {
    SerialNum.findByIdAndDelete(req.params.id)
        .then(response => {
            console.log(response)
            res.status(200).json({ message: 'Successfully deleted the serial number!' });
        })
        .catch(error => {
            console.error('Failed to delete the serial number', error);
            res.status(400).json({ message: 'Failed to delete the serial number', error: error.message });
        });
};

module.exports = {
    getAllSerialNums,
    createSerialNum,
    getJustSerialNumbers,
    editSerialNumberJobData,
    getSingleNum,
    updateSerialNum,
    deleteSerialNum,
};
