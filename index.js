const express = require('express')
const dotenv = require('dotenv')

const app = express()
dotenv.config()

app.get('/', (req,res) =>{
    res.send('test test new api')
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`)
})