/**
 * Those tests should pass with a browser that handles well all the
 * Media Events: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
 *
 * It relies *heavily* on those.
 * Moreover an active internet connection is needed, and better be a fast one, since it
 * preloads 40~ seconds of ogg files. (512Kb?)
 */
describe('browser tests: playback', function () {
  function preloadAudio(url, duration) {
    var audioIsReady = new RSVP.defer();
    var newAudio = document.createElement('audio');
    newAudio.preload = 'auto';
    var newSource = document.createElement('source');
    newSource.src = url;
    newSource.type = 'audio/ogg';
    newAudio.addEventListener('timeupdate', function () {
      if (newAudio.buffered.end(0) > duration) { audioIsReady.resolve(); }
    });
    newAudio.appendChild(newSource);
    document.body.appendChild(newAudio);

    return audioIsReady.promise;
  }

  // create a lot of audio tags to preload the source files
  before(function (callback) {
    var promisesArray = [];
    [
      { src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', duration: 17 },
      { src: 'http://upload.wikimedia.org/wikipedia/en/c/cb/Stairway_to_Heaven_3_sections.ogg', duration: 30 },
      { src: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Beatles_cometogether.ogg', duration: 24 }
    ].forEach(function (audioFile) {
      promisesArray.push(preloadAudio(audioFile.src, audioFile.duration));
    });
    RSVP.all(promisesArray).then(callback.bind(null, null));
  });
  // remove audio tags after the test is done
  after(function () {
    var audioTags = document.querySelectorAll('body > audio');
    Array.prototype.forEach.call(audioTags, function (audioTag) {
      audioTag.remove();
    });
  });
  beforeEach(module('audioPlayer'));

  it.skip('should rateChange correctly', function (done) {
    inject(function ($compile, $rootScope) {});
  });
});
