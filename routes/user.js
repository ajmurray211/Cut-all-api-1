const express = require('express')

// controller functions
const { loginUser, signupUser, getUsers, editUser, deleteUser, getSingleUser } = require('../controllers/user.js')

const router = express.Router()

// get the users
router.get('/', getUsers)

// login route
router.post('/login', loginUser)

// signup route
router.post('/register', signupUser)

// get the users
router.get('/:id', getSingleUser)

// edit user information
router.put('/edit/:id', editUser)

router.delete('/:id', deleteUser)

module.exports = router