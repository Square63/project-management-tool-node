const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Project = require('../models/project');

const auth = async (req, res, next) => {
  try {
    const token = req.session.token
    if(!token){
      res.redirect('/users/login')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
    const projects = await Project.find({users: user._id})

    if (!user) {
      res.redirect('/users/login')
    }

    req.user = user;
    req.projects = projects;
    next()
  } catch (error) {
    res.render('login', { error: error.message })
  }

}

module.exports = auth
