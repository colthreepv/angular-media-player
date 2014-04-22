angular.module('docs-interactive', ['docs', 'ngDragDrop'])
// Taken from http://en.wikipedia.org/wiki/List_of_songs_considered_the_best
// Thanks again, wikipedia.
.constant('top100SongsEver', [
  { url: 'http://upload.wikimedia.org/wikipedia/en/5/5e/U2_One.ogg', displayName: 'U2 - One' },
  { url: 'http://upload.wikimedia.org/wikipedia/en/6/6c/NirvanaSmellsLikeTeenSpirit.ogg', displayName: 'Nirvana - Smells Like Teen Spirit' },
  { url: 'http://upload.wikimedia.org/wikipedia/en/b/be/My_Name_Is.ogg', displayName: 'Eminem - My Name is' },
  { url: 'http://upload.wikimedia.org/wikipedia/en/c/c4/Radiohead_-_Creep_%28sample%29.ogg', displayName: 'Radiohead - Creep' },
  { url: 'http://upload.wikimedia.org/wikipedia/en/6/64/OasisLiveForever.ogg', displayName: 'Oasis - Live Forever' },
  { url: 'http://upload.wikimedia.org/wikipedia/en/6/65/Eagles_-_Hotel_California.ogg', displayName: 'Eagles - Hotel California' },
  { url: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Stairway_to_Heaven_3_sections.ogg', displayName: 'Led Zeppelin - Stairway to Heaven' },
  { url: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Pink_floyd_another_brick_in_the_wall_part_2.ogg', displayName: 'Pink Floyd - Another Brick in the Wall' },
  { url: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Beatles_cometogether.ogg', displayName: 'Beatles - Come Together' },
  { url: 'http://upload.wikimedia.org/wikipedia/en/d/db/Layla_sample_1.ogg', displayName: 'Derek and the Dominos - Layla' }
])
.controller('InteractiveController', function ($scope, top100SongsEver, $log) {
  $scope.audioPlaylist = [];
  $scope.prefabPlaylist = top100SongsEver.map(function (song, index, array) {
    var parseTitle = song.displayName.match(/(.*?)\s?-\s?(.*)?$/);
    return { src: song.url, type: 'audio/ogg', artist: parseTitle[1], title: parseTitle[2] };
  });

  $scope.addSong = function (audioElement) {
    $scope.audioPlaylist.push(angular.copy(audioElement));
  };

  $scope.removeSong = function (index) {
    $scope.audioPlaylist.splice(index, 1);
  };

  $scope.dropSong = function (audioElement, index) {
    $scope.audioPlaylist.splice(index, 0, angular.copy(audioElement));
  };
});
