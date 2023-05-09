const express = require('express')

// controller functions
const { loginUser, signupUser, getUsers, editUser } = require('../controllers/user.js')

const router = express.Router()

// get the users
router.get('/', getUsers)

// login route
router.post('/login', loginUser)

// signup route
router.post('/register', signupUser)

// edit user information
router.put('/edit/:email', editUser)

module.exports = router