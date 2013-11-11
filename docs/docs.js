angular.module('docs', ['ngRoute', 'templates-docs', 'audioPlayer', 'ngDragDrop'])

// Definition of all examples as an hash
.constant('exampleHash', {
  '': {
    displayName: 'Getting Started',
    templateUrl: 'docs.md.tpl.html'
  },
  'progressive-playlist': {
    displayName: 'Progressive Playlist',
    templateUrl: 'examples/progressive-playlist.tpl.html',
    controller: 'ProgressiveController'
  },
  'populate-playlist': {
    displayName: 'Self-populating playlist',
    templateUrl: 'examples/populate-playlist.tpl.html',
    controller: 'PopulateController'
  },
  'swap-playlist': {
    displayName: 'Swap Audio during play',
    templateUrl: 'examples/swap-playlist.tpl.html',
    controller: 'SwapController'
  },
  'interactive-demo': {
    displayName: 'Interactive Demo',
    templateUrl: 'examples/interactive.tpl.html',
    controller: 'InteractiveController'
  },
  'repeat-audio': {
    displayName: 'Using ng-repeat',
    templateUrl: 'examples/repeat-audio.tpl.html',
    controller: 'RepeatController'
  }
})

.config(function ($routeProvider, $locationProvider, exampleHash) {
  var example;
  $routeProvider.when(null, { redirectTo: '/' });
  // For each examples in list, new urls gets created.
  for (example in exampleHash) {
    $routeProvider.when('/' + example, {
      templateUrl: exampleHash[example].templateUrl,
      controller: exampleHash[example].controller
    });
  }

  // Hashbang for searchbot indexing
  $locationProvider.hashPrefix('!');
})

.run(function ($rootScope, $window) {
  // google analitics
  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    if (current.$$route.originalPath) {
      $window._gaq.push(['_trackPageview', current.$$route.originalPath]);
    }
  });
})

.controller('BodyController', function ($scope, $route, exampleHash) {
  $scope.route = $route;
  $scope.exampleHash = exampleHash;

  // Utility function to return a boolean value wheter the current route has a certain path
  $scope.currentRoute = function (urlToMatch) {
    if (urlToMatch === undefined || urlToMatch === null) { // in case undefined or null, it returns the displayName of the route
      return (this.route.current) ? exampleHash[this.route.current.$$route.originalPath.substring(1)].displayName : null;
    }
    return (this.route.current) && this.route.current.$$route.originalPath === '/' + urlToMatch;
  };
});
