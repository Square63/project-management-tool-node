const app = require('./app')
const auth = require('./middleware/auth');
const Task = require('./models/task');
const port = process.env.PORT || 3000

app.get('/', auth, async(req, res) => {
  const tasks = await Task.find({assignee: req.user._id}).populate(['assignee', 'project'])
  res.render('index', {user: req.user, tasks})
})

app.get('*', auth, async(req, res) => {
  res.redirect(process.env.HOST)
})

app.listen(port, () =>{
  console.log('listening on http://localhost:' + port)
})
