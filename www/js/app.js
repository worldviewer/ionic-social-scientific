// Ionic Starter App

// angular.module is a global place for creating, registering and 
// retrieving Angular modules 'starter' is the name of this angular 
// module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 
    'starter.services', 'ngMockE2E'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the 
        // accessory bar above the keyboard for form inputs)
        if (window.cordova && window.cordova.plugins 
            && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
        }
    });
})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
    // This runs on any state change in our app
    $rootScope.$on('$stateChangeStart', function(event, next, 
        nextParams, fromState) {

        // If the user is not authorized to go to the new page, 
        // then don't change to the new page.
        if (('data' in next) && ('authorizedRoles' in next.data)) {
            var authorizedRoles = next.data.authorizedRoles;
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                $state.go($state.current, {}, {reload: true});
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }
        }

        // If we see on any change of a route that our user is not at
        // this moment authenticated, then cancel that event, so he
        // has no chance to see that page, and go back to the login
        // page.
        if (!AuthService.isAuthenticated()) {
            if (next.name !== 'login') {
                event.preventDefault();
                $state.go('login');
            }
        }
    })
})

.run(function($httpBackend){
    // These are our dummy responses
    $httpBackend.whenGET('http://localhost:8100/valid')
        .respond({message: 'This is my valid response!'});
    $httpBackend.whenGET('http://localhost:8100/notauthenticated')
        .respond(401, {message: 'Not authenticated!'});
    $httpBackend.whenGET('http://localhost:8100/notauthorized')
        .respond(403, {message: 'Not authorized!'});

    // This is a basic setting for the mock $httpBackend so our requests 
    // pass and we can access our views.
    $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
})

.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {

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

    // .state('proposition', {
    //     url: "/propositions",
    //     abstract: true,
    //     templateUrl: "templates/propositions.html"
    // })

    // .state('proposition.id', {
    //     url: '/:propId',
    //     views: {
    //         'proposition-id': {
    //             templateUrl: "templates/proposition-id.html",
    //             controller: 'PropositionCtrl'
    //         }
    //     }
    // });

    .state('tab.proposition', {
        url: '/propositions/:propId',
        views: {
            'tab-model': {
                templateUrl: "templates/proposition-id.html",
                controller: 'PropositionCtrl'
            }
        }
    })

    // Authorization and authentication route states

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    .state('main', {
        url: '/',
        abstract: true,
        templateUrl: 'templates/main.html'
    })

    .state('main.dash', {
        url: 'main/dash',
        views: {
            'dash-tab': {
                templateUrl: 'templates/dashboard.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('main.public', {
        url: 'main/public',
        views: {
            'public-tab': {
                templateUrl: 'templates/public.html'
            }
        }
    })

    .state('main.admin', {
        url: 'main/admin',
        views: {
            'admin-tab': {
                templateUrl: 'templates/admin.html'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.admin]
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
    $urlRouterProvider.otherwise('/main/dash');

});