const User = require('../models/User');
const TimeCard = require('../models/Timecard');
const sendTimeCards = require('../routes/send-time-sheets.js');

// //Show all TimeCards
const getTimeCards = (req, res) => {
    TimeCard.find()
        .then(data => res.status(200).json({ data: data }))
}

// Make a new TimeCard and add to a parts draw list 
// const createTimeCard = (req, res) => {
//     const { sheetBody } = req.body
//     console.log(sheetBody, req.body)
//     TimeCard.create(req.body)
//         .then(timecard => res.status(201).json({ timecard: timecard }))
// }

//Update one TimeCard by ID
const updateTimeCard = (req, res) => {
    console.log(req.params, req.body)
    TimeCard.findOneAndUpdate({ name: req.params.name }, { $push: { cards: req.body.sheetBody } }, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
}

// //Delete a TimeCard by ID
const deleteTimeCard = (req, res) => {
    TimeCard.findByIdAndDelete(req.params.id)
        .then((updatedPost) => res.status(204).json({ updatedPost: updatedPost }))
}

// new timecard data follow new structure
const createTimeCard = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const timecardData = req.body;
        const timecard = new Timecard({ ...timecardData, user: user._id });
        await timecard.save();
        user.timeCards.push(timecard._id);
        await user.save();
        res.status(201).json(timecard);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const sendTimeSheets = async (req, res) => {
    try {
        await sendTimeSheets();
        res.json({ message: 'Time sheets sent' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteAllTimecards = async (req, res) => {
    try {
        await Timecard.deleteMany();
        res.json({ message: 'All timecards deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    deleteAllTimecards,
    getTimeCards,
    createTimeCard,
    updateTimeCard,
    deleteTimeCard
}