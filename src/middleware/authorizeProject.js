const Project = require('../models/project');

const authorizeProject = async (req, res, next) => {
  try {
    const project_id = req.body.project || req.params.project_id
    const project = await Project.findOne({users: req.user._id, _id: project_id})
    
    if(!project) {
      throw new Error('Project not accessible')
    }
    req.project = project

    next()
  } catch (error) {
    res.render('project/list', { error: error.message, projects: req.projects })
  }

}

module.exports = authorizeProject
