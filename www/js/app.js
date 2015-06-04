// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    // Tabbed Views
    // WILL NEED TO SWITCH THIS TO /model/:modelId ...
    .state('tab.model', {
        url: '/model',
        views: {
            'tab-model': {
                templateUrl: 'templates/tab-model.html',
                controller: 'ModelCtrl'
            }
        }
    })

    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('tab.help', {
        url: '/help',
        views: {
            'tab-help': {
                templateUrl: 'templates/tab-help.html',
                controller: 'HelpCtrl'
            }
        }
    })

    // Worldview-level

    .state('proposition', {
        url: "/propositions",
        abstract: true,
        templateUrl: "templates/propositions.html"
    })

    .state('proposition.id', {
        url: '/:propId',
        views: {
            'proposition-id': {
                templateUrl: "templates/proposition-id.html",
                controller: 'PropositionCtrl'
            }
        }
    });

    //   .state('tab.chat-detail', {
    //     url: '/chats/:chatId',
    //     views: {
    //       'tab-chats': {
    //         templateUrl: 'templates/chat-detail.html',
    //         controller: 'ChatDetailCtrl'
    //       }
    //     }
    //   })

    // .state('tab.account', {
    //   url: '/account',
    //   views: {
    //     'tab-account': {
    //       templateUrl: 'templates/tab-account.html',
    //       controller: 'AccountCtrl'
    //     }
    //   }
    // })

    // .state('profile', {
    //   url: '/profile',
    //   templateUrl: 'templates/profile.html',
    //   controller: 'ProfileCtrl'
    // });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/model');

});