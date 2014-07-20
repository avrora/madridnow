"use strict";
/* global InstagramPictures, Template, moment */

Template.timeline.helpers({
  asItHappened: function () {
    var allPictures =  InstagramPictures.find({}, {sort: {createdAt: -1}});

    allPictures = allPictures.map(function(elem, index) {

      // move pics to left and right
      if (index % 2) {
        elem.position = 'timeline-inverted';
      } else {
        elem.position = '';
      }

      // beautify time label
      elem.timeAgo = moment(elem.createdAt).fromNow();

      // add some icons and colors
      elem.icon = "glyphicon glyphicon-picture";
      elem.badge = 'timeline-badge danger';

      return elem;
    });

    return allPictures;
  }
});