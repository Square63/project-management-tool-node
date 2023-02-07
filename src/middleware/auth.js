const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.session.token
    if(!token){
      res.redirect('/users/login')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token});

    if (!user) {
      res.redirect('/users/login')
    }

    req.user = user;
    next()
  } catch (error) {
    res.render('login', { error: error.message })
  }

}

module.exports = auth
