const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Track = mongoose.model('Track');

const router = express.Router();

// MAKES ALLLL ROUTES REQUIRE AUTH
router.use(requireAuth);

router.get('/tracks', async (req, res) => {
  const tracks = await Track.find({userId: req.user._id});
  res.send(tracks);
})

router.post('/tracks', async (req, res) => {
  // Grab name and location form data
  const {name, locations} = req.body;
  // If none, throw err
  if(!name || !locations) {
    return res.status(422).send({err: 'You must provide a name and location'})
  }

  try {
    const track = new Track({name, locations, userId: req.user._id});
    await track.save();
    res.send(track);
  } catch(err) {
    res.status(422).send({error: err.message})
  }
})

module.exports = router;
