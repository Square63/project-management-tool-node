const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/users/me', async(req, res) => {
    res.send("Me")
})


module.exports = router
