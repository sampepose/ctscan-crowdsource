'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const {MONGO_URL} = require('./config');
const {Schema} = mongoose;
const {ObjectId} = mongoose.Schema.Types;
const NUM_SALT_ROUNDS = 10; // really means 2^10 rounds

// Attempt to connect to MongoDB server
mongoose.connect(MONGO_URL, err => {
  if (err) {
    console.error("ERROR: Could not connect to the mongo db. Is `mongod` running?");
    process.exit();
  }
});

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    set: function(password) {
      return bcrypt.hashSync(password, NUM_SALT_ROUNDS);
    },
  },
});

// http://stackoverflow.com/questions/14588032/mongoose-password-hashing
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

const ImageSchema = new Schema({
  uri: {
    type: String,
    required: true,
    unique: true,
  },
});

const LabelSchema = new Schema({
  image: {
    type: ObjectId,
    ref: 'Images',
    required: true,
  },
  bounding_box: {
    // Stored as stringified JSON {x, y, width, height} where (x,y) is top-left coords.
    type: String,
    required: true,
    validate: {
      validator: bb => {
        const box = JSON.parse(bb);
        return box.x != null && box.y  != null && box.width  != null && box.height != null;
      },
    },
  },
  user: {
    type: ObjectId,
    ref: 'Users',
    required: true,
  },
});

module.exports = {
  Users: mongoose.model('Users', UserSchema),
  Images: mongoose.model('Images', ImageSchema),
  Labels: mongoose.model('Labels', LabelSchema),
};
