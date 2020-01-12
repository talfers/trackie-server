const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
  // Grab headers from req obj
  const { authorization } = req.headers;
  // Check for authorization header
  if(!authorization) {
    return res.status(401).send({error: 'You must be logged in!'})
  }

  // Grab token from auth header
  const token = authorization.replace('Bearer ', '');

  // Verify with jwt method
  jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
    // Check if not verified
    if(err) {
      res.status(401).send({error: 'You must be logged in!'})
    }
    // Grab userId from payload obj
    const {userId} = payload
    // Find user in DB with userId
    const user = await User.findById(userId);
    // Assign req.user obj to the user model instance
    req.user = user;
    // Call next for express middleware to work
    next();
  })
}
