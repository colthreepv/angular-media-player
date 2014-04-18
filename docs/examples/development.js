angular.module('docs')
.controller('DevelopmentController', function ($scope, $log) {
  $scope.browser = navigator.userAgent;
  $scope.audioPlaylist = [
    {
      src: 'http://demos.w3avenue.com/html5-unleashed-tips-tricks-and-techniques/demo-audio.ogg',
      type: 'audio/ogg'
    }
  ];
});
