const express = require('express');
const Task = require('../models/task');
const Project = require('../models/project');
const router = new express.Router();
const auth = require('../middleware/auth');

router.get('/tasks/:id', auth, async(req, res) => {
  try {
    const task = await Task.findOne({_id: req.params.id})
    if(!task){
      throw new Error('Task not found')
    }

		const project = await Project.findOne({users: req.user._id, _id: task.project})
    if(!project) {
      throw new Error('Project not accessible')
    }

    console.log(project)
    res.render("task/details", {task, project})
  } catch (error) {
		res.render(`project/list`, {error: error.message, projects: req.projects})
  }
})

router.get('/projects/:project_id/tasks/new', auth, async(req, res) => {
  try {
		const project = await Project.findOne({users: req.user._id, _id: req.params.project_id})

    if(!project) {
			throw new Error('Project not found')
    }
    res.render("task/create", {project})
  } catch (error) {
		res.render("project/list", {error: error.message, projects: req.projects})
  }

})

router.post('/tasks', auth, async(req, res) => {
  const project = await Project.findOne({users: req.user._id, _id: req.body.project})

  if(!project) {
    res.render("project/list", {error: 'Project not found', projects: req.projects})
  }

  try {
    const task = new Task(req.body)
    await task.save()
    res.redirect("projects/" + project._id)
  } catch (error) {
		res.render("task/create", {error: error.message, project})
  }
})

module.exports = router
