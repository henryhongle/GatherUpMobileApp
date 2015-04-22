angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, Event, geoLocation) {
	
	var position = geoLocation.getGeolocation();
	Event.getNearEvents(position).then(function (data) {
		$scope.events = data;
		console.log($scope.events);
	});

	$scope.doRefresh = function() {
		var position = geoLocation.getGeolocation();
		Event.getNearEvents(position).then(function (data) {
			if (data) {
				$scope.events = data;
				$scope.$broadcast('scroll.refreshComplete');
			}
			else {
				$scope.$broadcast('scroll.refreshComplete');
			}
		});
	}
})

.controller('EventDetailCtrl', function($scope, Event,$state, $stateParams, Auth, $ionicModal) {
	$scope.event = Event.get($stateParams.eventId);
	$scope.showForm = false;
	$scope.comment = {body: ""};
	$scope.user = Auth.isAuth();
	if ($scope.user) {
		$scope.showForm = true;
	}

	$scope.doRefresh = function() {
		$scope.event = Event.get($stateParams.eventId);
		$scope.showForm = false;
		$scope.user = Auth.isAuth();
		if ($scope.user) {
			$scope.showForm = true;
		}
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.addComment = function() {	
		//console.log(comment);
		if ($scope.event.num_comment === 0) {
			$scope.event.comments[0] = $scope.comment.body;
		}
		else {
			$scope.event.comments.push($scope.comment.body);
		}
		$scope.event.num_comment++;
		
		$scope.event.$save().then(function(ref) {
			$scope.comment = {body: ""};
			$scope.modal.hide();
		}, function(error) {
		  console.log("Error:", error);
		});
	};

	$ionicModal.fromTemplateUrl('templates/comments.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal
	  })  

	  $scope.openModal = function() {
	    $scope.modal.show();
	  }

	  $scope.closeModal = function() {
	  	$scope.comment = {body: ""};
	    $scope.modal.hide();
	  };


	  $scope.$on('$destroy', function() {
	  	$scope.modal.hide();
	    $scope.modal.remove();
	  });
})

.controller('MapCtrl', function($scope, Event, $state, $stateParams, geoLocation,$window) {
	$scope.map = {
		center:{},
		markers: {},
		defaults: {}
	};

	var position = geoLocation.getGeolocation();
	$scope.map.defaults = {
        tileLayer: geoLocation.mb_token,
        maxZoom: 18
    };

	$scope.map.center = {
            lat: position.lat,
            lng: position.lng,
            zoom: 12
    };

	
	Event.getNearEvents(position).then(function (events) {
		//console.log(events);
		//var markers= [];
		var markers = {};
		var i = 1;
		for (id in events) {
			if (events.hasOwnProperty(id)) {
				//var val = id.substring(1);
				//markers.push({lat:events[id].lat, lng: events[id].lng, message: events[id].name});
				var val = "m" + i.toString();
				markers[val] = {lat:events[id].lat, lng: events[id].lng, message: events[id].name};
				i++;
    		}
		} 
		console.log(markers);

		console.log(markers);
		//console.log(JSON.stringify({markers:markers}));
		$scope.map.markers = markers;
		//$scope.$apply();
	});

   	$scope.getCurrent = function() {
   		var pos = geoLocation.getGeolocation();
   		$scope.map.defaults = {
	        tileLayer: geoLocation.mb_token,
	        maxZoom: 18
	    };
		$scope.map.center = {
	            lat: position.lat,
	            lng: position.lng,
	            zoom: 12
	    };
   	};
})


.controller('AccountCtrl', function($scope, Auth, Event) {
	$scope.errorMessage = null;
	$scope.showLogin = true;
	$scope.user = Auth.isAuth();

	if ($scope.user) {
		$scope.showLogin = false;

		Event.getUserEvents($scope.user.uid).then(function (data) {
			$scope.events = data;
			//$scope.$apply();
		});
	}

	$scope.login = function(em,pwd) {
		Auth.ref().authWithPassword({
  			email: em,
  			password: pwd
  		}, function(error, authData) {
  			if (error === null) {
  				$scope.showLogin = false;
  				$scope.errorMessage = null;
  				Event.getUserEvents(authData.uid).then(function (data) {
					$scope.events = data;
					//$scope.$apply();
				});
  			}
  			else {
  				$scope.showLogin = true;
  				$scope.errorMessage ='Incorrect email/password combination';
  				//$scope.$apply();
  			}
  		});
	};

	$scope.logout = function() {
		Auth.ref().unauth();
		$scope.user = null;
		$scope.showLogin = true;	
	};
})

.controller('SignupCtrl', function($scope, Auth, $state) {
	
	$scope.errorMessage = null;

	$scope.signup = function(em,pwd) {
		$scope.errorMessage = null;
	    Auth.ref().createUser( {
	      email: em,
	      password: pwd
	    }, function(error,user) {
		      if (!error) {
		        Auth.createProfile(user,em);
		        $state.go("tab.account");
		      }
		      else {
		        $scope.errorMessage = "Email is already taken!";
		        $scope.$apply();
		      } 
		});
	};
});























