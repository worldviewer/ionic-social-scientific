angular.module('starter.controllers', [])

.controller('ProfileCtrl', function($scope) {})

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

.controller('ModelCtrl', ['$scope', '$state', 'Construct', function($scope, $state, Construct) {
    Construct.find("Electric Joule Heating", function(found) {
        if (found) {
            $scope.construct = found;
        } else {
            $scope.none = "No such construct exists";
        }
    })
}])

// Propositions are tracked by id
.controller('PropositionCtrl', ['$scope', '$state', '$stateParams', 'Proposition', function($scope, Proposition, $stateParams, $state) {

    $scope.propositions = Propositions.all();

    console.log($stateParams.propId);
    Proposition.find($stateParams.propId, function(found) {
        if (found) {
            $scope.proposition = found;
            console.log(found);
        } else {
            $scope.none = "No such construct exists";
        }
    })
}]);

