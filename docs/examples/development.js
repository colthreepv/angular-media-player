angular.module('docs', ['audioPlayer'])
.controller('DevelopmentController', function ($scope, $log) {
  $scope.playPls = function (player) {
    player.play();
    $log.debug('i tried to play stuff');
  };
});
