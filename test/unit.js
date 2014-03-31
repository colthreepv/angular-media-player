/* jshint -W030 */
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

describe('unit tests: controllers behaviour', function () {
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

  it.skip('should remove <source> element if they get removed from playlist', inject(function ($compile, $rootScope) {
    $rootScope.testplaylist = [{
      src: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg',
      media: 'audio/ogg'
    }];
    var element = $compile('<audio audio-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
    var sourceElement = element.find('source');
    expect(sourceElement).to.be.a('array');
    expect(sourceElement).to.have.length(1);
    // remove the Never Gonna Give you up
    $rootScope.testplaylist.splice(0, 1);
    $rootScope.$digest();
    sourceElement = element.find('source');
    expect(sourceElement).to.have.length(0);
  }));

  it.skip('should read an already existing <source> tag, and put it in the playlist', inject());
  it.skip('should handle playlist element modification ??? NOT SURE', inject());

});

describe('unit tests: properties', function () {
  it('should initialize audioPlayer scope with playing: false', function () {});
});

describe('unit tests: methods', function () {});
