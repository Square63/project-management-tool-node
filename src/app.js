const express = require('express')
const path = require('path')
const hbs = require('hbs')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const projectRouter = require('./routers/project')
const app = express()
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist/')));
app.use(express.static(path.join(__dirname, '../public')));
hbs.registerPartials(path.join(__dirname, '../templates/partials'))
app.use(sessions({
  secret: process.env.JWT_SECRET,
  saveUninitialized:true,
  cookie: { maxAge: 86400000 },
  resave: false
}));
app.use(cookieParser());
app.use(userRouter)
app.use(taskRouter)
app.use(projectRouter)

module.exports = app
