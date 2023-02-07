const app = require('./app')
const auth = require('./middleware/auth');
const port = process.env.PORT || 3000

app.get('/', auth, (req, res) => {
  res.render('index')
})

app.get('*', auth, (req, res) => {
  res.render('index')
})

app.listen(port, () =>{
  console.log('listening on http://localhost:' + port)
})
