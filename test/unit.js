/* jshint -W030, -W043 */
describe('unit tests: scopes', function () {
  beforeEach(module('audioPlayer'));

  it('should create a scope inside the scope', inject(function ($compile, $rootScope) {
    var element = $compile('<audio audio-player="testplayer"></audio>')($rootScope);
    expect($rootScope.testplayer).to.exist;
    expect($rootScope.testplayer).to.be.an('object');
  }));

  it('should create a scope if playlist attribute is declared', inject(function ($compile, $rootScope) {
    var element = $compile('<audio audio-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
    expect($rootScope.testplaylist).to.exist;
    expect($rootScope.testplaylist).to.be.an('array');
    expect($rootScope.testplaylist).to.have.length(0);
  }));

  it('should create a local playlist even if the attribute is not declared', inject(function ($compile, $rootScope) {
    var element = $compile('<audio audio-player="testplayer"></audio>')($rootScope);
    expect($rootScope.testplayer.$playlist).to.be.an('array');
    expect($rootScope.testplayer.$playlist).to.have.length(0);
  }));

});

describe('unit tests: controller behaviour', function () {
  beforeEach(module('audioPlayer'));

  it('should propagate rootScope changes to audioPlayer', inject(function ($compile, $rootScope) {
    $rootScope.testplaylist = [];
    var element = $compile('<audio audio-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
    expect($rootScope.testplayer).to.be.an('object');
    expect($rootScope.testplaylist).to.be.an('array');
    $rootScope.testplaylist.push({
      src: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg',
      media: 'audio/ogg'
    });
    $rootScope.$digest();
    expect($rootScope.testplayer.$playlist).to.have.length(1);
    var sourceElement = element.find('source');
    expect(sourceElement).to.have.length(1);
  }));
  it('should handle playlist element modification', inject(function ($compile, $rootScope) {
    $rootScope.testplaylist = [{
      src: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg',
      media: 'audio/ogg'
    }];
    var element = $compile('<audio audio-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
    var sourceElement = element.find('source');
    expect(sourceElement).to.have.length(1);
    expect(sourceElement.attr('src')).to.equal($rootScope.testplaylist[0].src);
    // replace Rick Astley's song with something less cool
    $rootScope.testplaylist[0].src = 'http://upload.wikimedia.org/wikipedia/en/b/be/My_Name_Is.ogg';
    $rootScope.$digest();
    sourceElement = element.find('source');
    expect(sourceElement).to.have.length(1);
    expect(sourceElement.attr('src')).to.equal($rootScope.testplaylist[0].src);
  }));
  it('should remove <source> element if they get removed from playlist', inject(function ($compile, $rootScope) {
    $rootScope.testplaylist = [{
      src: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg',
      media: 'audio/ogg'
    }];
    var element = $compile('<audio audio-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
    var sourceElement = element.find('source');
    expect(sourceElement).to.have.length(1);
    expect(sourceElement.attr('src')).to.equal($rootScope.testplaylist[0].src);
    // remove the Never Gonna Give you up
    $rootScope.testplaylist.splice(0, 1);
    $rootScope.$digest();
    sourceElement = element.find('source');
    expect(sourceElement).to.have.length(0);
  }));
  it('should read existing <source> tags, and put it in the playlist, with array notation', inject(function ($compile, $rootScope) {
    $rootScope.testplaylist = [];
    var element = $compile('<audio audio-player="testplayer" playlist="testplaylist"> \
      <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" media="audio/ogg"> \
      <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.mp3" media="audio/mp3"> \
      </audio>')($rootScope);
    expect($rootScope.testplaylist).to.have.length(1);
    expect($rootScope.testplaylist[0]).to.have.length(2);
    expect($rootScope.testplaylist[0][0].src).to.equal('http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg');
    expect($rootScope.testplaylist[0][1].src).to.equal('http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.mp3');
  }));
  it('should read existing <source> tags, and put it in the playlist, with object notation', inject(function ($compile, $rootScope) {
    $rootScope.testplaylist = [];
    var element = $compile('<audio audio-player="testplayer" playlist="testplaylist"> \
      <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" media="audio/ogg"> \
      </audio>')($rootScope);
    expect($rootScope.testplaylist).to.have.length(1);
    expect($rootScope.testplaylist[0].src).to.equal('http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg');
  }));

});

describe('browser tests: functionality', function () {
  var audioIsReady = new Deferred();
  var silentAudio = document.createElement('audio');
  var silentSource = document.createElement('source');
  silentSource.src = 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg';
  silentSource.type = 'audio/ogg';
  silentAudio.addEventListener('canplaythrough', function () { audioIsReady.resolve(); });
  silentAudio.appendChild(silentSource);
  document.body.appendChild(silentAudio);

  before(function (callback) {
    audioIsReady.done(callback);
  });
  beforeEach(module('audioPlayer'));

  it('should load a single file when calling load()', function (done) {
    inject(function ($compile, $rootScope, $timeout) {
      var element = $compile('<audio audio-player="testplayer"></audio>')($rootScope);
      angular.element(document.body).append(element);
      expect($rootScope.testplayer).to.be.an('object');
      $rootScope.testplayer.load({ src: 'http://upload.wikimedia.org/wikipedia/commons/0/07/Silence.ogg', type: 'audio/ogg' });
      setTimeout(function () {
        expect($rootScope.testplayer.duration).to.be.above(1);
        done();
      }, 10);
    });
  });
  it('should start playing when calling play()', function (done) {
    setTimeout(done, 500);
  });
  it.skip('should stop playing when calling stop()', function () {});
  it.skip('should pause playing when calling pause()', function () {});
  it.skip('should start or stop playing when calling playPause()', function () {});
  it.skip('should support playing a specific index calling play(index)', function () {});
  it.skip('should autoplay the next file when calling next(), during playback', function () {});
  ['next, prev'].forEach(function (methodName) {
    [true, false].forEach(function (booleanValue) {
      it.skip('should force autoplay to ' + booleanValue + ' when calling ' + methodName + '(' + booleanValue + ')', function () {});
    });
  });
});
