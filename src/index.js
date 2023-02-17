const app = require('./app')
const auth = require('./middleware/auth');
const User = require('./models/user');
const Project = require('./models/project');
const port = process.env.PORT || 3000

app.get('/', auth, async(req, res) => {
  const projects = await Project.find({users: req.user._id}).populate('manager')
  const members = await User.find().populate({
    path: 'projects',
    match: { status: 'ongoing' }
  })
  const metadata = {
    ongoingProjects: projects.filter(project => project.status === 'ongoing').length,
    completedProjects: projects.filter(project => project.status === 'completed').length,
    dueProjects: projects.filter(project => project.status === 'pending').length
  }
  res.render('index', {projects, members, metadata})
})

app.get('*', auth, async(req, res) => {
  res.redirect(process.env.HOST)
})

app.listen(port, () =>{
  console.log('listening on http://localhost:' + port)
})
