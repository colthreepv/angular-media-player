angular.module('docs')
.controller('InteractiveController', function ($scope, top100SongsEver, $log) {
  $scope.audioPlaylist = [];
  $scope.prefabPlaylist = top100SongsEver.map(function (song, index, array) {
    var parseTitle = song.displayName.match(/(.*?)\s?-\s?(.*)?$/);
    return { src: song.url, type: 'audio/ogg', artist: parseTitle[1], title: parseTitle[2] };
  });

  $scope.addSong = function (audioElement) {
    $log.debug('added song', audioElement);
    $scope.audioPlaylist.push(audioElement);
  };
});
