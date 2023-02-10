const express = require('express');
const Task = require('../models/task');
const Project = require('../models/project');
const router = new express.Router();
const auth = require('../middleware/auth');
const authorizeProject = require('../middleware/authorizeProject');

router.get('/projects/:project_id/tasks/new', [auth, authorizeProject], async(req, res) => {
  try {
    res.render("task/create", {project: req.project})
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

router.post('/projects/:project_id/tasks', [auth, authorizeProject], async(req, res) => {
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
    res.render("task/details", {task, project: req.project})
  } catch (error) {
		res.render("task/create", {error: error.message, project: req.project})
  }
})

module.exports = router
