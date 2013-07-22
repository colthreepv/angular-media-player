angular.module('angular-audio-player', [])

.directive('audioPlayer', ['$rootScope', '$log', '$interpolate', '$timeout',
  function ($rootScope, $log, $interpolate, $timeout) {
    return {
      scope: {
        exposedPlayer: '=playerControl',
        playlist: '=playlist'
      },
      link: function (scope, element, attrs, ctrl) {
        if (element[0].tagName !== 'AUDIO') {
          return $log.error('audioPlayer directive works only when attached to an <audio> type tag');
        }
        var audioTag = element[0]
          , audioElement = []
          , sourceElements = element.find('source')
          , playlist = scope.playlist || [];

        // Create a single playlist element from <source> tag(s).
        angular.forEach(sourceElements, function (sourceElement, index) {
          audioElement.push({ src: sourceElement.src, type: sourceElement.type, media: sourceElement.media });
        });
        // Put audioElement as first element in the playlist
        if (audioElement.length) { playlist.unshift(audioElement); }

        scope.exposedPlayer = {
          playing: false,
          currentTrack: 0,
          tracks: playlist.length,
          play: function () {
            if (!this.currentTrack && audioTag.readyState) { this.currentTrack++; }
            audioTag.play();
          },
          playPause: function () {
            if (this.playing) {
              this.pause();
            } else {
              this.play();
            }
          },
          pause: function () {
            audioTag.pause();
          },
          next: function () {
            var self = this;
            if (self.currentTrack && self.currentTrack < self.tracks) {
              self.pause();
              $timeout(function () {
                self._clearAudioList();
                self._addAudioList(playlist[self.currentTrack]);
                audioTag.load(); // setup autoplay here.
                self.currentTrack++;
              });
            }
          },
          prev: function () {
            var self = this;
            if (self.currentTrack && self.currentTrack - 1) {
              self.pause();
              $timeout(function () {
                self._clearAudioList();
                self._addAudioList(playlist[self.currentTrack - 2]);
                audioTag.load(); // setup autoplay here.
                self.currentTrack--;
              });
            }
          },
          _addAudioList: function (audioList) { // accepts both an Array of audioElements or a single audioElement Object
            if (angular.isArray(audioList)) {
              angular.forEach(audioList, function (singleElement, index) {
                var sourceElem = angular.element($interpolate('<source src="{{ src }}" type="{{ type }}" media="{{ media }}">')(singleElement));
                element.append(sourceElem);
              });
            } else if (angular.isObject(audioList)) {
              var sourceElem = angular.element($interpolate('<source src="{{ src }}" type="{{ type }}" media="{{ media }}">')(audioList));
              element.append(sourceElem);
            }
          },
          _clearAudioList: function () {
            element.contents().remove();
          }
        };

        audioTag.addEventListener('playing', function (evt) {
          scope.$apply(function () {
            scope.exposedPlayer.playing = true;
          });
        });

        audioTag.addEventListener('pause', function (evt) {
          scope.$apply(function () {
            scope.exposedPlayer.playing = false;
          });
        });

        audioTag.addEventListener('ended', function (evt) {
          // Go to next();
          $log.warn('ended!');
        });

        scope.$watch('playlist', function (playlistNew, playlistOld, watchScope) {
          $log.warn('playlist changed');

          var player = scope.exposedPlayer
            , currentTrack
            , newTrackNum = null;
          
          /**
           * Playlist update logic:
           * **EXPLANATION HERE**
           */
          
          /**
           * Esempio 
           * playlist: [a,b,c], playing: playlist[trackNum], trackNum: 2
           * ----passano 5 sec-----
           * playlist: [f,a,b,c], playing: playlist[trackNum], trackNum: 3
           */

          // If the player has been started
          if (player.currentTrack) {
            currentTrack = playlistOld[player.currentTrack - 1];
            for (var i = 0; i < playlistNew.length; i++) {
              if (angular.equals(playlistNew[i], currentTrack)) { newTrackNum = i; break; }
            }
            if (newTrackNum) { // currentTrack it's still in the new playlist, update trackNumber
              player.currentTrack = newTrackNum + 1;
              player.tracks = playlistNew.length;
            } else { // currentTrack has been removed.
              audioTag.pause();
              if (playlistNew.length) { // if the new playlist has some elements, replace actual.
                $timeout(function () { // need $timeout because the audioTag needs a little time to launch the 'pause' event
                  player._clearAudioList();
                  player._addAudioList(playlistNew[0]);
                  audioTag.load();
                  player.tracks = playlistNew.length;
                });
              }
            }
          } else if (playlistNew.length) {
            player._clearAudioList();
            player._addAudioList(playlistNew[0]);
            audioTag.load();
            player.tracks = playlistNew.length;
          }

        }, true);

        scope.$on('$destroy', function () {
          // Cleanup code here! Remove EventListeners
        });
      }
    };
  }]
);
