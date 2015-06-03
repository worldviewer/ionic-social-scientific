angular.module('starter.controllers', [])

.controller('DashCtrl', ['$scope', 'Construct', function($scope, Construct) {
    Construct.find("Electric Joule Heating", function(found) {
        if (found) {
            $scope.construct = found;
        } else {
            $scope.none = "No such construct exists";
        }
    })
}])

.controller('ProfileCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('ConstructCtrl', ['$scope', 'Construct', function($scope, Construct) {
    Construct.find("Electric Joule Heating", function(found) {
        if (found) {
            $scope.construct = found;
        } else {
            $scope.none = "No such construct exists";
        }
    })
}]);
