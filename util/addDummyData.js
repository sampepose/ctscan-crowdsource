'use strict';

const mongoose = require('mongoose');
const {Images, Labels, Users} = require('../server/models');

const DummyUsers = [
  {username: 'sam', password: 'pepose'},
];

const DummyImages = [
  {uri: 'a', modify_date: new Date('12-01-16')},
  {uri: 'a', modify_date: new Date('12-02-16')},
  {uri: 'b', modify_date: new Date('12-03-16')},
  {uri: 'c', modify_date: new Date('12-04-16')},
  {uri: 'd', modify_date: new Date('12-05-16')},
];

Users.remove({})
  .then(() => Labels.remove({}))
  .then(() => Images.remove({}))
  .then(() => Users.collection.insert(DummyUsers))
  .then(users => {
    return Images.collection.insert(DummyImages, {ordered: false})
      .then(images => {
        const userIds = users.insertedIds.filter(a => a);
        const imageIds = images.insertedIds.filter(a => a);
        const labels = [];

        // "Well" labeled image: 2 of the same label
        labels.push({
          image: imageIds[0],
          user: userIds[0],
          plane: 'SAGITTAL',
          features: ['ARM'],
        });
        labels.push({
          image: imageIds[0],
          user: userIds[0],
          plane: 'SAGITTAL',
          features: ['ARM'],
        });

        // "Poor" labeled image: 2 labels, different results
        labels.push({
          image: imageIds[1],
          user: userIds[0],
          plane: 'SAGITTAL',
          features: ['ARM', 'LEG'],
        });
        labels.push({
          image: imageIds[1],
          user: userIds[0],
          plane: 'SAGITTAL',
          features: ['LEG'],
        });

        // Partially labeled image: only 1 label
        labels.push({
          image: imageIds[2],
          user: userIds[0],
          plane: 'CORONAL',
          features: ['SPLEEN'],
        });

        return Labels.collection.insert(labels);
      });
  })
  .then(labels => {
    console.log('Done');
    process.exit();
  })
  .catch(e => console.error(e));
