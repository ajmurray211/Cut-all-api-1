const nodemailer = require('nodemailer');
const User = require('../models/User');
const TimeCard = require('../models/Timecard');

const sendTimeSheet = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_email_password'
            }
        });

        const { userId } = req.body;
        const user = await User.findById(userId).populate('timeCards');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const timeCards = user.timeCards;
        if (!timeCards.length) {
            return res.status(404).json({ error: 'No time cards found for this user' });
        }

        const mailOptions = {
            from: 'your_email@gmail.com',
            to: user.email,
            subject: 'Time Sheet',
            text: `Hello ${user.name}, here is your time sheet:`,
            attachments: []
        };

        for (const card of timeCards) {
            const cardAttachment = {
                filename: `${card.name}_${card.date}.pdf`,
                path: `./public/timecards/${card._id}.pdf`
            };
            mailOptions.attachments.push(cardAttachment);

            // delete the timecard once it's been attached to the email
            await TimeCard.findByIdAndDelete(card._id);
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'An error occurred while sending the email' });
            } else {
                console.log(info.response);
                return res.status(200).json({ message: 'Time sheet sent successfully' });
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while sending the time sheet' });
    }
};

module.exports = { sendTimeSheet };
