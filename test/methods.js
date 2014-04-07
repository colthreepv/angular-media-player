/**
 * Those tests should pass with a browser that handles well all the
 * Media Events: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
 *
 * It relies *heavily* on those.
 * Moreover an active internet connection is needed, and better be a fast one, since it
 * preloads 40~ seconds of ogg files. (512Kb?)
 */
describe('browser tests: playback', function () {
  beforeEach(module('audioPlayer'));
  // remove tags after the test is done
  afterEach(function () {
    var audioTags = document.querySelectorAll('audio');
    Array.prototype.forEach.call(audioTags, function (audioTag) {
      audioTag.remove();
    });
  });

  it.skip('should rateChange correctly', function (done) {
    inject(function ($compile, $rootScope) {});
  });
});
