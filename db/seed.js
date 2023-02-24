const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Part = require('../models/part')
const Serial = require('../models/serialNum')

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

const partList = [
    {
        name: '18" concrete blade',
        count: 3,
        emailed: false,
        tool: 'Concrete saw'
    },
    {
        name: '24" concrete blade',
        count: 10,
        emailed: false,
        tool: 'Concrete saw'
    },
    {
        name: '30" concrete blade',
        count: 7,
        emailed: false,
        tool: 'Concrete saw'
    },
    {
        name: '36" concrete blade',
        count: 2,
        emailed: false,
        tool: 'Concrete saw'
    },
    {
        name: '42" concrete blade',
        count: 6,
        emailed: false,
        tool: 'Concrete saw'
    },
    {
        name: '18" asphalt blade',
        count: 6,
        emailed: false,
        tool: 'Asphalt saw'
    },
    {
        name: '24" asphalt blade',
        count: 6,
        emailed: false,
        tool: 'Asphalt saw'
    },
    {
        name: '30" asphalt blade',
        count: 6,
        emailed: false,
        tool: 'Asphalt saw'
    },
    {
        name: '36" asphalt blade',
        count: 6,
        emailed: false,
        tool: 'Asphalt saw'
    },
    {
        name: '42" asphalt blade',
        count: 6,
        emailed: false,
        tool: 'Asphalt saw'
    },
    {
        name: '16" hand blade',
        count: 6,
        emailed: false,
        tool: 'Hand saw'
    },
    {
        name: '20" hand blade',
        count: 6,
        emailed: false,
        tool: 'Hand saw'
    },
    {
        name: '20" wall blade',
        count: 6,
        emailed: false,
        tool: 'Wall saw'
    },
    {
        name: '24" wall blade',
        count: 6,
        emailed: false,
        tool: 'Wall saw'
    },
    {
        name: '30" wall blade',
        count: 6,
        emailed: false,
        tool: 'Wall saw'
    },
    {
        name: '36" wall blade',
        count: 6,
        emailed: false,
        tool: 'Wall saw'
    },
    {
        name: '42" wall blade',
        count: 6,
        emailed: false,
        tool: 'Wall saw'
    },
]

const serialList = [
    {
        manufacture: "Dixi diamond",
        serialNum: "DD1",
        specNum: "23564890",
        name: "18\" concrete blade",
        history: [
            {
                date: "02/20/2023",
                depth: "5",
                runLength: "40"
            },
            {
                date: "02/21/2023",
                depth: "30",
                runLength: "17"
            },
            {
                date: "02/22/2023",
                depth: "3",
                runLength: "12"
            },
        ]
    },
    {
        manufacture: "Con cut",
        serialNum: "CC1",
        specNum: "12874056A",
        name: "18\" asphalt blade",
        history: [
            {
                date: "02/20/2023",
                depth: "5",
                runLength: "40"
            },
            {
                date: "02/21/2023",
                depth: "30",
                runLength: "17"
            },
            {
                date: "02/22/2023",
                depth: "3",
                runLength: "12"
            },
        ]
    },
    {
        manufacture: "Dixi diamond",
        serialNum: "DD2",
        specNum: "4FD34127",
        name: "18\" concrete blade",
        history: [
            {
                date: "02/20/2023",
                depth: "5",
                runLength: "40"
            },
            {
                date: "02/21/2023",
                depth: "30",
                runLength: "17"
            },
            {
                date: "02/22/2023",
                depth: "3",
                runLength: "12"
            },
        ]
    },
    {
        manufacture: "Hilti",
        serialNum: "H1",
        specNum: "43123468479B2",
        name: "18\" wall blade",
        history: [
            {
                date: "02/20/2023",
                depth: "5",
                runLength: "40"
            },
            {
                date: "02/21/2023",
                depth: "30",
                runLength: "17"
            },
            {
                date: "02/22/2023",
                depth: "3",
                runLength: "12"
            },
        ]
    },
]

const seedDB = async () => {
    await Part.deleteMany({})
    for (let i in partList) {
        const part = new Part({
            name: partList[i].name,
            onHand: partList[i].count,
            tool: partList[i].tool
        })
        await part.save()
    }

    await Serial.deleteMany({})
    for (let i in serialList) {
        const num = new Serial({
            manufacture: serialList[i].manufacture,
            serialNum: serialList[i].serialNum,
            specNum: serialList[i].specNum,
            name: serialList[i].name,
            history:serialList[i].history
        })
        await num.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})