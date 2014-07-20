"use strict";
/* global Meteor, InstagramPictures, Router, moment */

Router.map(function() {
  this.route('timeline', {path: '/'});

  this.route('instagram', {
    path: '/instagram',
    where: 'server',
    action: function() {

      var isDebug = true;

      // check Instagram documentation to get the details for pubsub protocol:
      // http://instagram.com/developer/realtime/
      if (this.request.method === 'GET') {
        if (isDebug) {
          console.log('callback is invoked by Instagram', this.params);
          console.log(this.params['hub.challenge']);
        }
        return this.response.end(this.params['hub.challenge']);
      } else {

        if (isDebug) {
          console.log('got POST!');
        }
        var update = this.request.body;

        var firstPic = update[0];
        var timeOfPic = firstPic.time * 1000;

        var amountOfPics = update.length;

        if (isDebug) {
          console.log('Image taken', moment(timeOfPic).format('MMMM Do YYYY, h:mm:ss'));
        }

        // process image fetching on the server
        Meteor.call('addMadridPicture', amountOfPics, function (error, result) {
          if (error) {
            console.error('could not process server method: ', error);
          }

          if (isDebug) {
            console.log('called addMadridPicture', result);
          }
        } );

        return this.response.end();
      }
    }
  });
});

