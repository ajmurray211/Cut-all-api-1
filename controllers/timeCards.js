const User = require('../models/user');
const timeCardService = require('../services/timeCardService');
const TimeCard = require('../models/timeCard');

//Show all TimeCards
const getTimeCards = (req, res) => {
    TimeCard.find()
        .then(data => res.status(200).json({ data: data }))
}

const createTimeCard = async (req, res) => {
    try {
        const { date, sheetBody } = req.body;
        const { userId } = req.params;
        const user = await User.findById(userId);

        console.log('hit timecard post')

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const timeCards = [];

        for (const row of sheetBody) {
            const timecard = new TimeCard({ ...row, user: userId, date: date });
            console.log(timecard);
            await timecard.save();
            user.timeCards.push(timecard._id);
            timeCards.push(timecard);
        }

        await user.save();

        return res.status(201).json({ message: 'Time cards created successfully', timeCards });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


//Update one TimeCard by ID
const updateTimeCard = (req, res) => {
    console.log(req.params, req.body)
    TimeCard.findOneAndUpdate({ name: req.params.name }, { $push: { cards: req.body.sheetBody } }, { new: true })
        .then((updatedPost) => res.status(201).json({ updatedPost: updatedPost }))
}

//Delete a TimeCard by ID
const deleteTimeCard = (req, res) => {
    TimeCard.findByIdAndDelete(req.params.id)
        .then((updatedPost) => res.status(204).json({ updatedPost: updatedPost }))
}
//Delete a TimeCard by ID
const deleteAllTimeCards = async (req, res) => {
    await TimeCard.deleteMany({})
        .then((response) => res.status(200).json({ msg: 'you have deleted all time cards from the server' }))
}

module.exports = {
    getTimeCards,
    createTimeCard,
    updateTimeCard,
    deleteTimeCard,
    deleteAllTimeCards,
    sendTimeCards: timeCardService.sendTimeCards // Call the sendTimeCards function from timeCardService
}