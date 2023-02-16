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
		if(req.body.password !== req.body.passwordConfirmation){
			throw new Error("Passwords do not match")
		}

		await user.save()
		res.render('user/login', { message: "Registered Successfully"})
	} catch(error) {
		res.render('user/signup', {error: error.message})
	}
})

router.get('/users/login', (req, res) => {
  res.render('user/login')
})

router.get('/users/updatePassword', (req, res) => {
  res.render('user/updatePassword', {email: req.query.email, token: req.query.token})
})

router.get('/users/signup', (req, res) => {
  res.render('user/signup')
})

router.get('/users/forgotPassword', (req, res) => {
  res.render('user/forgotPassword')
})

router.post('/users/login', async(req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()
		req.session.token = token
		res.redirect(process.env.HOST)
	} catch(error) {
		res.render('user/login', {error: error.message})
	}
})

router.post('/users/logout', auth, async(req, res) => {
	try {
		const user = req.user
		user.tokens = user.tokens.filter((token) => {
			token !== req.token
		})

		await user.save()

		req.session.destroy();
    res.redirect(process.env.HOST);
	} catch(error) {
		res.redirect(process.env.HOST, {error: error.message})
	}
})

router.post('/users/resetPassword', async(req, res) => {
	try {
		const user = await User.findOne({email: req.body.email})

		if (!user) {
			throw new Error('No user found with this email')
		}
		const token = await user.generateResetPasswordToken()
		sendResetPasswordToken(user.email, user.name, token)
		res.render('user/login', {message: "Reset Password token emailed to " + user.email})
	} catch(error) {
		res.render('user/forgotPassword', {error: error.message})
	}
})

router.post('/users/updatePassword', async(req, res) => {
	try {
		const user = await User.findOne({email: req.body.email})

		if (!user) {
			throw new Error('No user found with this email')
		}

		if(req.body.password !== req.body.passwordConfirmation){
			throw new Error("Passwords do not match")
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
		res.render('user/login', {message: "Password updated successfully"})
	} catch(error) {
		res.render('user/updatePassword', {error: error.message, email: req.body.email, token: req.body.token})
	}
})

module.exports = router
