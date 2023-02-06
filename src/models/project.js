const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date 
  },
  endDate: {
    type: Date
  }
})

projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project'
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project