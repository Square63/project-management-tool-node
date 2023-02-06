const express = require('express');
const Project = require('../models/project');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/projects', async(req, res) => {
    res.send("projects")
})


module.exports = router
