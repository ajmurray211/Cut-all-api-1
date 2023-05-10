const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { getTimeCards, deleteAllTimeCards } = require('../controllers/timeCards');

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
            from: 'aj.murr4y@gmail.com',
            to: 'murray.aj.murray@gmail.com',
            subject: 'Time sheets',
            html: tableHtml
        };

        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to send time sheets' });
            } else {
                console.log('Email sent: ' + info.response);

                // Delete all time cards after successful emailing
                try {
                    await deleteAllTimeCards();
                    res.json({ message: 'Time sheets sent and deleted' });
                } catch (err) {
                    console.log(err);
                    res.status(500).json({ message: 'Failed to delete time cards' });
                }
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to send time sheets' });
    }
});

module.exports = router;
