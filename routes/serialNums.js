const express = require('express')
const router = express.Router()
const {
    getAllSerialNums,
    createSerialNum,
    getJustSerialNumbers,
    editSerialNumberJobData,
    getSingleNum,
    updateSerialNum,
    deleteSerialNum
} = require('../controllers/serialNums.js')

//Show all SerialNums
router.get('/', getAllSerialNums)

// get only serial numbers
router.get('/numsList', getJustSerialNumbers)

router.get('/:name', getSingleNum)

router.put('/editJobInfo', editSerialNumberJobData)

router.post('/', createSerialNum)

//Update one serialNum by ID
router.put('/update/:operation', updateSerialNum)

//Delete a serialNum by ID
router.delete('/:id', deleteSerialNum)

module.exports = router
