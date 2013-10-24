angular.module('docs', [])
.run(function ($rootScope, $location) {
  // google analitics
  $rootScope.$on('$stateChangeSuccess', function () {
    $window._gaq.push(['_trackPageview', $location.path()]);
  });
})
.controller('BodyController', function ($scope) {

});
