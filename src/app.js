const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const projectRouter = require('./routers/project')
const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(projectRouter)

module.exports = app
