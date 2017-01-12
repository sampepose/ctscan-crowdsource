var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser')
var _ = require('underscore')
var {Users, Images, Labels} = require('./models');
const mongoose = require('mongoose');
const path = require('path');

const {ObjectId} = mongoose.Types;

var app = express();
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
}));

// new static middleware
var staticImageHandler = express.static(__dirname + '/../images')

// catch all sub-directory requests
app.get('/images/*', function(req, res){
    // remove subdir from url (static serves from root)
    req.url = req.url.replace(/^\/images/, '');

    if (req.session.viewableImages.indexOf(req.url.slice(1)) !== -1) {
      // call the actual middleware, catch pass-through (not found)
      staticImageHandler(req, res, function() {
          res.sendStatus(404);
      });
    } else {
      res.sendStatus(403);
    }
});

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

const fetchNextImageForUser = function(req, res) {
  Images.aggregate([
    // Left-outer join on Images and Labels
    {
      $lookup: {
        from: 'labels',
        localField: '_id',
        foreignField: 'image',
        as: 'labels',
      },
    },
    // Project to transform labels into array of feature arrays, count of labels, and array of user labelers
    {
      $project: {
        uri: 1,
        features: {
          $map: {
            input: '$labels',
            as: 'label',
            in: '$$label.features',
          },
        },
        labelCount: {
          $size: '$labels',
        },
        labelers: {
          $map: {
            input: '$labels',
            as: 'label',
            in: '$$label.user',
          },
        },
      },
    },
    // Match to remove documents with >= 3 label count and documents already labeled by user
    {
      $match: {
        labelCount: {
          $lte: 2,
        },
        labelers: {
          $not: {
            $in: [new ObjectId(req.session.user_id)]
          }
        },
      },
    },
    // Remove documents with 2 labelers and matching label features
    {
      $redact: {
        $cond: {
          if: {
            $and: [
              {
                $eq: ['$labelCount', 2],
              },
              {
                $eq: [
                  {
                    $arrayElemAt: ['$features', 0]
                  },
                  {
                    $arrayElemAt: ['$features', 1]
                  },
                ],
              },
            ],
          },
          then: '$$PRUNE',
          else: '$$KEEP',
        }
      }
    },
    {
      $limit: 1,
    },
  ], (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error retrieving image.');
    }

    if (docs.length > 0) {
      const {uri, _id} = docs[0];
      if (!req.session.viewableImages) {
        req.session.viewableImages = [];
      }
      req.session.viewableImages.push(uri);
      res.status(200).send({uri, _id});
    } else {
      res.sendStatus(404);
    }
  });
}

// Returns the next image to be labeled by the currently logged in session
app.get('/api/image/next', function(req, res) {
  if (!req.session.user_id) {
    return res.status(401).send('Not logged in');
  }

  return fetchNextImageForUser(req, res);
});

app.post('/api/label/', function(req, res) {
  if (!req.session.user_id) {
    res.status(401).send('Not logged in');
  }

  if (!req.body || !req.body.image_id || !req.body.features || !req.body.plane) {
    res.status(404).send('Invalid payload');
    return;
  }

  const labelData = {
    user: req.session.user_id,
    image: req.body.image_id,
    features: req.body.features,
    plane: req.body.plane,
  };

  new Labels(labelData).save((err, label) => {
    if (err) {
      console.error(err);
      res.status(400).send('Error saving label');
    } else {
      req.session.viewableImages.splice(req.body.image_id, 1);
      return fetchNextImageForUser(req, res);
    }
  });
});

// We only need to serve static resources in production. Webpack handles it in dev.
if (process.argv[2] === 'prod') {
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../build/index.html'));
  });
}

app.listen(8001, function () {
  console.log('Example app listening on port 8001!');
});
