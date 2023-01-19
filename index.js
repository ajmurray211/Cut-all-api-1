const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const workerController = require('./controllers/workers')
const partController = require('./controllers/parts')

const app = express()
dotenv.config()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
mongoose.set('strictQuery', true)

app.get('/', (req, res) => {
    res.send('test test new api')
})

// routes
app.use('/workers', workerController)
app.use('/parts', partController)

app.set("port", process.env.PORT || 8080);

app.listen(app.get("port"), () => {
  console.log(`✅ PORT: ${app.get("port")} 🌟`);
});