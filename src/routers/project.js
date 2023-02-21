const express = require('express');
const Project = require('../models/project');
const Task = require('../models/task');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/projects', auth, async(req, res) => {
	const projects = req.projects
	res.send({projects})
})

router.get('/projects/new', auth, async(req, res) => {
	const managers = await User.find({role: 'project-manager'})
	res.render("project/create", {managers})
})

router.get('/projects/:id', auth, async(req, res) => {
	try {
		const project = await Project.findOne({users: req.user._id, _id: req.params.id}).populate('manager')

    if(!project) {
			throw new Error('Project not found')
    }
		const tasks = await Task
			.find({project})
			.populate({
      	path: 'assignee'
    	})
		const todo = tasks.filter((task) => task.status === 'to-do');
		const inprogress = tasks.filter((task) => task.status === 'in-progress');
		const completed = tasks.filter((task) => task.status === 'completed');
		const managers = await User.find({role: 'project-manager'})
    res.render("project/details", {project, todo, inprogress, completed, managers})
  } catch (error) {
		res.render("project/list", {error: error.message, projects: req.projects})
  }
})

router.post('/projects', auth, async(req, res) => {
  const project = new Project(req.body)

	try {
		project.users = project.users.concat(req.user._id)

		await project.save()

		req.user.projects = req.user.projects.concat(project._id)
		await req.user.save()
		await project.populate('manager')

		res.render("project/details", {project, message: "Project Created Successfully"})
	} catch(error) {
		res.render('project/create', {error: error.message})
	}
})

router.patch('/projects/:id/manager', [auth], async(req, res) => {
  try {
    const project = await Project.findOne({users: req.user._id, _id: req.params.id})

    if(!project) {
			throw new Error('Project not found')
    }
    if(req.query.manager){
      const manager = await User.findById(req.query.manager)
      if(!manager){
        throw new Error("Manager not found")
      }
      project.manager = manager._id
			res.send({message: 'Manager updated'})
    } else {
      project.manager = undefined
    }
    await project.save()
  } catch (error) {
		res.status(400).send({error: error.message})
  }
})

router.patch('/projects/:id/status', [auth], async(req, res) => {
  try {
    const project = await Project.findOne({users: req.user._id, _id: req.params.id})

    if(!project) {
			throw new Error('Project not found')
    }

    project.status = req.query.status
    await project.save()
    res.send({message: 'Status updated'})
  } catch (error) {
		res.status(400).send({error: error.message})
  }
})

module.exports = router
