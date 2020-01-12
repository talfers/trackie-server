const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = new User({email, password});
    await user.save();
    // Generate token
    const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY');
    // Send in response
    res.send({token});

  } catch (err) {
    // return to short circuit the code
    return res.status(422).send(err.message);
  }

  res.send('You made a post request');
})

router.post('/signin', async (req, res) => {
  const {email, password} = req.body;

  if(!email || !password) {
    return res.status(422).send({error: 'Must provide email and password'})
  }
  // Find user in DB by email
  const user = await User.findOne({email});
  // If no user, return status and err
  if(!user) {
    res.status(422).send({error: 'Invalid password or email'})
  }

  // Compare the password with method
  // May fail/reject, so must wrap in try/catch
  try {
    // await because Promise
    await user.comparePassword(password);
    // Generate token again
    const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY');
    // Send in response
    res.send({token});
  } catch(err) {
    if(err) {
      res.status(422).send('Invalid password or email')
    }
  }

})

module.exports = router;
