const express = require('express')
const dotenv = require('dotenv')
const workerController = require('./controllers/workers')
const partController = require('./controllers/parts')

const app = express()
dotenv.config()

app.get('/', (req, res) => {
    res.send('test test new api')
})

app.use('/workers', workerController)
app.use('/parts', partController)

app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`)
})