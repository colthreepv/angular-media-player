angular.module('docs')
.controller('VideoController', function ($scope) {
  $scope.videoPlaylist = [
    {
      src: 'http://video.webmfiles.org/big-buck-bunny_trailer.webm',
      type: 'video/webm'
    },
    {
      src: 'http://video.webmfiles.org/elephants-dream.webm',
      type: 'video/webm'
    }
  ];
});

