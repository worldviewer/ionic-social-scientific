angular.module('starter.services', [])

// This is used for sanitizing raw HTML that is fed from the db
.filter("sanitize", ['$sce', function($sce) {return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);}
}])

.service('AuthService', function($q, $http, USER_ROLES) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);

    if (token) {
      useCredentials(token);
    }
  };

  // Note that if there was a checkbox to Remember Me or Keep Me
  // Logged In, and the user does not check it, we'd use the 
  // session storage so that authorizatio is deleted when the
  // user leaves the website.  For now, we don't have that checkbox,
  // so we just use the localStorage.
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  };

  function useCredentials(token) {
    // Extract the username from the token
    username = token.split('.')[0];

    isAuthenticated = true;
    authToken = token;

    if (username == 'admin') {
      role = USER_ROLES.admin
    }

    if (username == 'public') {
      role = USER_ROLES.public
    }

    // Set the default headers for your next request.  REST API's
    // will most of the time have some authentication based on the
    // X-Auth-Token, so if we set the default headers, all of our
    // next requests will be signed with this token.
    $http.defaults.headers.common['X-Auth-Token'] = token;
  };

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  };

  var login = function(name, pw) {

    // promise
    return $q(function(resolve, reject) {
      if ((name == 'admin') && (pw == '1') ||
          (name == 'user') && (pw == '1')) {

        // If we are actually authenticated, the server should
        // return some token.  We should store those user credentials.
        storeUserCredentials(name + '.yourServerToken');
        resolve('Login success.');
      } else {
        reject('Login failed.');
      }
    });
  };

  var logout = function() {
    destroyUserCredentials();
  }

  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }

    // Grant access if our user roles are inside of the array
    // of authorizedRoles
    return (isAuthenticated && authorizedRoles.indexOf(role) != -1)
  }

  // When our service is initiated, we want to check if we already
  // have some user credentials stored, so that we recognize the user
  // and can automatically log them in.

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() { return isAuthenticated; },
    username: function() { return username; },
    role: function() { return role; }
  }
})

// This will intercept all of our http calls to check for HTTP
// requests which return either 401 or 403.  When either of those
// statuses is returned, we broadcast an event and the request
// is not completed.
.factory("AuthInterceptor", function($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function(response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);

      return $q.reject(response);
    }
  }
})

// This injects our AuthInterceptor
.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

.factory("Proposition", [function() {
  var propositions = [{
    id: 0,
    name: "Cosmic Plasma Debate",
    description: "There has been a debate over how to model cosmic plasmas (such as the solar wind) for more than half a century between the Astrophysical Journal and IEEE's Transactions on Plasma Science.",
    type: "Claim",
    headerimages: ["img/journals/AJ-vs-IEEE.jpg"],

    support: [{
      images: ["img/books/the-electric-universe-on-astrophysicists.jpg"],
      title: "Some Electrical Theorists Have Claimed that Astrophysicists Have Not Been Prepared to Interpet Electrical Astronomical Events",
      icon: "img/experts/wal-thornhill.jpg",
      text: null,
      source: "The Electric Universe",
      author: "@WalThornhill",
      URL: "http://www.amazon.com/Electric-Universe-Wallace-Thornhill-Talbott/dp/0977285138/",
      postscript: null

    }, {

      images: ["img/journals/IEEE-largest-technical-society-thin.jpg"],
      title: "What is IEEE?",
      icon: "img/journals/IEEE.png",
      text: null,
      source: "IEEE's Website",
      author: null,
      URL: "https://www.ieee.org/about/ieee_history.html",
      postscript: null

    }, {

      images: ["img/infographics/hannes-alfven-bio-small.jpg"],
      title: "The Debate Was Begun by the Nobel Laureate Who Invented the Cosmic Plasma Models Used by Astrophysicists to this Day",
      icon: "img/experts/david-talbott.jpg",
      text: null,
      source: "Edge Magazine (original article currently not online)",
      author: "@DavidTalbott",
      URL: "https://plus.google.com/108466508041843226480/posts/YoTuHGL16ur",
      postscript: null

    }, {

      images: ["img/forums/is-tim-thompson-on-ieee.jpg"],
      title: "An Example of an Astrophysicist Advising His Colleagues to Avoid Reading IEEE",
      icon: "img/experts/tim-thompson.jpg",
      text: null,
      source: "International Skeptics Forum",
      author: "@TimThompson",
      URL: "http://www.internationalskeptics.com/forums/showpost.php?s=808a20363648151505620e5b174cdc4c&p=4782369&postcount=8%EF%BB%BF",
      postscript: null

    }],

    suggestions: [{
      id: 0,
      author: "@JimJohnson",
      avatar: "img/experts/jim-johnson.jpg",
      title: "Peratt's Galactic Simulations",
      comment: "What should probably be mentioned is that Peratt has used government supercomputers to simulate proper galactic rotation curves without the need for dark matter.  All that he did was fit the cosmic plasma models to laboratory plasma observations.\n\nSee <a href='http://www.plasma-universe.com/Galaxy_formation'>Ian Tresman's Plasma Wiki Page on Peratt</a>   <i class='icon ion-plus-circled'></i>.",
      postscript: null,
      date: "June 1, 2015 4:20 PM PST",
      score: 10,
      moderate: false

    }, {

      id: 1,
      author: "@BrianKoberlein",
      avatar: "img/experts/brian-koberlein.jpg",
      title: "Bullshit",
      comment: "The Electric Universe has been debunked.  Please stop the nonsense.",
      postscript: "We kindly ask that you keep debate containered in the worldview pages.  This area is reserved for the accumulation of supporting resources.  For debate, go to<br><br><span class='blue-pane'><i class='icon ion-alert-circled'></i>\t&emsp;&emsp;I Can Counter That&emsp;&emsp;<i class='icon ion-chevron-right'></i></span><br><br>",
      date: "June 3, 2015 10:01 PM EST",
      score: 1,
      moderate: true

    }]

  }, {

    id: 1,
    name: "Plasmas Are Not Simply Fluids",
    description: "Conventional theory models this flow of charged particles fundamentally as a fluid governed most significantly by gravity, but these models have been in dispute since their inception.",
    type: "Claim",
    headerimages: [""],
    support: {

    }    

  }, {

    name: "Electric joule heating stems from the idea that these moving charges are an electric current, and advocates point to the fact that the solar wind is oftentimes guided by planetary magnetic fields into the poles.",
    supportingclaims: {

    }    

  }, {

    name: "The presence of hot spots at the poles of Enceladus, Neptune and Venus, in particular, are suggestive of the simple idea that these moving charged particles can heat up the planets.",
    supportingclaims: {

    }    

  }, {

    name: "It was noted in 2005 by NASA that Mars' ice caps had also been diminishing for three summers in a row.",
    supportingclaims: {

    }    

  }, {

    name: "Pluto has continued to warm up even as it moves away from the Sun.",
    supportingclaims: {

    }    

  }, {

    name: "Many atmospheric circulation models are unable to reproduce the observed polar stratospheric winds (aka the polar vortex).",
    supportingclaims: {

    }    

  }, {

    name: "The observed splitting of the polar vortex on both Earth and Venus is an expected feature of laboratory plasmas when they are conducting electrical currents, yet climate and planetary scientists claim to not understand either observation.",
    supportingclaims: {

    }    

  }, {

    name: "The solar wind intensity correlates with lightning strikes, raising questions about lightning's underlying cause, and suggesting that the Earth is part of a larger electrical circuit.",
    supportingclaims: {

    }    

  }, {

    name: "Sunspot numbers appear to correlate with lower stratosphere temperature anomalies, minus the temporal effects of volcanic eruptions -- suggesting that the sunspots are related to these electrical flows. Laboratory plasma terrella experiments appear to confirm this suspicion.",
    supportingclaims: {

    }    

  }, {

    name: "Electric field variability can significantly increase the amount of Joule heating, yet existing general circulation models assume a smooth field in both space and time.  In other words, the current climate models do not take electric joule heating into account.",
    supportingclaims: {

    }    

  }];

  this.all = function(cb) {
      return cb(propositions);
  };

  this.find = function(searchId, cb) {
      for (var i=0; i < propositions.length; i++) {
          var proposition = propositions[i];
          if (parseInt(proposition.id) === parseInt(searchId)) {
              return cb(proposition);
          }
      }

      return cb(false);
  };

  return this;

}])

.factory("Construct", [function() {

  // fake the data
  var constructs = [{
      id: 1,
      name: "Electric Joule Heating",
      headerimages: ["img/headers/electric-joule-heating-header.jpg"],
      type: "Model",
      shortDefinition: "Electric joule heating proposes that the Earth can be electrically heated by the flow of charged particles coming from the Sun and other cosmic plasma phenomena.",

      // Come back later and encode this as proposition.id; then inject the proposition w/ the model factory

      longDefinition: ["There has been a debate over how to model cosmic plasmas (such as the solar wind) for more than half a century between the Astrophysical Journal and IEEE's Transactions on Plasma Science.",
               "Conventional theory models this flow of charged particles fundamentally as a fluid, but these models have been in dispute since their inception.",
               "Electric joule heating stems from the idea that these moving charges are an electric current, and advocates point to the fact that the solar wind is oftentimes guided by planetary magnetic fields into the poles.",
               "The presence of hot spots at the poles of Enceladus, Neptune and Venus, in particular, are suggestive of the simple idea that these moving charged particles can heat up the planets.",
               "It was noted in 2005 by NASA that Mars' ice caps had also been diminishing for three summers in a row.",
               "Pluto has continued to warm up even as it moves away from the Sun.",
               "Many atmospheric circulation models are unable to reproduce the observed polar stratospheric winds (aka the polar vortex).",
               "The observed splitting of the polar vortex on both Earth and Venus is an expected feature of laboratory plasmas when they are conducting electrical currents, yet climate and planetary scientists claim to not understand either observation.",
               "The solar wind intensity correlates with lightning strikes, raising questions about lightning's underlying cause, and suggesting that the Earth is part of a larger electrical circuit.",
               "Sunspot numbers appear to correlate with lower stratosphere temperature anomalies, minus the temporal effects of volcanic eruptions -- suggesting that the sunspots are related to these electrical flows. Laboratory plasma terrella experiments appear to confirm this suspicion.",
               "Electric field variability can significantly increase the amount of Joule heating, yet existing general circulation models assume a smooth field in both space and time.  In other words, the current climate models do not take electric joule heating into account."],

      status: "Electric joule heating is not widely known, and much of the data necessary to judge the idea has yet to be taken. No known experiments or observational satellites are currently planned to test it. The concept is not taught to climatologists today, and it appears in no climate textbooks. Electric joule heating is a natural implication of the Electric Universe paradigm.",

      experts: [{
        name: "@ChrisReeve",
        title: "Layperson Advocate",
        image: "img/experts/chris-reeve.png"
      },{

        name: "@BillNichols",
        title: "Atmospheric Scientist",
        image: "img/experts/bill-nichols.jpg"
      },{

        name: "@PiersCorbyn",
        title: "Theorist, WeatherAction",
        image: "img/experts/piers-corbyn.jpg"
      },{

        name: "@BobJohnson",
        title: "Independent Plasma Theorist",
        image: "img/experts/bob-johnson.jpg"
      }],

      critiques: [{
        critic: {image: "img/experts/lief-svalgaard.png",
             title: "WUWT's Resident Solar Expert",
             name: "@LeifSvalgaard"},
        text: null,
        pics: [{url: "http://wattsupwiththat.com/2013/12/26/new-paper-clouds-blown-by-the-solar-wind/#more-99909",
              image: "img/critiques/electric-joule-heating-lsvalgaard.jpg"}],
        prescript: null,
        postscript: null
      }],

      // Add in electric joule paper critique?

      cmaps: [{
        image: "img/concept-maps/electric-joule-heating-cmap-small.jpg",

        nodes: [{alt:"", title:"", href:"#", shape:"rect", coords:"31,13,91,52"},
                  {alt:"", title:"", href:"#", shape:"rect", coords:"162,10,225,48"},
                  {alt:"", title:"", href:"#", shape:"rect", coords:"238,71,300,98"},
                  {alt:"", title:"", href:"#", shape:"rect", coords:"105,118,148,156"},
                  {alt:"", title:"", href:"#", shape:"rect", coords:"190,143,246,180"},
                  {alt:"", title:"", href:"#", shape:"rect", coords:"188,240,249,276"},
                  {alt:"", title:"", href:"#", shape:"rect", coords:"96,245,158,274"},
                  {alt:"", title:"", href:"#", shape:"rect", coords:"7,125,54,153"},
                  {alt:"", title:"", href:"#", shape:"rect", coords:"3,221,58,277"}],

          mappername: "@ChrisReeve",
          mapperpic: "img/experts/chris-reeve.png",
        title: "The Primitive Equations Ignore Charge Phenomena Changes",
          display: true,
          prescript: "testing!",
          postscript: "Inspired by communication with atmospheric scientist, @BillNichols"

      },{

        image: "img/concept-maps/structure-of-science-small.jpg",
        nodes: [{alt:"", title:"", href:"#", shape:"rect", coords:""}],
        mappername: "@ChrisReeve",
        mapperpic: "img/experts/chris-reeve.png",
        title: "Electric Joule Heating, E-fields and Magnetic Fields Explained",
          display: false,
          prescript: null,
          postscript: null

      },{

        image: "img/concept-maps/structure-of-science-small.jpg",
        nodes: [{alt:"", title:"", href:"#", shape:"rect", coords:""}],
        mappername: "@ChrisReeve",
        mapperpic: "img/experts/chris-reeve.png",
          title: "What is a Plasma? And Why Does It Matter?",
          display: false,
          prescript: null,
          postscript: null

      },{

        image: "img/concept-maps/structure-of-science-small.jpg",
        nodes: [{alt:"", title:"", href:"#", shape:"rect", coords:""}],
        mappername: "@ChrisReeve",
        mapperpic: "img/experts/chris-reeve.png",
          title: "What is a General Circulation Model?",
          display: false,
          prescript: null,
          postscript: null
  }],

      infographics: [{
          title: "There's a Mistake in the Climate Models and It's Called Electric Joule Heating",
          url: "https://plus.google.com/108466508041843226480/posts/GfRTMJDtUZU",
          image: "img/infographics/electric-joule-heating-small.jpg",
          display: true,
          prescript: null,
          postscript: null

      }, {

          title: "The Greenhouse Effect Was Not Observed on Venus by the Pioneer Venus Mission; It Was Assumed",
          url: "https://plus.google.com/108466508041843226480/posts/hKf2QRETTAy",
          image: "img/infographics/venus-heat-small.jpg",
          display: true,
          prescript: null,
          postscript: null

      }, {

          title: "A Mythologist Tells the Story that Scientists Refuse to Teach in University Physics",
          url: "https://plus.google.com/108466508041843226480/posts/YoTuHGL16ur",
          image: "img/infographics/hannes-alfven-bio-small.jpg",
          display: true,
          prescript: null,
          postscript: null

      }],

      // Add in article at https://www.nasa.gov/mission_pages/themis/news/themis_leaky_shield.html#.VXNBYDTF8vE

      articles: [{
          title: "Solar Wind Surprise",
          authors: ["@StuartWolpert", "@AnthonyWatts"],
          sourcename: "Wattsupwiththat Blog",
          image: "/img/articles/solar-wind-surprise.png",
          url: "http://wattsupwiththat.com/2009/09/10/solar-wind-suprise-this-discovery-is-like-finding-it-got-hotter-when-the-sun-went-down/",
          text: null,
          images: ["img/articles/wuwt-01-energy-transfer.jpg",
              "img/articles/wuwt-02-major-surprise.jpg",
              "img/articles/wuwt-03-energy-variations.jpg"],
          prescript: null,
          postscript: null

      }, {

          title: "Global Warming in a Climate of Ignorance",
          authors: ["@WalThornhill"],
          sourcename: "Holoscience",
          image: "img/articles/changing-sun-in-xrays.jpg",
          url: "http://www.holoscience.com/wp/global-warming-in-a-climate-of-ignorance/",
          text: null,
          images: ["img/articles/sun-power-surge.jpg"],
          prescript: null,
          postscript: null

      }, {

          title: "Science, Politics and Global Warming",
          authors: ["@WalThornhill"],
          sourcename: "Holoscience",
          image: "img/articles/AGW-cartoon.png",
          url: "http://www.holoscience.com/wp/science-politics-and-global-warming/",
          text: null,
          images: ["img/articles/thornhill-on-climatologists-1.jpg", "img/articles/thornhill-on-climatologists-2.jpg"],
          prescript: null,
          postscript: null

      }],

      forums: [{
          sourcename: "Wattsupwiththat Blog",
          url: "http://wattsupwiththat.com/2015/04/30/how-plasma-connects-the-sun-to-the-climate/",
          image: "img/forums/earth-sun-connected.jpg",
          prescript: null,
          postscript: "Note that WUWT has a policy against running stories that relate to the Electric Universe, but they appear to have made an exception in this case."
      }],

      papers: [{
          journalicon: "img/journals/journal-geophysical-research.png",
          url: "http://nldr.library.ucar.edu/repository/assets/osgc/OSGC-000-000-004-001.pdf",
          title: "Possible reasons for underestimating Joule heating in global models: E-Field variability, spatial resolution and vertical velocity",
          journal: "Journal of Geophysical Research",
          year: 2007,
          text: null,
          images: ["img/papers/electric-joule-heating-1.jpg", "img/papers/electric-joule-heating-2.jpg", "img/papers/electric-joule-heating-3.jpg", "img/papers/electric-joule-heating-4.jpg"],
  prescript: null,
  postscript: null                

      }],

// Another paper on this topic here:
// http://www.ann-geophys.net/19/773/2001/angeo-19-773-2001.pdf

      books: [{
          title: "The Manic Sun: Weather Theories Confounded",
          author: "@NigelCalder",
          url: "http://www.amazon.com/Manic-Sun-Weather-Theories-Confounded/dp/1899044116/",
          cover: "img/books/manic-sun.png",
          images: null,
          text: ["The solar physicists cared just as much as the official climatologists, about keeping the world safe for their grandchildren.  <span style='background-color:yellow'>They said it was rash to suppose that every possible variation in the Sun&#39;s output of light had been seen by the satellites in the course of a single solar cycle. The solar-terrestrial physicists, for their part, pleaded for consideration of other ways in which the Sun might affect the Earth via the solar wind -- auroras, that sort of thing</span>. They were awfully vague, though, about how it could happen. -p18", 

              "To achieve its remarkable projection of future temperatures, the report had to argue that the global warming of the twentieth century was largely due to carbon dioxide and other greenhouse gases. The role of the Sun had to be minimized.  The commentary concentrated entirely on changes in the output of radiant energy from the visible disk.  <span style='background-color:yellow'>As for the invisible heliosphere that embraced the Earth in the solar wind, and might contain other possible ways of changing the climate, for Houghton&#39;s group it did not exist.</span> -p41-42"],
  prescript: null,
  postscript: null                    

      }, {

          title: "A Vast Machine: Computer Models, Climate Data, and the Politics of Global Warming",
          author: "@PaulNEdwards",
          url: "http://www.amazon.com/Vast-Machine-Computer-Politics-Infrastructures/dp/0262518635/",
          cover: "img/books/a-vast-machine.png",
          images: null,
          text: null,
          prescript: null,
          postscript: "This is not about electric joule heating, but it will teach you how the models work."

      }, {

          title: "The Electric Universe",
          author: "@WalThornhill",
          url: "http://www.amazon.com/Electric-Universe-Wallace-Thornhill-Talbott/dp/0977285138/",
          cover: "img/books/the-electric-universe.png",
          images: null,
          text: null,
          prescript: null,
          postscript: "This text is similar to Don Scott's The Electric Sky; both are useful for understanding the more electrical side of the debate over how to model cosmic plasmas."

      }],

      // Add in video at https://www.nasa.gov/mission_pages/themis/news/themis_leaky_shield.html#.VXNBYDTF8vE

      media: [{
          title: "Our Changing Climate and the Variable Sun",
          author: "@SpaceNews",
          url: "https://www.youtube.com/watch?v=VIAp_6FAXCY",
          image: "img/audio-video/space-news.png",
          prescript: null,
          postscript: null

      }, {

          title: "Electric Earth, Electric Weather",
          author: "@BillNichols",
          url: "https://www.youtube.com/watch?v=USQIPY3YMfU",
          image: "img/audio-video/bill-nichols-video.png",
          prescript: null,
          postscript: null

      }, {

          title: "The Reality of Long Range Weather and Climate Forecasting",
          author: "@PiersCorbyn",
          url: "https://www.youtube.com/watch?v=6R26PXRrgds",
          image: "img/audio-video/piers-corbyn-video.png",
          prescript: null,
          postscript: null

      }, {

          title: "Our Variable Sun & Climate Change",
          author: "@BobJohnson",
          url: "https://www.youtube.com/watch?v=XdrDg-Nuxdg",
          image: "img/audio-video/bob-johnson-video.png",
          prescript: null,
          postscript: null

      }]
  }];

  this.all = function(cb) {
      return cb(constructs);
  };

  this.find = function(constructname, cb) {
      for (var i=0; i < constructs.length; i++) {
          var construct = constructs[i];
          if (construct.name.toLowerCase() === constructname.toLowerCase()) {
              return cb(construct);
          }
      }

      return cb(false);
  };

  return this;

}]);

// .factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
//   var chats = [{
//     id: 0,
//     name: 'Ben Sparrow',
//     lastText: 'You on your way?',
//     face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
//   }, {
//     id: 1,
//     name: 'Max Lynx',
//     lastText: 'Hey, it\'s me',
//     face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
//   },{
//     id: 2,
//     name: 'Adam Bradleyson',
//     lastText: 'I should buy a boat',
//     face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
//   }, {
//     id: 3,
//     name: 'Perry Governor',
//     lastText: 'Look at my mukluks!',
//     face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
//   }, {
//     id: 4,
//     name: 'Mike Harrington',
//     lastText: 'This is wicked good ice cream.',
//     face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
//   }];

//   return {
//     all: function() {
//       return chats;
//     },
//     remove: function(chat) {
//       chats.splice(chats.indexOf(chat), 1);
//     },
//     get: function(chatId) {
//       for (var i = 0; i < chats.length; i++) {
//         if (chats[i].id === parseInt(chatId)) {
//           return chats[i];
//         }
//       }
//       return null;
//     }
//   };
// })

