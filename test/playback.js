/**
 * Those tests should pass with a browser that handles well all the
 * Media Events: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
 *
 * It relies *heavily* on those.
 * Moreover an active internet connection is needed, and better be a fast one, since it
 * preloads 40~ seconds of ogg files. (512Kb?)
 */
describe('browser tests: playback', function () {
  // 2 functions, useful to debug events
  function consolesomething(listener_name) {
    return function (evt) {
      console.log(listener_name, 'called');
    };
  }
  function debugMedia(element) {
    [
      'abort',
      'canplay',
      'canplaythrough',
      'durationchange',
      'emptied',
      'ended',
      'error',
      'loadeddata',
      'loadedmetadata',
      'loadstart',
      'mozaudioavailable',
      'pause',
      'play',
      'playing',
      'progress',
      'ratechange',
      'seeked',
      'seeking',
      'stalled',
      'suspend',
      'timeupdate',
      'volumechange',
      'waiting'
    ].forEach(function (listener_name) {
      element.addEventListener(listener_name, consolesomething(listener_name));
    });
  }
  // in case of need use debugMedia(DOMElement)

  beforeEach(module('mediaPlayer'));
  afterEach(function () {
    var audioTags = document.querySelectorAll('audio');
    Array.prototype.forEach.call(audioTags, function (audioTag) {
      angular.element(audioTag).remove();
    });
  });

  it('should load a single file when calling load()', function (done) {
    inject(function ($compile, $rootScope) {
      var element = $compile('<audio media-player="testplayer"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.load({ src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' });
      $rootScope.testplayer.one('durationchange', function () {
        setTimeout(function () {
          expect($rootScope.testplayer.duration).to.be.above(1);
          done();
        }, 10);
      });
    });
  });
  it('should start playing when calling play()', function (done) {
    inject(function ($compile, $rootScope) {
      var element = $compile('<audio media-player="testplayer"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.load({ src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' });
      $rootScope.testplayer.one('loadstart', function () {
        setTimeout(function () {
          $rootScope.testplayer.play();
        }, 10);
      });
      $rootScope.testplayer.one('playing', function () {
        setTimeout(function () {
          expect($rootScope.testplayer.duration).to.be.above(1);
          expect($rootScope.testplayer.playing).to.equal(true);
          done();
        }, 10);
      });
    });
  });
  it('should stop playing when calling stop()', function (done) {
    inject(function ($compile, $rootScope) {
      var element = $compile('<audio media-player="testplayer"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.load({ src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' }, true);
      $rootScope.testplayer.one('playing', function () {
        setTimeout(function () { $rootScope.testplayer.stop(); }, 10);
      });
      $rootScope.testplayer.one('abort', function () {
        setTimeout(function () {
          expect($rootScope.testplayer.playing).to.equal(false);
          done();
        }, 10);
      });
    });
  });
  it('should pause playing when calling pause()', function (done) {
    inject(function ($compile, $rootScope) {
      var element = $compile('<audio media-player="testplayer"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.load({ src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' }, true);
      $rootScope.testplayer.one('playing', function () {
        setTimeout(function () { $rootScope.testplayer.pause(); }, 10);
      });
      $rootScope.testplayer.one('pause', function () {
        setTimeout(function () {
          expect($rootScope.testplayer.playing).to.equal(false);
          done();
        }, 10);
      });
    });
  });
  it('should start or stop playing when calling playPause()', function (done) {
    inject(function ($compile, $rootScope) {
      var element = $compile('<audio media-player="testplayer"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.load({ src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' });

      // async tests are not easy to read:
      // 1) play after 10ms,
      // 2) waiting for a play event
      // 3) expect true, then stopping after 10ms
      // 3) expect false, after 50ms
      setTimeout(function () { $rootScope.testplayer.playPause(); }, 10);
      $rootScope.testplayer.$domEl.addEventListener('playing', function () {
        setTimeout(function () {
          expect($rootScope.testplayer.playing).to.equal(true);
          setTimeout(function () { $rootScope.testplayer.playPause(); }, 10);
          setTimeout(function () {
            expect($rootScope.testplayer.playing).to.equal(false);
            done();
          }, 50);
        }, 10);
      });
    });
  });
  it('should preload the first AudioElement put in the playlist', function (done) {
    inject(function ($compile, $rootScope) {
      $rootScope.testplaylist = [
        { src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' },
        { src: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Stairway_to_Heaven_3_sections.ogg', type: 'audio/ogg' },
        { src: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Beatles_cometogether.ogg', type: 'audio/ogg' }
      ];
      var element = $compile('<audio media-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      // currentTrack should gets updated after a loadedmetadata
      $rootScope.testplayer.one('loadedmetadata', function () {
        setTimeout(function () {
          expect($rootScope.testplayer.currentTrack).to.be.above(0);
          done();
        }, 10);
      });
    });
  });
  it('should support playing a specific index calling play(index)', function (done) {
    inject(function ($compile, $rootScope) {
      $rootScope.testplaylist = [
        { src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' },
        { src: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Stairway_to_Heaven_3_sections.ogg', type: 'audio/ogg' },
        { src: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Beatles_cometogether.ogg', type: 'audio/ogg' }
      ];
      var element = $compile('<audio media-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.one('canplaythrough', function () {
        setTimeout(function () {
          $rootScope.testplayer.play(1);
        }, 10);
      });
      $rootScope.testplayer.one('playing', function () {
        setTimeout(function () {
          expect($rootScope.testplayer.currentTrack).to.be.equal(2);
          done();
        }, 10);
      });
    });
  });
  it('should autoplay the next file when calling next(), during playback', function (done) {
    this.timeout(5000);
    inject(function ($compile, $rootScope, $timeout) {
      $rootScope.testplaylist = [
        { src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' },
        { src: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Stairway_to_Heaven_3_sections.ogg', type: 'audio/ogg' },
        { src: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Beatles_cometogether.ogg', type: 'audio/ogg' }
      ];
      var element = $compile('<audio media-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      var songsPlayed = 0;
      $rootScope.testplayer.one('canplaythrough', function () {
        setTimeout(function () { $rootScope.testplayer.play(); }, 10);
      });
      // should play 2 times, first song, then second song!
      $rootScope.testplayer.on('playing', function () {
        songsPlayed++;
        setTimeout(function () {
          if (songsPlayed === 1) {
            $rootScope.testplayer.next();
            $timeout.flush();
          } else if (songsPlayed === 2) {
            expect($rootScope.testplayer.playing).to.equal(true);
            expect($rootScope.testplayer.currentTrack).to.equal(2);
            done();
          }
        }, 10);
      });
    });
  });
  it('should not autoplay the next file when calling prev(false), during playback', function (done) {
    inject(function ($compile, $rootScope, $timeout) {
      $rootScope.testplaylist = [
        { src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' },
        { src: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Stairway_to_Heaven_3_sections.ogg', type: 'audio/ogg' },
        { src: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Beatles_cometogether.ogg', type: 'audio/ogg' }
      ];
      var element = $compile('<audio media-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      setTimeout(function () { $rootScope.testplayer.play(1); }, 100);
      // should play 2 times, first song, then second song!
      $rootScope.testplayer.one('playing', function () {
        setTimeout(function () {
          expect($rootScope.testplayer.currentTrack).to.be.equal(2);
          $rootScope.testplayer.prev(false);
          $timeout.flush();
          setTimeout(function () {
            expect($rootScope.testplayer.currentTrack).to.be.equal(1);
            done();
          }, 10);
        }, 10);
      });
    });
  });
});
