"use strict";
/* global Meteor, InstagramPictures */


// publish only subset of the images: last 33 from the newest one
Meteor.publish('instagramImages', function () {
  return InstagramPictures.find({}, {sort: {createdAt: -1}, limit: 33});
});