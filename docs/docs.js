angular.module('docs', ['ngRoute', 'templates-docs'])

// Definition of all examples as an hash
.constant('exampleHash', {
  'progressive-playlist': {
    displayName: 'Progressive Playlist',
    templateUrl: 'examples/progressive-playlist.tpl.html',
    controller: null
  }
})

.config(function ($routeProvider, exampleHash) {
  var example;
  $routeProvider
  .when('/', {
    templateUrl: 'docs.md.tpl.html'
  })
  .otherwise('/');

  // For each examples in list, new urls gets created.
  for (example in exampleHash) {
    $routeProvider.when('/' + example, {
      templateUrl: exampleHash[example].templateUrl,
      controller: exampleHash[example].controller
    });
  }
})

.run(function ($rootScope, $location) {
  // google analitics
  $rootScope.$on('$stateChangeSuccess', function () {
    $window._gaq.push(['_trackPageview', $location.path()]);
  });
})

.controller('BodyController', function ($scope, $route, exampleHash) {
  $scope.route = $route;
  $scope.exampleHash = exampleHash;

  // Utility function to return a boolean value wheter the current route has a certain path
  $scope.currentRoute = function (urlToMatch) {
    return (this.route.current) && this.route.current.$$route.originalPath === '/' + urlToMatch;
  };
});
