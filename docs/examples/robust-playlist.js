angular.module('docs')
.controller('ProgressiveController', function ($scope, $timeout) {
  $scope.audioPlaylist = [];
  $scope.audioPlaylist.push({
    src: 'http://upload.wikimedia.org/wikipedia/en/7/79/Korn_-_Predictable_%28demo%29.ogg',
    type: 'audio/ogg'
  });
  $timeout(function () {
    $scope.audioPlaylist.unshift({
      src: 'http://upload.wikimedia.org/wikipedia/en/0/0c/Wiz_Khalifa_-_Black_and_Yellow.ogg',
      type: 'audio/ogg'
    });
  }, 5500);
  $timeout(function () {
    $scope.audioPlaylist.push({
      src: 'http://demos.w3avenue.com/html5-unleashed-tips-tricks-and-techniques/demo-audio.ogg',
      type: 'audio/ogg'
    });
  }, 9500);
});
