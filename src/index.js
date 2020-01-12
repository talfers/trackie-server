require('./models/User');
require('./models/Track');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');
const { mongoUri } = require('./config/config');

// bodyParser MUST be before route to parse
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

// Mongoose Setup

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
})
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to mongo', err);
})


app.get('/', requireAuth, (req, res) => {
  res.send("Hi there");
})


app.listen(3000, () => {
  console.log("Server listening on port 3000");
})
