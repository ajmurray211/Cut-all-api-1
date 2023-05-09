// const nodemailer = require('nodemailer');
// const User = require('../models/User');
// // const TimeCard = require('../models/Timecard');

// const sendTimeSheet = async (req, res) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'your_email@gmail.com',
//                 pass: 'your_email_password'
//             }
//         });

//         const { userId } = req.body;
//         const user = await User.findById(userId).populate('timeCards');
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const timeCards = user.timeCards;
//         if (!timeCards.length) {
//             return res.status(404).json({ error: 'No time cards found for this user' });
//         }

//         const mailOptions = {
//             from: 'your_email@gmail.com',
//             to: user.email,
//             subject: 'Time Sheet',
//             text: `Hello ${user.name}, here is your time sheet:`,
//             attachments: []
//         };

//         for (const card of timeCards) {
//             const cardAttachment = {
//                 filename: `${card.name}_${card.date}.pdf`,
//                 path: `./public/timecards/${card._id}.pdf`
//             };
//             mailOptions.attachments.push(cardAttachment);

//             // delete the timecard once it's been attached to the email
//             await TimeCard.findByIdAndDelete(card._id);
//         }

//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ error: 'An error occurred while sending the email' });
//             } else {
//                 console.log(info.response);
//                 return res.status(200).json({ message: 'Time sheet sent successfully' });
//             }
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'An error occurred while sending the time sheet' });
//     }
// };

// module.exports = { sendTimeSheet };


const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { getTimeCards } = require('../controllers/timeCards');

router.post('/', async (req, res) => {
    try {
        // Get all time cards
        const timeCards = await getTimeCards();

        // Create HTML table for time cards
        let tableHtml = '<table><thead><tr><th>Name</th><th>Date</th><th>Hours</th><th>Notes</th></tr></thead><tbody>';

        timeCards.forEach(timeCard => {
            tableHtml += `<tr><td>${timeCard.name}</td><td>${timeCard.date}</td><td>${timeCard.hours}</td><td>${timeCard.notes}</td></tr>`;
        });

        tableHtml += '</tbody></table>';

        // Send email with time card table as HTML
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: process.env.SEND_TO_EMAIL,
            subject: 'Time sheets',
            html: tableHtml
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to send time sheets' });
            } else {
                console.log('Email sent: ' + info.response);
                res.json({ message: 'Time sheets sent' });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to send time sheets' });
    }
});

module.exports = router;
