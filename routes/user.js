const express = require('express')

// controller functions
const { loginUser, signupUser, getUsers } = require('../controllers/user.js')

const router = express.Router()

// get the users
router.get('/', getUsers)

// login route
router.post('/login', loginUser)

// signup route
router.post('/register', signupUser)

module.exports = router