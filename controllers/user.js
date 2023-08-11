const User = require('../models/user')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).populate('timeCards')
        res.status(200).json({ data: users })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// get a user by ID 
const getSingleUser = async (req, res) => {
    try {
        const users = await User.findById(req.params.id).populate('timeCards')
        res.status(200).json({ data: users })
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
    console.log(req.body)
    const { email, password } = req.body
    try {
        const user = await User.signup(req.body)

        // create a token
        const token = createToken(user._id)

        console.log(user)

        res.status(200).json({ ...user._doc, token })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// edit a users informaiton
const editUser = async (req, res) => {
    const { id } = req.params
    const data = req.body

    try {
        const updatedUser = await User.findOneAndUpdate({ _id: id }, data, { new: true })
        res.status(200).json({ updatedUser, mssg: 'You have updated a user' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params
    await User.findByIdAndDelete(id)
        .then(response => {
            res.status(200).json({ message: 'You have deleted the user' })
        })
}

module.exports = { getUsers, signupUser, loginUser, editUser, deleteUser, getSingleUser }