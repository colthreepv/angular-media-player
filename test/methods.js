/**
 * Those tests should pass with a browser that handles well all the
 * Media Events: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
 *
 * It relies *heavily* on those.
 * Moreover an active internet connection is needed, and better be a fast one, since it
 * preloads 40~ seconds of ogg files. (512Kb?)
 */
describe('browser tests: methods', function () {
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
  // remove tags after the test is done
  afterEach(function () {
    var audioTags = document.querySelectorAll('audio');
    Array.prototype.forEach.call(audioTags, function (audioTag) {
      angular.element(audioTag).remove();
    });
  });

  it('should seek a track correctly', function (done) {
    inject(function ($compile, $rootScope) {
      var element = $compile('<audio media-player="testplayer"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.load({ src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' }, true);
      $rootScope.testplayer.one('playing', function () {
        setTimeout(function () {
          $rootScope.testplayer.seek('0:15');
          $rootScope.testplayer.one('playing', function () {
            // i'm checking directly the $domEl because audio-media-player currentTime uses a debounce function,
            // meaning that *will* be updated, but it's unreliable in a test.
            expect($rootScope.testplayer.$domEl.currentTime).to.be.above(14);
            done();
          });
        }, 10);
      });
    });
  });

  it('should rateChange correctly using setPlaybackRate', function (done) {
    inject(function ($compile, $rootScope) {
      var element = $compile('<audio media-player="testplayer"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.load({ src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' }, true);
      $rootScope.testplayer.one('playing', function () {
        setTimeout(function () {
          $rootScope.testplayer.setPlaybackRate(2.0);
          $rootScope.testplayer.one('ratechange', function () {
            setTimeout(function () {
              expect($rootScope.testplayer.playbackRate).to.be.equal(2.0);
              done();
            }, 10);
          });
        }, 10);
      });
    });
  });

  it('should check that throttling works', function (done) {
    module(function($provide) {
      $provide.value('mp.throttleSettings', {
        enabled: true,
        time: 1000
      });
    });
    inject(function ($compile, $rootScope) {
      var element = $compile('<audio media-player="testplayer"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.load({ src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' }, true);

      // wait for first timeupdate event
      $rootScope.testplayer.one('timeupdate', function () {
        // then wait 10msec (time for angular scope to $apply)
        setTimeout(function () {
          var firstTime = $rootScope.testplayer.currentTime;

          // then wait for the second timeupdate event
          $rootScope.testplayer.one('timeupdate', function () {
            // wait 10msec (time for angular scope to $apply)
            setTimeout(function () {
              // finally check that firstTime has not been updated, since:
              // timeupdates should be called WAY more often than once per second
              // but we have setup throttling to 1second, so firstTime and "secondTime"
              // should be equal!
              expect($rootScope.testplayer.currentTime).to.equal(firstTime);
              done();
            }, 10);
          });
        }, 10);
      });
    });
  });

  it('should be possible to disable throttling', function (done) {
    module(function($provide) {
      $provide.value('mp.throttleSettings', {
        enabled: false,
        time: 1000
      });
    });
    inject(function ($compile, $rootScope) {
      var element = $compile('<audio media-player="testplayer"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.load({ src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' }, true);

      // wait for first timeupdate event
      $rootScope.testplayer.one('timeupdate', function () {
        // then wait 10msec (time for angular scope to $apply)
        setTimeout(function () {
          var firstTime = $rootScope.testplayer.currentTime;

          // then wait for the second timeupdate event
          $rootScope.testplayer.one('timeupdate', function () {
            // wait 10msec (time for angular scope to $apply)
            setTimeout(function () {
              // finally check that firstTime has not been updated, since:
              // timeupdates should be called WAY more often than once per second
              // but we have setup throttling to 1second, so firstTime and "secondTime"
              // should be equal!
              expect($rootScope.testplayer.currentTime).to.be.not.equal(firstTime);
              done();
            }, 10);
          });
        }, 10);
      });
    });
  });

});
