var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser')
var {Users} = require('./models');

var app = express();
app.use(bodyParser.json({}));
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
  if (!req.body || !req.body.username || !req.body.password) {
    res.status(404).send('Invalid payload');
    return;
  }

  Users.findOne({username: req.body.username}, (err, user) => {
    if (err) {
      console.error(err);
      res.status(400).send({ error: 'Error signing in user' });
    } else {
      if (user) {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (err) {
            console.error(err);
            res.status(400).send({ error: 'Error signing in user' });
          } else if (!isMatch) {
            res.status(401).send({ error: 'Error authorizing user' });
          } else {
            req.session.user_id = user._id;

            res.status(201).send();
          }
        });
      } else {
        res.status(401).send({ error: 'Error authorizing user' });
      }
    }
  });
});

app.post('/api/signup', function(req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    res.status(404).send('Invalid payload');
    return;
  }

  // Create the User in the database
  new Users(req.body).save((err, user) => {
    if (err) {
      console.error(err);
      res.status(400).send({ error: 'Error creating user' });
    } else {
      // Add the proper session data
      req.session.user_id = user._id;

      res.status(201).send();
    }
  });
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
