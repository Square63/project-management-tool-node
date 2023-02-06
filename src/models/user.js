const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task.js')

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email address')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "Password"')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  role: {
    type: String,
    required: true,
    enum: ['project manager', 'developer', 'sqa']
  }
}, {
  timestamps: true
}
)

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'assignee'
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email})  

  if(!user) {
    throw new Error('User not found')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch){
    throw new Error("Unable to login")
  }

  return user
}

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({token})
  await user.save()

  return token
}

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject()
  delete userObject.tokens
  delete userObject.password

  return userObject
}


userSchema.pre('save', async function(next){
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.pre('remove', async function(next){
  const user = this
  await Task.remove({owner: user._id})
  next()
})
const User = mongoose.model('User', userSchema)

module.exports = User
