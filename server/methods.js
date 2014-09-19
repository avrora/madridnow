"use strict";
/* global Meteor, InstagramPictures, HTTP */

Meteor.methods(
  {
    addMadridPicture: function (amountOfPics) {

      // yes, it is how we debug in 2014...
      var debugMethod = false;

      if (debugMethod) {
        console.log('fetch last %s pics about Madrid', amountOfPics);
      }

      try {
        // this is object id assigned by Instagram
        var madridGeoId = 9512356;

        var result = HTTP.call("GET", "https://api.instagram.com/v1/geographies/" + madridGeoId + "/media/recent?client_id=064292c073624d75a780ed063212bb7d&count="+amountOfPics);

        if (result && result.data && result.data.data) {
          var data = result.data.data[0];

          if (debugMethod) {
            console.log('got result', data);
            console.log('url: ', data.images.standard_resolution.url);
            console.log('user: ', data.user.username);
            console.log('createdAt: ', data.created_time);
            console.log('link: ', data.link);
          }

          var caption = '';
          if (data.caption){
            if (debugMethod) {
              console.log('caption: ', data.caption.text);
            }

            // if caption is too long, trim it
            caption = data.caption.text.substring(0, 32);

            // add ... if needed
            if (data.caption.text.length > 32) {
              caption += '...';
            }
          }

          var isDduplicate = InstagramPictures.find({picture: data.images.low_resolution.url}).fetch();

          if (isDduplicate.length === 0) {

            // all the data is here, save it
            InstagramPictures.insert({
              title: caption,
              createdAt: data.created_time * 1000,
              type: 'instagram',
              username: data.user.username,
              link: data.link,
              picture: data.images.low_resolution.url
            });
          } else {
            if (debugMethod) {
              console.log("skip duplicate: ", caption);
            }
          }

        }
        return true;
      } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
        console.error(e);
        return false;
      }
    }
  });