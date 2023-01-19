const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Part = require('../models/part')

let mongoURI = ""

if (process.env.NODE_ENV === "production") {
    mongoURI = process.env.DB_URL;
} else {
    mongoURI = 'mongodb://localhost:27017/cut-all-api-1';
}

mongoose.connect(mongoURI)
const db = mongoose.connection
mongoose.set('strictQuery', true)
db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', () => {
    console.log('Database seeded with stock information')
})


const list = [
    {
        name: '18" concrete blade',
        count: 3,
        tool: 'Concrete saw'
    },
    {
        name: '24" concrete blade',
        count: 10,
        tool: 'Concrete saw'
    },
    {
        name: '30" concrete blade',
        count: 7,
        tool: 'Concrete saw'
    },
    {
        name: '36" concrete blade',
        count: 2,
        tool: 'Concrete saw'
    },
    {
        name: '42" concrete blade',
        count: 1,
        tool: 'Concrete saw'
    },
    {
        name: '18" asphalt blade',
        count: 1,
        tool: 'Asphalt saw'
    },
    {
        name: '24" asphalt blade',
        count: 1,
        tool: 'Asphalt saw'
    },
    {
        name: '30" asphalt blade',
        count: 1,
        tool: 'Asphalt saw'
    },
    {
        name: '36" asphalt blade',
        count: 1,
        tool: 'Asphalt saw'
    },
    {
        name: '42" asphalt blade',
        count: 1,
        tool: 'Asphalt saw'
    },
    {
        name: '16" hand blade',
        count: 1,
        tool: 'Hand saw'
    },
    {
        name: '20" hand blade',
        count: 1,
        tool: 'Hand saw'
    },
    {
        name: '20" wall blade',
        count: 1,
        tool: 'Wall saw'
    },
    {
        name: '24" wall blade',
        count: 1,
        tool: 'Wall saw'
    },
    {
        name: '30" wall blade',
        count: 1,
        tool: 'Wall saw'
    },
    {
        name: '36" wall blade',
        count: 1,
        tool: 'Wall saw'
    },
    {
        name: '42" wall blade',
        count: 1,
        tool: 'Wall saw'
    },
]

const seedDB = async () => {
    await Part.deleteMany({})
    for (let i in list) {
        const part = new Part({
            name: list[i].name,
            onHand: list[i].count,
            tool: list[i].tool
        })
        await part.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})