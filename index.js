const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path');
const mongoose = require('mongoose')
const workerRoutes = require('./routes/workers.js')
const partRoutes = require('./routes/parts.js')
const ticketRoutes = require('./routes/tickets')
const serialNumRoutes = require('./routes/serialNums.js')
const timeCardRoutes = require('./routes/timeCards.js')
const userRoutes = require('./routes/user.js')
const cron = require('node-cron');
const { sendTimeCards } = require('./services/send-time-sheets.js')
const { getUsers } = require('./services/timeCardService.js')
const { getInventory } = require('./services/inventoryServices.js')
const { emailLowInventory } = require('./services/send-low-inventory.js')

const app = express()
dotenv.config()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
mongoose.set('strictQuery', true)

// mongoose.connect(process.env.LOCALHOST)
let mongoURI = ""

if (process.env.NODE_ENV === "production") {
  mongoURI = process.env.DB_URL;
} else {
  mongoURI = 'mongodb://localhost:27017/cut-all-api-1';
}

mongoose.connect(mongoURI)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', () => {
  console.log('Database connected')
})

app.get('/', (req, res) => {
  res.send('test test new api')
})

// Schedule email to send every Sunday at 11:30pm
// cron.schedule('30 23 * * 0', async () => {

// Schedule email to send every 30 minutes to be used for testing
cron.schedule('*/1 * * * *', async () => {

  console.log('cron job run')

  const users = await getUsers()
  const inventory = await getInventory()

  const mappedTimeCards = users.map(async (user) => {
    if (user.timeCards.length !== 0) {
      await sendTimeCards(user);
    }
  })

  if (inventory) {
    await emailLowInventory(inventory)
  }

}, {
  scheduled: true,
  timezone: "America/New_York"
});

// routes
app.use('/workers', workerRoutes)
app.use('/parts', partRoutes)
app.use('/ticket', ticketRoutes)
app.use('/serialNum', serialNumRoutes)
app.use('/timeCards', timeCardRoutes)
app.use('/user', userRoutes)

app.set("port", process.env.PORT || 8080);

app.listen(app.get("port"), () => {
  console.log(`✅ PORT: ${app.get("port")} 🌟`);
});