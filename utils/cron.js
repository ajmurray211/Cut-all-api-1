const cron = require('node-cron');
const sendTimeCards = require('../services/send-time-sheets');

// Schedule email to send every Sunday at 11:30pm
cron.schedule('30 23 * * 0', async () => {
    await sendTimeCards();
}, {
    scheduled: true,
    timezone: "America/New_York"
});
