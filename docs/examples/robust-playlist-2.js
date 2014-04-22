angular.module('docs')
.controller('SwapController', function ($scope, $timeout) {
  var oasis = { src: 'http://upload.wikimedia.org/wikipedia/en/6/64/OasisLiveForever.ogg', type: 'audio/ogg'},
      beatles = { src: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Beatles_cometogether.ogg', type: 'audio/ogg'};

  $scope.audioPlaylist = [oasis];
  $scope.swapSong = function () {
    if (angular.equals($scope.audioPlaylist[0], oasis)) {
      $scope.audioPlaylist[0] = beatles;
    } else {
      $scope.audioPlaylist[0] = oasis;
    }
  };
});
