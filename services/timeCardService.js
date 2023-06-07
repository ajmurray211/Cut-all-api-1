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
        const timecards = await TimeCard.find().populate('user').sort('userId');
        return timecards;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function getUsers() {
    try {
        const users = await User.find({}).populate('timeCards');
        return users;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deleteTimeCardsByUser(userId) {
    try {
        const user = await User.findById(userId).populate('timeCards');
        const timeCards = user.timeCards;

        // Delete each time card
        for (const card of timeCards) {
            await card.remove();
        }

        // Clear the timeCards array in the user document
        user.timeCards = [];
        await user.save();

        console.log('Time cards deleted for user:', user);

        return true;
    } catch (err) {
        console.error('Error deleting time cards:', err);
        return false;
    }
}


async function getCardsById(id) {
    try {
        const timecards = await TimeCard.findById({ id: id }).populate('user');
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

async function deletAllCards() {
    try {
        const deletedPost = await TimeCard.deleteMany({});
        console.log('deleted all cards')
        return deletedPost;
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    createTimeCard,
    getAllTimeCards,
    getUsers,
    getCardsById,
    updateTimeCard,
    deleteTimeCard,
    deletAllCards,
    deleteTimeCardsByUser
};
