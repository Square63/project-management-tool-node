const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  status: {
    type: String,
    required: true,
    default: 'to-do',
    enum: ['to-do', 'in-progress', 'completed']
  },
  dueDate: {
    type: Date,
  },
  attachments: {
    type: Buffer
  }
}, {
  timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
