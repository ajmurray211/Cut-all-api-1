const mongoose = require('mongoose')
let mongoURI = ""

if (process.env.NODE_ENV === "production") {
    mongoURI = process.env.DB_URL;
  } else {
    mongoURI = process.env.LOCALHOST;
  }

mongoose.connect(mongoURI)
// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'Connection error'))
// db.once('open', () => {
//     console.log('Database connected')
// })

module.exports = mongoose