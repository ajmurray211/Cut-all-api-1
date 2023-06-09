const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { updateEmailedField } = require('./inventoryServices');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();
const path = require('path');
const PDFDocument = require('pdfkit');

const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN });

const emailLowInventory = async (inventory) => {
    console.log('low inventory email hit')
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

        const doc = new PDFDocument(); // Create a new PDF document

        // Logo
        const imagePath = path.join(__dirname, '..', 'uploads', 'cutall_logo.png');
        doc.image(imagePath, 50, 50, { width: 100 });

        // Title
        const title = 'Low Inventory Report';
        doc.fontSize(25).text(title, { align: 'center' });

        // dates for the week
        function getStartOfWeek(date) {
            const startOfWeek = new Date(date);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            return startOfWeek;
        }

        function getEndOfWeek(date) {
            const endOfWeek = new Date(date);
            endOfWeek.setDate(endOfWeek.getDate() - endOfWeek.getDay() + 6);
            return endOfWeek;
        }

        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        }

        const currentDate = new Date(); // The current date

        const startOfWeek = getStartOfWeek(currentDate);
        const endOfWeek = getEndOfWeek(currentDate);

        const formattedStartOfWeek = formatDate(startOfWeek);
        const formattedEndOfWeek = formatDate(endOfWeek);

        doc.font('Helvetica-Bold').fontSize(12).text(`Date: ${formattedStartOfWeek} - ${formattedEndOfWeek}`, { align: 'center' });

        // List of items
        const listY = 180;
        const itemSpacing = 20;
        const listItemFontSize = 15

        inventory.forEach((part, index) => {
            const itemName = part.name;
            const onHandCount = part.onHand;

            const listItemY = listY + index * itemSpacing;

            doc.fontSize(listItemFontSize).text(`${itemName} - ${onHandCount} remaining.`, 100, listItemY, { align: 'left' });
        });

        // Save the PDF to a buffer
        const buffer = await new Promise((resolve, reject) => {
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.end();
        });

        const mailOptions = {
            from: 'aj.murr4y@gmail.com',
            to: 'murray.aj.murray@gmail.com',
            subject: `Weekly Inventory Alert`,
            text: `The attached PDF outlines parts that are running low in the inventory list and need to be purchased.`,
            attachments: [
                {
                    filename: `Low_inventory.pdf`,
                    content: buffer,
                },
            ],
        };

        // transporter.sendMail(mailOptions, async function (error, info) {
        //     if (error) {
        //         console.log(error);
        //         throw new Error('Failed to low inventory report');
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //         inventory.forEach(async part => {
        //             await updateEmailedField(part._id)
        //         });
        //     }
        // });

    } catch (err) {
        console.log('Error refreshing access token:', err);
        if (err.response && err.response.data) {
            console.log('Token refresh response:', err.response.data);
        }
        throw new Error('Failed to low inventory report');
    }

}

module.exports = { emailLowInventory };