/**
 * Those tests should pass with a browser that handles well all the
 * Media Events: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
 *
 * It relies *heavily* on those.
 * Moreover an active internet connection is needed, and better be a fast one, since it
 * preloads 40~ seconds of ogg files. (512Kb?)
 */
describe('browser tests: video support', function () {
  beforeEach(module('mediaPlayer'));
  afterEach(function () {
    var videoTags = document.querySelectorAll('video');
    Array.prototype.forEach.call(videoTags, function (videoTag) {
      angular.element(videoTag).remove();
    });
  });

  it('should playback as supposed', function (done) {
    this.timeout(10000);
    inject(function ($compile, $rootScope) {
      var element = $compile('<video media-player="testplayer" autoplay="true"></video>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.load({ src: 'http://video.webmfiles.org/big-buck-bunny_trailer.webm', type: 'video/webm' }, true);
      $rootScope.testplayer.one('playing', function () {
        setTimeout(function () {
          expect($rootScope.testplayer.duration).to.be.above(1);
          expect($rootScope.testplayer.playing).to.equal(true);
          done();
        }, 10);
      });
    });
  });
});
