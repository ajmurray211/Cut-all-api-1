const User = require('../models/user')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json({ users })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }

}

// login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({ ...user._doc })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }

}

// signup a user
const signupUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.signup(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({ email, token })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// edit a users informaiton
const editUser = async (req, res) => {
    const { email } = req.params
    const data = req.body

    try {
        const updatedUser = await User.findOneAndUpdate({ email: email }, data, { new: true })
        res.status(200).json({ updatedUser, mssg:'You have updated a user' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

module.exports = { getUsers, signupUser, loginUser, editUser }