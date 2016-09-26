var express = require('express');
var session = require('express-session')
var app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.post('/api/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(404).send('Invalid payload');
  }
  // TODO: Login
});

app.get('/api/image/', (req, res) => {
  if (!req.session.username) {
    res.status(404).send('Not logged in');
  }
});

app.post('/api/label/', (req, res) => {
  if (!req.session.username) {
    res.status(404).send('Not logged in');
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
