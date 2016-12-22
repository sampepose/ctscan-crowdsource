const mongoose = require('mongoose');

const MONGO_URL = require('./config');
const Schema = {mongoose};

mongoose.connect(MONGO_URL);

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

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
