const TimeCard = require('../models/timeCard');
const User = require('../models/user');

async function createTimeCard(userId, timecardData) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const timecard = new TimeCard({ ...timecardData, user: user._id });
        await timecard.save();
        user.timeCards.push(timecard._id);
        await user.save();
        return timecard;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function getAllTimeCards() {
    try {
        const timecards = await TimeCard.find();
        return timecards;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updateTimeCard(name, sheetBody) {
    try {
        const updatedPost = await TimeCard.findOneAndUpdate(
            { name: name },
            { $push: { cards: sheetBody } },
            { new: true }
        );
        return updatedPost;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deleteTimeCard(id) {
    try {
        const deletedPost = await TimeCard.findByIdAndDelete(id);
        return deletedPost;
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    createTimeCard,
    getAllTimeCards,
    updateTimeCard,
    deleteTimeCard,
};
