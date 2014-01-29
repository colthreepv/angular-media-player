/**
 * USEFUL LINKS:
 * Media events on <audio> and <video> tags:
 * https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Events/Media_events
 * Properties and Methods:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 *
 * Understanding TimeRanges objects:
 * http://html5doctor.com/html5-audio-the-state-of-play/
 *
 * Wonderful documentation from MDN, really.
 */
angular.module('audioPlayer', [])

.directive('audioPlayer', ['$rootScope', '$log', '$interpolate', '$timeout', 'throttle',
  function ($rootScope, $log, $interpolate, $timeout, throttle) {

    /**
     * @usage: new AudioPlayer(element, scope, [playlist], [options]);
     *
     * @param {jqLite/jQuery element} element the DOM element the directive is attached to
     * @param {angular Scope} [scope] scope in which call $apply, it could even be $rootScope (untested!)
     * @param {Array} playlist an Array made of audioElements (refer to documentation)
     */
    var AudioPlayer = function (element, scope, playlist, options) {
      if (!(this instanceof AudioPlayer)) { return new AudioPlayer(element, scope, playlist, options); }

      options = options || {};
      playlist = playlist || [];

      angular.extend(this, {
        _element: element,
        _audioTag: element[0],
        _scope: scope,
        _playlist: playlist,

        // general properties
        name: options.name || 'audioplayer',
        playing: false,
        currentTrack: 0,
        tracks: playlist.length,

        // <audio> properties
        volume: element[0].volume,
        muted: element[0].muted,
        duration: element[0].duration,
        currentTime: element[0].currentTime,

        // TimeRanges structures
        buffered: element[0].buffered,
        played: element[0].played,
        seekable: element[0].seekable,

        // formatted properties
        formatDuration: '',
        formatTime: '',
        loadPercent: 0,

        // aliases
        position: element[0].currentTime
      });

      // bind listeners on <audio> events, will be broadcasted on specific `scope`
      // the function returs a de-registering function, that will be bound on _unbindListeners
      this._unbindListeners = this._bindListeners(scope);
    };

    AudioPlayer.prototype = {
      /**
       * @usage load([audioElement], [autoplayNext]);
       *
       * @param  {audioElement Obj} audioElement a single audioElement, may contain multiple <source>(s)
       * @param  {boolean} autoplayNext flag to autostart loaded element
       */
      load: function (audioElement, autoplayNext) {
        if (typeof audioElement === 'boolean') {
          autoplayNext = audioElement;
          audioElement = null;
        } else if (typeof audioElement === 'object') {
          this._clearAudioList();
          this._addAudioList(audioElement);
        }
        this._scope.$emit(this.name + ':load', autoplayNext);
        this._audioTag.load();
        if (autoplayNext) {
          var self = this;
          self._element.bind('canplaythrough', function (evt) {
            self.play();
            self._element.unbind('canplaythrough');
          });
        }
      },
      /**
       * @usage play([index])
       * @param  {integer} index playlist index (0...n), to start playing from
       */
      play: function (index) {
        if (this._playlist.length > index) {
          this.currentTrack = index + 1;
          return this.load(this._playlist[index], true);
        }
        // readyState = HAVE_NOTHING (0) means there's nothing into the <audio> tag
        if (!this.currentTrack && this._audioTag.readyState) { this.currentTrack++; }
        this._audioTag.play();
      },
      playPause: function (index) {
        if (typeof index === 'number' && index + 1 !== this.currentTrack) {
          this.play(index);
        } else if (this.playing) {
          this.pause();
        } else {
          this.play();
        }
      },
      pause: function () {
        this._audioTag.pause();
      },
      toggleMute: function () {
        this.muted = this._audioTag.muted = !this._audioTag.muted;
      },
      next: function (autoplay) {
        var self = this;
        if (self.currentTrack && self.currentTrack < self.tracks) {
          var wasPlaying = autoplay || self.playing;
          self.pause();
          $timeout(function () {
            self._clearAudioList();
            self._addAudioList(self._playlist[self.currentTrack]);
            self.load(wasPlaying); // setup autoplay here.
            self.currentTrack++;
          });
        }
      },
      prev: function (autoplay) {
        var self = this;
        if (self.currentTrack && self.currentTrack - 1) {
          var wasPlaying = autoplay || self.playing;
          self.pause();
          $timeout(function () {
            self._clearAudioList();
            self._addAudioList(self._playlist[self.currentTrack - 2]);
            self.load(wasPlaying); // setup autoplay here.
            self.currentTrack--;
          });
        }
      },
      _addAudioList: function (audioList) {
        var self = this;
        if (angular.isArray(audioList)) {
          angular.forEach(audioList, function (singleElement, index) {
            var sourceElem = angular.element($interpolate('<source src="{{ src }}" type="{{ type }}" media="{{ media }}">')(singleElement));
            self._element.append(sourceElem);
          });
        } else if (angular.isObject(audioList)) {
          var sourceElem = angular.element($interpolate('<source src="{{ src }}" type="{{ type }}" media="{{ media }}">')(audioList));
          self._element.append(sourceElem);
        }
      },
      _clearAudioList: function () {
        this._element.contents().remove();
      },
      _formatTime: function (seconds) {
        var hours = parseInt(seconds / 3600, 10) % 24,
            minutes = parseInt(seconds / 60, 10) % 60,
            secs = parseInt(seconds % 60, 10),
            result,
            fragment = (minutes < 10 ? '0' + minutes : minutes) + ':' + (secs  < 10 ? '0' + secs : secs);
        if (hours > 0) {
          result = (hours < 10 ? '0' + hours : hours) + ':' + fragment;
        } else {
          result = fragment;
        }
        return result;
      },
      _bindListeners: function (scope) {
        var self = this,
          element = this._element,
          updateTime = throttle(1000, false, function (evt) {
            scope.$apply(function () {
              self.currentTime = self.position = self._audioTag.currentTime;
              self.formatTime = self._formatTime(self.currentTime);
            });
          }),
          updatePlaying = function (isPlaying) {
            return function (evt) {
              scope.$apply(function () {
                self.playing = isPlaying;
              });
              if (isPlaying) {
                scope.$emit(self.name + ':play', self.currentTrack - 1);
              } else {
                scope.$emit(self.name + ':pause');
              }
            };
          },
          setDuration = function (evt) {
            scope.$apply(function () {
              if (!self.currentTrack) { self.currentTrack++; } // This is triggered *ONLY* the first time a <source> gets loaded.
              self.duration = self._audioTag.duration;
              self.formatDuration = self._formatTime(self.duration);
              self.loadPercent = parseInt((self._audioTag.buffered.end(self._audioTag.buffered.length - 1) / self.duration) * 100, 10);
            });
          },
          playNext = function (evt) {
            self.next(true);
          },
          updateProgress = function (evt) {
            if (self._audioTag.buffered.length) {
              scope.$apply(function () {
                self.loadPercent = parseInt((self._audioTag.buffered.end(self._audioTag.buffered.length - 1) / self.duration) * 100, 10);
              });
            }
          };

        element.bind('playing', updatePlaying(true));
        element.bind('pause', updatePlaying(false));
        element.bind('ended', playNext);
        element.bind('timeupdate', updateTime);
        element.bind('loadedmetadata', setDuration);
        element.bind('progress', updateProgress);

        return function () {
          element.unbind('playing');
          element.unbind('pause');
          element.unbind('ended');
          element.unbind('timeupdate');
          element.unbind('loadedmetadata');
          element.unbind('progress');
        };
      }
    };

    return {
      scope: {
        exposedPlayer: '=playerControl',
        playlist: '=playlist'
      },
      link: function (scope, element, attrs, ctrl) {
        if (element[0].tagName !== 'AUDIO') {
          return $log.error('audioPlayer directive works only when attached to an <audio> type tag');
        }
        var audioElement = [],
            sourceElements = element.find('source'),
            playlist = scope.playlist || [];

        // Create a single playlist element from <source> tag(s).
        angular.forEach(sourceElements, function (sourceElement, index) {
          audioElement.push({ src: sourceElement.src, type: sourceElement.type, media: sourceElement.media });
        });
        // Put audioElement as first element in the playlist
        if (audioElement.length) { playlist.unshift(audioElement); }

        scope.exposedPlayer = new AudioPlayer(element, scope, playlist);
        // You can listen for 'ready' event to know when DOM compilation is done
        scope.$emit(scope.exposedPlayer.name + ':ready', scope.exposedPlayer);

        function watchFn(playlistNew, playlistOld, watchScope) {
          var player = scope.exposedPlayer,
              currentTrack,
              newTrackNum = null;

          if (playlistNew === undefined) {
            if (playlistOld !== undefined) {
              player.pause();
              return $log.debug('playlist was deleted from scope, pausing and returning');
            } else {
              return $log.error('if you use playlist attribute, you need $scope.playlistVariable = []; in your code');
            }
          }

          /**
           * Playlist update logic:
           * If the player has started ->
           *   Check if the playing track is in the new Playlist [EXAMPLE BELOW]
           *   If it is ->
           *     Assign to it the new tracknumber
           *   Else ->
           *     Pause the player, and get the new Playlist
           *
           * Else (if the player hasn't started yet)
           *   Just replace the <src> tags inside the <audio>
           *
           * Example
           * playlist: [a,b,c], playing: c, trackNum: 2
           * ----delay 5 sec-----
           * playlist: [f,a,b,c], playing: c, trackNum: 3
           *
           */
          if (player.currentTrack) {
            currentTrack = playlistOld ? playlistOld[player.currentTrack - 1] : -1;
            for (var i = 0; i < playlistNew.length; i++) {
              if (angular.equals(playlistNew[i], currentTrack)) { newTrackNum = i; break; }
            }
            if (newTrackNum !== null) { // currentTrack it's still in the new playlist, update trackNumber
              player.currentTrack = newTrackNum + 1;
              player.tracks = playlistNew.length;
            } else { // currentTrack has been removed.
              player.pause();
              if (playlistNew.length) { // if the new playlist has some elements, replace actual.
                $timeout(function () { // need $timeout because the audioTag needs a little time to launch the 'pause' event
                  player._clearAudioList();
                  player._addAudioList(playlistNew[0]);
                  player.load();
                  player.tracks = playlistNew.length;
                });
              }
            }
          } else if (playlistNew.length) {
            player._clearAudioList();
            player._addAudioList(playlistNew[0]);
            player.load();
            player.tracks = playlistNew.length;
          }

        }

        scope.$watch('playlist', watchFn, true);

        scope.$on('$destroy', function () {
          scope.exposedPlayer._unbindListeners();
        });
      }
    };
  }]
);
