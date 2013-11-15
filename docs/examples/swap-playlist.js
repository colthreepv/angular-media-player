angular.module('docs')
.controller('SwapController', function ($scope, $timeout) {
  var korn = { src: 'http://upload.wikimedia.org/wikipedia/en/7/79/Korn_-_Predictable_%28demo%29.ogg', type: 'audio/ogg'},
      html5audio = { src: 'http://demos.w3avenue.com/html5-unleashed-tips-tricks-and-techniques/demo-audio.ogg', type: 'audio/ogg'};

  $scope.audioPlaylist = [korn];
  $scope.swapSong = function () {
    if (angular.equals($scope.audioPlaylist[0], korn)) {
      $scope.audioPlaylist[0] = html5audio;
    } else {
      $scope.audioPlaylist[0] = korn;
    }
  };
});
