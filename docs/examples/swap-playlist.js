angular.module('docs')
.controller('SwapController', function ($scope, $timeout) {
  $scope.playlist1 = [];
  $timeout(function () {
    $scope.playlist1.push({ src: 'http://upload.wikimedia.org/wikipedia/en/7/79/Korn_-_Predictable_%28demo%29.ogg', type: 'audio/ogg'});
  }, 5000);
  $timeout(function () {
    $scope.playlist1[0] = { src: 'http://demos.w3avenue.com/html5-unleashed-tips-tricks-and-techniques/demo-audio.ogg', type: 'audio/ogg'};
  }, 10000);
});
