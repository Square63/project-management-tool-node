const express = require('express');
const Task = require('../models/task');
const Project = require('../models/project');
const router = new express.Router();
const auth = require('../middleware/auth');
const authorizeProject = require('../middleware/authorizeProject');

router.get('/tasks/new', [auth], async(req, res) => {
  try {
    res.render("task/create", {projects: req.projects})
  } catch (error) {
		res.render("project/list", {error: error.message, projects: req.projects})
  }

})

router.get('/projects/:project_id/tasks/:id', [auth, authorizeProject], async(req, res) => {
  try {
    const task = await Task.findOne({project: req.params.project_id, _id: req.params.id})
    if(!task){
      throw new Error('Task not found')
    }

    await req.project.populate('users')
    await task.populate('assignee')

    const users = req.project.users
    res.render("task/details", {task, project: req.project, users})
  } catch (error) {
		res.render(`project/list`, {error: error.message, projects: req.projects})
  }
})

router.post('/tasks', [auth, authorizeProject], async(req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()
    res.redirect(`${process.env.HOST}/projects/${req.project._id}`)
  } catch (error) {
		res.render("task/create", {error: error.message, project: req.project})
  }
})

router.post('/projects/:project_id/tasks/:id/attachments', [auth, authorizeProject], async(req, res) => {
  try {
    const task = await Task.findOne({project: req.params.project_id, _id: req.params.id})
    if(!task){
      throw new Error('Task not found')
    }
    task.attachments = task.attachments.concat(req.body.attachments)
    await task.save()
    res.redirect(`${process.env.HOST}/projects/${task.project}/tasks/${task._id}`)
  } catch (error) {
		res.render("project/details", {error: error.message, project: req.project})
  }
})

router.patch('/projects/:project_id/tasks/:id/status', [auth, authorizeProject], async(req, res) => {
  try {
    const task = await Task.findOne({project: req.params.project_id, _id: req.params.id})
    if(!task){
      throw new Error('Task not found')
    }
    task.status = req.query.status
    await task.save()
    res.send({message: 'status updated'})
  } catch (error) {
		res.status(400).send({error: error.message})
  }
})

router.patch('/projects/:project_id/tasks/:id/assignee', [auth, authorizeProject], async(req, res) => {
  try {
    const task = await Task.findOne({project: req.params.project_id, _id: req.params.id})
    if(!task){
      throw new Error('Task not found')
    }
    if(req.query.assignee){
      const assignee = req.project.users.find((user) => user.toString() === req.query.assignee)
      if(!assignee){
        throw new Error("Couldn't assign to this user")
      }
      task.assignee = assignee
    } else {
      task.assignee = undefined
    }
    await task.save()
    res.send({message: 'Assignee updated'})
  } catch (error) {
		res.status(400).send({error: error.message})
  }
})

module.exports = router
