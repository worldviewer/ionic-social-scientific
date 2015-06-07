angular.module('starter.controllers', [])

// The AppCtrl, LoginCtrl and DashCtrl controllers are for authorization
// and authentication
.controller('AppCtrl', function($state, $scope, $ionicPopup, 
    AuthService, AUTH_EVENTS) {
    $scope.username = AuthService.username();

    // Whenever our authentication service broadcasts this
    // notAuthorized event, we want to show this popup message
    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
        var alertPopup = $ionicPopup.alert({
            title: 'Unauthorized',
            template: 'You are not allowed to access this resource.'
        });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        $state.go('login');
        var alertPopup = $ionicPopup.alert({
            title: 'Session lost!',
            template: 'Please login again.'
        });
    });

    // Not a must-have, could also set a complete user object or session
    $scope.setCurrentUsername = function(name) {
        $scope.username = name;
    }
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, 
    AuthService) {
    $scope.data = {};

    $scope.login = function(data) {
        AuthService.login(data.username, data.password)
        .then(function(authenticated) {
            $state.go('main.dash', {reload: true});
            $scope.setCurrentUsername(data.username);

        }), function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed',
                template: 'Please check your credentials.'
            });
        }
    }
})

.controller('DashCtrl', function($scope, $state, $ionicPopup, 
    $http, AuthService) {

    $scope.logout = function() {
        AuthService.logout();
        $state.go('login');
    };

    $scope.performValidRequest = function() {
        $http.get('http://localhost:8100/valid').then(
            function(result) {
                $scope.response = result;
            });
    }

    $scope.performUnauthorizedRequest = function() {
        $http.get('http://localhost:8100/notauthorized').then(
            function(result) {
            }, function(err) {
                $scope.response = err;
            });
    }

    $scope.performInvalidRequest = function() {
        $http.get('http://localhost:8100/notauthenticated').then(
            function(result) {
            }, function(err) {
                $scope.response = err;
            });
    }

})

.controller('HomeCtrl', function($scope) {})

.controller('HelpCtrl', function($scope) {})

.controller('ModelCtrl', ['$scope', 'Construct', function($scope, 
  Construct, $stateParams) {

    Construct.find("Electric Joule Heating", function(found) {
        if (found) {
            $scope.construct = found;
        } else {
            $scope.none = "No such construct exists";
        }
    })
}])

// Propositions are tracked by id
.controller('PropositionCtrl', function($scope, Proposition, $stateParams) {

    Proposition.find(0, function(found) {
        if (found) {
            $scope.proposition = found;
        } else {
            $scope.none = "No such construct exists";
        }
    })
});

// .controller('ChatsCtrl', function($scope, Chats) {
//   // With the new view caching in Ionic, Controllers are only called
//   // when they are recreated or on app start, instead of every page change.
//   // To listen for when this page is active (for example, to refresh data),
//   // listen for the $ionicView.enter event:
//   //
//   //$scope.$on('$ionicView.enter', function(e) {
//   //});
  
//   $scope.chats = Chats.all();
//   $scope.remove = function(chat) {
//     Chats.remove(chat);
//   }
// })

// .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//   $scope.chat = Chats.get($stateParams.chatId);
// })

// .controller('AccountCtrl', function($scope) {
//   $scope.settings = {
//     enableFriends: true
//   };
// })