angular.module('docs', ['ngRoute', 'templates-docs'])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'docs.md.tpl.html'
  })
  .otherwise('/');
})
.run(function ($rootScope, $location) {
  // google analitics
  $rootScope.$on('$stateChangeSuccess', function () {
    $window._gaq.push(['_trackPageview', $location.path()]);
  });
})
.controller('BodyController', function ($scope) {

});
