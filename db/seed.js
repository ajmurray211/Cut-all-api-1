const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Part = require('../models/part')

mongoose.connect(process.env.LOCALHOST)

const db = mongoose.connection
mongoose.set('strictQuery', true)
db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', () => {
    console.log('Database seeded with stock information')
})

const list = [
    {
        name:'18" concrete blade',
        count: 3,
        tool: 'Concrete saw'
    },
    {
        name:'24" concrete blade',
        count: 10,
        tool: 'Concrete saw'
    },
    {
        name:'30" concrete blade',
        count: 7,
        tool: 'Concrete saw'
    },
    {
        name:'36" concrete blade',
        count: 2,
        tool: 'Concrete saw'
    },
    {
        name:'42" concrete blade',
        count: 1,
        tool: 'Concrete saw'
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