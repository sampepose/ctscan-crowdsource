'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const {Images} = require('../server/models');

const folderName = __dirname + '/../public/images';
if (!folderName || !fs.existsSync(folderName)) {
  console.error('<ROOT>/public/images does not exist. Please add this dir and try again.');
  process.exit();
}

const imagesExts = ['.png', '.jpeg', '.jpg', '.gif'];

const images = fs.readdirSync(folderName).map(filename => {
  if (!fs.lstatSync(`${folderName}/${filename}`).isFile()) {
    console.log(`${filename} ignored, not a file`);
    return;
  }

  const ext = path.extname(filename);
  if (imagesExts.indexOf(ext) === -1) {
    console.log(`${filename} ignored, not an image`);
    return;
  }

  const modify_date = new Date(util.inspect(fs.statSync(`${folderName}/${filename}`).mtime));
  return {uri: filename, modify_date: modify_date};
}).filter(f => f);

Images.collection.insert(images, {ordered: false}, (err, result) => {
  console.log(`Loaded ${result.insertedCount} images to DB.`);
  process.exit();
});
