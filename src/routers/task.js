const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth');

router.get('/tasks', async(req, res) => {
  res.send("ok")
})

module.exports = router
