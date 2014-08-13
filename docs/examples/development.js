angular.module('docs')
.value('mp.throttleSettings', {
    enabled: true,
    time: 2000
})
.controller('DevelopmentController', function ($scope, $log) {
  $scope.browser = navigator.userAgent;
  $scope.mediaPlaylist = [
    {
      src: 'http://demos.w3avenue.com/html5-unleashed-tips-tricks-and-techniques/demo-audio.ogg',
      type: 'audio/ogg'
    }
  ];
});
