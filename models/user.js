const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  employeeNumber: {
    type: String,
    default: ''
  },
  truckNumber: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  timeCards: [{
    type: Schema.Types.ObjectId,
    ref: 'TimeCard'
  }]
})

// static signup method
userSchema.statics.signup = async function (args) {
  console.log(args)
  const { email, password, firstName, lastName, isAdmin, employeeNumber, truckNumber, status, title } = args
  // validation
  if (!email || !password) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email is not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const exsists = await this.findOne({ email })
  if (exsists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ email, password: hash, firstName, lastName, isAdmin, employeeNumber, truckNumber, status, title })

  return user
}

// statis login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email }).populate('timeCards')
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

module.exports = mongoose.model('User', userSchema)