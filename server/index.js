var express = require('express');
var session = require('express-session');

var app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// We only need to serve static resources in production. Webpack handles it in dev.
if (process.argv[2] === 'prod') {
  app.use(express.static('build'));
}

app.post('/api/login', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(404).send('Invalid payload');
  }
  // TODO: Login
});

app.get('/api/image/', function(req, res) {
  if (!req.session.username) {
    res.status(404).send('Not logged in');
  }
});

app.post('/api/label/', function(req, res) {
  if (!req.session.username) {
    res.status(404).send('Not logged in');
  }
});

app.listen(8001, function () {
  console.log('Example app listening on port 8001!');
});
