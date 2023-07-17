const nodemailer = require('nodemailer');
const { google } = require('googleapis');
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

const emailTicket = async (ticket) => {
    console.log('ticket email hit', ticket)
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
            }
        })

        function makeTable(doc, title, headers, data, yPosition, columnCount) {
            const pageWidth = doc.page.width;
            const tableWidth = pageWidth * 0.9;
            const columnWidth = tableWidth / columnCount;
            const rowHeight = 20;
            const borderWidth = 1;
            let textWrapNum = 0;

            // Set table title
            doc.font('Helvetica-Bold').fontSize(14).text(title, 50, yPosition);

            // Set table headers
            if (headers.length > 0) {
                doc.font('Helvetica-Bold').fontSize(10);
                yPosition += rowHeight;
                let xPosition = 30;

                // Draw header cells with borders
                for (let header of headers) {
                    const headerHeight = doc.heightOfString(header, { width: columnWidth });
                    const numLineWraps = Math.ceil(headerHeight / rowHeight) - 1;
                    textWrapNum = Math.max(textWrapNum, numLineWraps);

                    // Draw cell borders
                    doc.rect(xPosition, (yPosition - 3), columnWidth, textWrapNum > 0 ? rowHeight + rowHeight * textWrapNum : rowHeight).stroke();

                    // Draw header text
                    doc.text(header, xPosition, yPosition, {
                        width: columnWidth,
                        align: 'center',
                        lineGap: 5,
                    });
                    xPosition += columnWidth;
                }

                yPosition += textWrapNum > 0 ? rowHeight * textWrapNum : 0;
            }

            // Set table data
            doc.font('Helvetica').fontSize(10);
            yPosition += rowHeight;

            // Draw data cells with borders
            for (let row of data) {
                let xPosition = 30;
                let rowDataWrapNum = 0;

                for (let header of headers) {
                    const cellText = row[header] ? row[header].toString() : '';
                    let cellHeight = doc.heightOfString(cellText, { width: columnWidth });
                    if (cellHeight > 20) { cellHeight += 15; }
                    const numLineWraps = Math.ceil(cellHeight / rowHeight) - 1;
                    rowDataWrapNum = Math.max(rowDataWrapNum, numLineWraps);

                    // Draw cell borders
                    doc.rect(xPosition, (yPosition - 3), columnWidth, rowDataWrapNum > 0 ? rowHeight + rowHeight * rowDataWrapNum : rowHeight).lineWidth(.5).stroke()

                    // Draw cell text
                    doc.text(cellText, xPosition, yPosition, {
                        width: columnWidth,
                        align: 'center',
                        lineGap: 5,
                    });
                    xPosition += columnWidth;
                }

                yPosition += rowDataWrapNum > 0 ? rowHeight + rowHeight * rowDataWrapNum : rowHeight;
            }
            return yPosition;
        }


        const infoHeaders = ['Address', 'Customer', 'Date', 'Truck #', 'Job per Quote', 'Work Added'];
        const infoData = [
            {
                Address: ticket.address || '',
                Customer: ticket.billTo.toUpperCase() || '',
                Date: ticket.date || '',
                'Truck #': ticket.truckNum || '',
                'Job per Quote': ticket.jobPerQuote ? 'Yes' : 'No',
                'Work Added': ticket.workAdded ? 'Yes' : 'No'
            },
        ];

        const workCompletedHeaders = ['Description / Equip. Used', 'QTY', 'LENGTH / DIA', 'Depth (in).', 'Work Code', 'Blade serial #'];
        const workCompletedData = ticket.jobInfo
            ? ticket.jobInfo.map((row) => ({
                'Description / Equip. Used': row.equipUsed || '',
                QTY: row.qty || '',
                'LENGTH / DIA': row.length || '',
                'Depth (in).': row.depth || '',
                'Work Code': row.workCode || '',
                'Blade serial #': row.serialNum || '',
            }))
            : [
                {
                    'Description / Equip. Used': '---',
                    QTY: '---',
                    'LENGTH / DIA': '---',
                    'Depth (in).': '---',
                    'Work Code': '---',
                    'Blade serial #': '---',
                },
            ];

        const workersHeaders = ['Name', 'Travel Time', 'Job Time', 'Total Time', 'Mileage'];
        const workersData = [
            {
                Name: ticket.worker,
                'Travel Time': `${ticket.travelBegin} - ${ticket.travelEnd}`,
                'Job Time': `${ticket.jobBegin} - ${ticket.jobEnd}`,
                'Total Time': ticket.totalPaidTime,
                Mileage: ticket.milage,
            },
        ];
        const mappedWorkersData =
            ticket.helperTimes &&
            Object.keys(ticket.helperTimes).map((name) => {
                const row = ticket.helperTimes[name];
                return {
                    Name: name,
                    'Travel Time': `${row.travelBegin} - ${row.travelEnd}`,
                    'Job Time': `${row.jobBegin} - ${row.jobEnd}`,
                    'Total Time': '---',
                    Mileage: row.milage || '',
                };
            });
        const mergedWorkerData = workersData.concat(mappedWorkersData || []);

        const taskDurationHeaders = ['Task', 'Duration', 'Task ', 'Duration '];
        const taskDurationData = [
            { label: 'Wall sawing', value: ticket.wallSawing },
            { label: 'Hand sawing', value: ticket.handSawing },
            { label: 'Core drilling', value: ticket.coreDrilling },
            { label: 'Slab sawing', value: ticket.slabSaw },
            { label: 'Water control', value: ticket.waterControl },
            { label: 'Jack hammer chipping', value: ticket.hammerChipping },
            { label: 'Power Break / Mini', value: ticket.powerBreak },
            { label: 'Load excavate', value: ticket.loadExcevate },
            { label: 'Hauling', value: ticket.haul },
            { label: 'Hand labor', value: ticket.handLabor },
            { label: 'Dump yards', value: ticket.dumpYards },
            { label: 'Release', value: ticket.release },
            { label: 'Standby', value: ticket.standby },
            { label: 'Down time', value: ticket.downTime },
            { label: 'Other time', value: ticket.other },
        ];

        const filteredTaskData = taskDurationData.filter(task => task.value);

        const pairedTaskData = [];
        for (let i = 0; i < filteredTaskData.length; i += 2) {
            const task1 = filteredTaskData[i];
            const task2 = filteredTaskData[i + 1];

            const pair = {};
            pair.Task = task1.label;
            pair.Duration = task1.value;
            pair['Task '] = task2 ? task2.label : ' --- ';
            pair['Duration '] = task2 ? task2.value : ' --- ';

            pairedTaskData.push(pair);
        }

        const confirmationHeders = ['PO #', 'Job #', 'Emailed to']
        const confirmationData = [{
            'PO #': ticket.poNum || 'None',
            'Job #': ticket.jobNum || 'None',
            'Emailed to': ticket.CC || 'None'
        }]
        const doc = new PDFDocument();

        // generate doc 
        const imagePath = path.join(__dirname, '..', 'uploads', 'cutall_logo.png');
        doc.image(imagePath, 50, 50, { width: 100 });

        const titleX = 150;
        const titleY = 100;

        const title = `Cut-All Concrete Ticket ${ticket.ticketNum}`;
        doc.font('Helvetica-Bold').fontSize(25).text(title, titleX, titleY, { align: 'center' });

        let yPosition = 160;

        yPosition = makeTable(doc, 'Job Information:', infoHeaders, infoData, yPosition, 6);
        yPosition = makeTable(doc, 'Work Completed:', workCompletedHeaders, workCompletedData, yPosition, 6);
        yPosition = makeTable(doc, 'CA men on the job and their times:', workersHeaders, mergedWorkerData, yPosition, 5);
        yPosition = makeTable(doc, 'Task Durations:', taskDurationHeaders, pairedTaskData, yPosition, 4);

        doc.font('Helvetica-Bold').fontSize(14).text('Other Job Notes/Details', 50, yPosition);
        yPosition += 20
        doc.font('Helvetica').fontSize(10).text(ticket.detailsNotCovered ? ticket.detailsNotCovered : 'None', 50,);
        yPosition += 20

        yPosition = makeTable(doc, 'Confirmation Details:', confirmationHeders, confirmationData, yPosition, 3);
        doc.font('Helvetica-Bold').fontSize(15).text(`I ${ticket.confirmationName || ''} have read and agreed to the details and conditions of the job ticket above on behalf of ${ticket.billTo}.`, 50, yPosition);

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
            cc: ticket.CC,
            bcc: 'murray.aj.murray@gmail.com',
            subject: `Cut-All Job Ticket ${ticket.ticketNum}`,
            text: `
Attached is job ticket #${ticket.ticketNum} detailing all work completed by Cut-All for ${ticket.billTo}.

Cut-All Concrete
(p) 425/398-0900
(f) 425/491-7350

15101 300th St NE
Arlington, Wa  98223`,
            attachments: [
                {
                    filename: `Ticket_${ticket.ticketNum}.pdf`,
                    content: buffer,
                },
            ],
        };

        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
                throw new Error('Failed to email ticket');
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    } catch (err) {
        console.log('Error refreshing access token:', err);
        if (err.response && err.response.data) {
            console.log('Token refresh response:', err.response.data);
        }
        throw new Error('Failed to email ticket');
    }

}

module.exports = { emailTicket }; 