const express = require('express');
const Project = require('../models/project');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/projects', auth, async(req, res) => {
	const projects = req.projects
	res.render("project/list", {projects})
})

router.get('/projects/new', auth, async(req, res) => {
	res.render("project/create")
})

router.get('/projects/:id', auth, async(req, res) => {
	try {
		const project = await Project.findOne({users: req.user._id, _id: req.params.id})

    if(!project) {
			res.render("project/list", {error: 'Project not found', projects: req.projects})
    }
    res.render("project/details", {project})
  } catch (error) {
		res.render("project/list", {error: error.message, projects: req.projects})
  }
})

router.post('/projects', auth, async(req, res) => {
    const project = new Project(req.body)

	try {
		project.users = project.users.concat(req.user._id)

		await project.save()
		res.render('project/list', { message: "Project Created Successfully"})
	} catch(error) {
		res.render('project/create', {error: error.message})
	}
})

module.exports = router
