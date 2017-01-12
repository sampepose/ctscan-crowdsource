'use strict';

const bcrypt = require('bcrypt-nodejs');

const mongoose = require('mongoose');

const {LABELS, MONGO_URL} = require('./config');
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
      return bcrypt.hashSync(password, bcrypt.genSaltSync(NUM_SALT_ROUNDS));
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
  },
  modify_date: {
    type: String,
    required: true,
  },
});
ImageSchema.index({uri: 1, modify_date: 1}, {unique: true});

const LabelSchema = new Schema({
  image: {
    type: ObjectId,
    ref: 'Images',
    required: true,
  },
  features: {
    type: [{
      type: String,
      enum: LABELS,
    }],
  },
  plane: {
    type: String,
    required: true,
    enum: ['SAGITTAL', 'AXIAL', 'CORONAL', 'GARBAGE'],
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
