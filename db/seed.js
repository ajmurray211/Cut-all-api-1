const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Part = require('../models/part')
const Serial = require('../models/serialNum')
const TimeCard = require('../models/timeCard')

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
    {
        name: '12" Bit',
        count: 6,
        emailed: false,
        tool: 'Core drill'
    },
    {
        name: 'Slab saw belts',
        count: 6,
        emailed: false,
        tool: 'Consumables'
    },
]

const serialList = [
    {
        manufacture: "Dixi diamond",
        serialNum: "DD1",
        assignedTo: '',
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
        assignedTo: '',
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
        assignedTo: '',
        specNum: "4FD34127",
        name: "18\" concrete blade",
        history: [
            {
                date: "02/21/2023",
                depth: "30",
                runLength: "17"
            },
            {
                date: "02/20/2023",
                depth: "5",
                runLength: "40"
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
        assignedTo: '',
        specNum: "43123468479B2",
        name: "18\" wall blade",
        history: [
            {
                date: "02/20/2023",
                depth: "5",
                runLength: "40"
            }
        ]
    },
    {
        manufacture: "Hilti",
        serialNum: "T1",
        assignedTo: '',
        specNum: "43123468479Bjgckh2",
        name: "42\" wall blade",

    },
]

const timeCardList = [
    {
        user: '641e0f753b1c88e8217277b3',
        date: '5/9/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '641e0f753b1c88e8217277b3',
        date: '5/10/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '641e0f753b1c88e8217277b3',
        date: '5/11/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '641e0f753b1c88e8217277b3',
        date: '5/12/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '641e0f753b1c88e8217277b3',
        date: '5/13/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '644f06ab818849931dcf3ba3',
        date: '5/9/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '644f06ab818849931dcf3ba3',
        date: '5/10/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '644f06ab818849931dcf3ba3',
        date: '5/11/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '644f06ab818849931dcf3ba3',
        date: '5/12/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '644f06ab818849931dcf3ba3',
        date: '5/13/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '644f0739818849931dcf3bb8',
        date: '5/9/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '644f0739818849931dcf3bb8',
        date: '5/10/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '644f0739818849931dcf3bb8',
        date: '5/11/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '644f0739818849931dcf3bb8',
        date: '5/12/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
    {
        user: '644f0739818849931dcf3bb8',
        date: '5/13/2023',
        startTime: '17:30',
        endTime: '18:30',
        workCode: 'ccd',
        jobName: 'test inc',
        hours: '65',
        notes: 'None',
    },
]

const seedDB = async () => {
    await Part.deleteMany({})
    for (let i in partList) {
        const part = new Part({
            name: partList[i].name,
            onHand: partList[i].count,
            emailed: partList[i].emailed,
            tool: partList[i].tool
        })
        await part.save()
    }

    await Serial.deleteMany({})
    for (let i in serialList) {
        const num = new Serial({
            manufacture: serialList[i].manufacture,
            serialNum: serialList[i].serialNum,
            assignedTo: '',
            assignedTo: '', specNum: serialList[i].
                specNum,
            name: serialList[i].name,
            history: serialList[i].history
        })
        await num.save()
    }

    await TimeCard.deleteMany({})
    // for (let i in timeCardList) {
    //     const card = new TimeCard({
    //         user: timeCardList[i].user,
    //         date: timeCardList[i].date,
    //         startTime: timeCardList[i].startTime,
    //         endTime: timeCardList[i].endTime,
    //         workCode: timeCardList[i].workCode,
    //         jobName: timeCardList[i].jobName,
    //         hours: timeCardList[i].hours,
    //         notes: timeCardList[i].notes,
    //     })
    //     console.log(card)
    //     await card.save()
    // }
}

seedDB().then(() => {
    mongoose.connection.close()
})