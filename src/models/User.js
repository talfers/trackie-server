const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(next) {
  // function preserves this, so assign to user var
  const user = this;
  // Check if password has been modified (from mongoose)
  if(!user.isModified) {
    // return out if not modified
    return next();
  }
  // Generate salt, from bcrypt
  bcrypt.genSalt(10, (err, salt) => {
    // Check and short if err
    if(err) {
      return next(err);
    }
    // If salt created, create hash
    bcrypt.hash(user.password, salt, (err, hash) => {
      // Check and short is err
      if(err) {
        return next(err);
      }
      // Save password as hash
      user.password = hash;
      // Complete middleware
      next();
    })
  })
})

userSchema.methods.comparePassword = function(candidatePassword) {
  // function preserves this, so assign to user var
  const user = this;
  // Create Promise to await for comparison
  return new Promise((resolve, reject) => {
      // Compare the passed in password to the DB password
      bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
        // If err reject with err
        if(err) {
          return reject(err);
        }
        // If no match reject with false
        if(!isMatch) {
          return reject(false);
        }
        // If passed, resolve with true
        resolve(true);
      })
  })
}


mongoose.model('User', userSchema);
