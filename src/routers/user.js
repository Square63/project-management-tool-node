const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken')
const { sendResetPasswordToken } = require('../emails/account');

const router = new express.Router();

router.get('/users/me', auth, async(req, res) => {
	try {
		res.send(req.user)
	} catch (error) {
		res.status(500).send(error)
	}
})

router.post('/users', async(req, res) => {
	const user = new User(req.body)

	try {
		await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({user, token})
	} catch(error) {
		res.status(400).send({error: error.message})
	}
})

router.post('/users/login', async(req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		res.send({user, token})
	} catch(error) {
		res.status(400).send({error: error.message})
	}
})

router.post('/users/logout', auth, async(req, res) => {
	try {
		const user = req.user
		user.tokens = user.tokens.filter((token) => {
			token !== req.token
		})

		await user.save()

		res.send({message: "Logged out"})
	} catch(error) {
		res.status(500).send({error: error.message})
	}
})

router.post('/users/resetPassword', async(req, res) => {
	try {
		const user = await User.findOne({email: req.body.email})

		if (!user) {
			res.status(404).send({error: 'No user found with this email'})
		}
		const token = await user.generateResetPasswordToken()
		sendResetPasswordToken(user.email, user.name, token)
		res.send({message: "Reset Password token email", token})
	} catch(error) {
		res.status(400).send({error: error.message})
	}
})

router.post('/users/updatePassword', async(req, res) => {
	try {
		const user = await User.findOne({email: req.body.email})

		if (!user) {
			res.status(404).send({error: 'No user found with this email'})
		}

		const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET)

		if(!(user.resetPasswordToken || user.resetPasswordToken === req.body.token) ) {
			throw new Error("Invalid token")
		}

		if(decoded.expiry < Date.now()) {
			throw new Error("Token expired")
		}

		user.password = req.body.password
		user.resetPasswordToken = ''
		await user.save()
		res.send(user)
	} catch(error) {
		res.status(400).send({error: error.message})
	}
})

module.exports = router
