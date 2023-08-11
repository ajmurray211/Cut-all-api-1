const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();
const PDFDocument = require('pdfkit');
const { deleteTimeCardsByUser } = require('./timeCardService');
const path = require('path');

const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN });

const sendTimeCards = async (user) => {
    let totalHours = 0;
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

        // Data table
        const userDataFields = ['Name', 'Email', 'Employee #', 'Status', 'Title', 'Truck #'];
        const userData = [
            [
                `${user.firstName} ${user.lastName}`,
                user.email,
                user.employeeNumber,
                user.status,
                user.title,
                user.truckNumber,
            ],
        ];

        const userDataFields1 = ['Name', 'Email', 'Employee #'];
        const userDataFields2 = ['Status', 'Title', 'Truck #'];
        const userData1 = [
            [`${user.firstName} ${user.lastName}`, user.email, user.employeeNumber],
        ];
        const userData2 = [[user.status, user.title, user.truckNumber]];


        // Timecard table
        const timeCardFields = ['Date yyyy/mm/dd', 'Start - End', 'Work Code', 'Job Name', 'Hours', 'Notes'];
        const timeCardData = user.timeCards.map((card) => {
            const hours = parseFloat(card.hours);
            totalHours += hours;
            return [
                card.date,
                `${card.startTime} - ${card.endTime}`,
                card.workCode,
                card.jobName,
                card.hours,
                card.notes,
            ];
        });
        timeCardData.push(['---', '---', '---', '---', `Total Hours: ${totalHours}`, '---']);


        // Calculate the maximum table width based on the page width
        const pageWidth = doc.page.width;
        const tableWidth = pageWidth * 0.9;
        // const tableX = (pageWidth - tableWidth) * 0.08; // 10% from the left of the page
        const tableX = (pageWidth - tableWidth) / 2; // Centered position

        // Calculate the spacing between tables
        const tableSpacing = 20;
        const imageHeight = 100;

        // Set the initial table position
        let tableY = 60 + tableSpacing;

        // Draw data table
        // tableY = drawTable(doc, userDataFields, userData, tableX, tableY, tableWidth);
        tableY = drawTable(doc, userDataFields1, userData1, tableX + 150, tableY - 20, tableWidth - 153);
        drawTable(doc, userDataFields2, userData2, tableX + 150, tableY - 20, tableWidth - 153);

        // Add space between tables
        tableY += tableSpacing * 3;

        // Draw timecard table
        drawTable(doc, timeCardFields, timeCardData, tableX, tableY, tableWidth);

        // Function to draw a table
        function drawTable(doc, headers, rows, tableX, startY, tableWidth) {
            const cellPadding = 5;
            const lineHeight = 20;

            doc.font('Helvetica-Bold');
            doc.fontSize(10);

            // Calculate the width of each table column
            const columnWidth = tableWidth / headers.length;

            // Draw table headers
            let currentY = startY + 5; // Adjust 5 as needed
            headers.forEach((header, i) => {
                const headerX = tableX + i * columnWidth;
                const headerOptions = {
                    width: columnWidth,
                    align: 'center',
                };

                // Calculate the position with padding
                const textX = headerX + 5;
                const textY = currentY + 5; // Adjust 5 as needed

                doc.fillColor('black').underline(textX - 5, currentY + 12, columnWidth, 5).text(header, textX, textY, headerOptions);
            });

            currentY += lineHeight + 5 * 2; // Adjust 5 as needed
            doc.font('Helvetica');
            doc.fontSize(10);

            // Draw table rows
            rows.forEach((row, rowIndex) => {
                const isEvenRow = rowIndex % 2 === 0;

                row.forEach((cell, i) => {
                    const cellX = tableX + i * columnWidth;
                    const cellOptions = {
                        width: columnWidth,
                        align: 'center',
                    };
                    doc.fillColor(isEvenRow ? 'dark grey' : 'black').underline(cellX, currentY + 11, columnWidth, rowIndex + 1 === rows.length ? 0 : 5).text(cell, cellX, currentY, cellOptions);
                });
                currentY += lineHeight;
            });

            // Draw table borders
            const tableBottom = currentY;
            doc.rect(tableX, startY, tableWidth, tableBottom - startY).stroke();

            headers.forEach((header, i) => {
                const headerX = tableX + i * columnWidth;
                doc.moveTo(headerX, startY).lineTo(headerX, tableBottom).stroke();
            });

            rows.forEach(() => {
                // doc.moveTo(tableX, currentY).lineTo(tableX + tableWidth, currentY).stroke();
                currentY += lineHeight;
            });

            doc.moveTo(tableX, tableBottom).lineTo(tableX + tableWidth, tableBottom).stroke();

            // Return the updated Y position for the next table
            return currentY;
        }

        // Save the PDF to a buffer
        const buffer = await new Promise((resolve, reject) => {
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.end();
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            // to: 'billing@cutallconcrete.com',
            to: 'murray.aj.murray@gmail.com',
            bcc: 'murray.aj.murray@gmail.com',
            subject: `Time sheets for ${user.firstName} ${user.lastName}`,
            text: 'Time sheets are attached.',
            attachments: [
                {
                    filename: `${user.firstName}_time_sheet.pdf`,
                    content: buffer, // Attach the PDF buffer as content
                },
            ],
        };

        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
                throw new Error('Failed to send time sheets');
            } else {
                console.log('Email sent: ' + info.response);
                await deleteTimeCardsByUser(user.id)
            }
        });

    } catch (err) {
        console.log('Error refreshing access token:', err);
        if (err.response && err.response.data) {
            console.log('Token refresh response:', err.response.data);
        }
        throw new Error('Failed to send time sheets');
    }
};

module.exports = { sendTimeCards };
