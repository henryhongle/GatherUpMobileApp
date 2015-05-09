angular.module('starter.services', [])


.factory('$localStorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}])

.factory('geoLocation', function ($localStorage) {
    return {
        mb_token: 'https://a.tiles.mapbox.com/v4/gamabuntax.l627g36k/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoiZ2FtYWJ1bnRheCIsImEiOiJGYjNVZVhzIn0.AM44PGFx-uh0xKFrPASKGQ#4/' ,

        setGeolocation: function (latitude, longitude) {
            var _position = {
                latitude: latitude,
                longitude: longitude
            }
            $localStorage.setObject('geoLocation', _position)
        },
        getGeolocation: function () {
            return glocation = {
                lat: $localStorage.getObject('geoLocation').latitude,
                lng: $localStorage.getObject('geoLocation').longitude
            }
        }
    }
})

.factory('Auth', function($firebase) {
   var ref = new Firebase('https://gatherup.firebaseio.com/');

    return {
      isAuth: function() {
        return ref.getAuth();
      },
      ref: function() {
        return ref;
      },
      createProfile: function(user,email) {
        return ref.child('profile').child(user.uid).set( {email:email});
      }
    };
})

.factory('Event', function($firebase, $firebaseArray, $firebaseObject,$q) {
  var ref = new Firebase('https://gatherup.firebaseio.com/');
  var events = $firebaseArray(ref.child("events"));
  var geoFire = new GeoFire(ref.child("geo"));
  var nearEvents = {};

  return {
    getEvents: function() {
      return events;
    },

    getNearEvents: function(position) {
      //in km
      var radius = 30;
      center = [position.lat, position.lng];
      // Create a new GeoQuery instance
      var geoQuery = geoFire.query({
        center: center,
        radius: radius
      });
      var defer = $q.defer();

      var currentDate = new Date();
      //$scope.event.date = $scope.event.date.toJSON();

      geoQuery.on("key_entered", function(eventId, eventLocation) {
        ref.child("events").child(eventId).once("value", function(dataSnapshot) {
          var event = dataSnapshot.val();
          if (event !== null) {
            var eventDate = new Date(event.date);
            if (currentDate < eventDate) {
              nearEvents[eventId] = event;
              defer.resolve(nearEvents);
            }
            else {
              delete nearEvents[eventId];
              defer.resolve(nearEvents);
            }
          }
        });
      });

      geoQuery.on("key_exited", function(eventId, eventLocation) {
         delete nearEvents[eventId];
         //return nearEvents;
         defer.resolve(nearEvents);
      });

      return defer.promise;
    },

    get: function(eventID) {
      return $firebaseObject(ref.child("events").child(eventID));
    },


    getUserEvents: function(userID) {
      var defer = $q.defer();
      var list = $firebaseArray(ref.child("user_events").child(userID));
      list.$loaded().then( function (data) {
        var userEvents =[];
        data.forEach(function(e) {
          var key = e.$value;
          var event = events.$getRecord(key);
          userEvents.push(event);
        });

        list.$destroy();
        defer.resolve(userEvents);
      });
      return defer.promise;
    }
  };

});
