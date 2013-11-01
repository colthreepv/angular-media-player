angular.module('docs')
.controller('ProgressiveController', function ($scope, $timeout) {
  $scope.playlist1 = [];
  $scope.playlist1.push({
    src: 'http://upload.wikimedia.org/wikipedia/en/7/79/Korn_-_Predictable_%28demo%29.ogg',
    type: 'audio/ogg'
  });
  $timeout(function () {
    $scope.playlist1.unshift({
      src: 'http://www.metadecks.org/software/sweep/audio/demos/vocal2.ogg',
      type: 'audio/ogg'
    });
  }, 5500);
  $timeout(function () {
    $scope.playlist1.push({
      src: 'http://demos.w3avenue.com/html5-unleashed-tips-tricks-and-techniques/demo-audio.ogg',
      type: 'audio/ogg'
    });
  }, 9500);
});
