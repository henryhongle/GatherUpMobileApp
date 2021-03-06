// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'starter.services','firebase', 'ngMessages','leaflet-directive'])

.run(function($ionicPlatform,$cordovaGeolocation, geoLocation) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

      $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
              geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude)
          }, function (err) {
              geoLocation.setGeolocation(37.38, -117.93)
          });

      // begin a watch
      var options = {
          frequency: 10000,
          timeout: 20000,
          enableHighAccuracy: false
      };

      var watch = $cordovaGeolocation.watchPosition(options);
      watch.then(function () { /* Not  used */
          },
          function (err) {
              geoLocation.setGeolocation(37.38, -117.93)
          }, function (position) {
              geoLocation.setGeolocation(position.coords.latitude, position.coords.longitude)
          });
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('top');
  //$ionicConfigProvider.tabs.style("standard");



  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $ionicConfigProvider.views.maxCache(0);

  
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:
  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.mevent-detail', {
    url: '/map/:eventId',
    views: {
      'tab-map': {
        templateUrl: 'templates/event-detail.html',
        controller: 'EventDetailCtrl'
      }
    }
  })

  .state('tab.event-detail', {
    url: '/home/:eventId',
    views: {
      'tab-home': {
        templateUrl: 'templates/event-detail.html',
        controller: 'EventDetailCtrl'
      }
    }
  })

  .state('tab.userEvent-detail', {
    url: '/account/:eventId',
    views: {
      'tab-account': {
        templateUrl: 'templates/event-detail.html',
        controller: 'EventDetailCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.signup', {
      url: '/signup',
      views: {
        'tab-account': {
        templateUrl: 'templates/tab-signup.html',
        controller: 'SignupCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
