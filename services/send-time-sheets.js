const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { getTimeCards, deleteAllTimeCards } = require('../controllers/timeCards');
const { getAllTimeCards } = require('./timeCardService');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();

const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN });

const sendTimeCards = async () => {
    try {
        const { token } = await oauth2Client.getAccessTokenAsync();
        const accessToken = token;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USERNAME,
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: 'aj.murr4y@gmail.com',
            to: 'murray.aj.murray@gmail.com',
            subject: 'Time sheets',
            text: 'hello from nodemailer and the cutall api'
        };

        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
                throw new Error('Failed to send time sheets');
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    } catch (err) {
        console.log('Error refreshing access token:', err);
        console.log('Token refresh response:', err.response.data);
        throw new Error('Failed to send time sheets');
    }
};

module.exports = { sendTimeCards };