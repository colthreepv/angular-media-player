/* jshint -W030, -W043 */
describe('unit tests: scope creation', function () {
  beforeEach(module('mediaPlayer'));

  it('should create a scope inside the scope', inject(function ($compile, $rootScope) {
    var element = $compile('<audio media-player="testplayer"></audio>')($rootScope);
    expect($rootScope.testplayer).to.exist;
    expect($rootScope.testplayer).to.be.an('object');
  }));

  it('should create a scope if playlist attribute is declared', inject(function ($compile, $rootScope) {
    var element = $compile('<audio media-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
    expect($rootScope.testplaylist).to.exist;
    expect($rootScope.testplaylist).to.be.an('array');
    expect($rootScope.testplaylist).to.have.length(0);
  }));

  it('should create a local playlist even if the attribute is not declared', inject(function ($compile, $rootScope) {
    var element = $compile('<audio media-player="testplayer"></audio>')($rootScope);
    expect($rootScope.testplayer.$playlist).to.be.an('array');
    expect($rootScope.testplayer.$playlist).to.have.length(0);
  }));

});

describe('unit tests: interaction between scopes', function () {
  beforeEach(module('mediaPlayer'));

  it('should propagate rootScope changes to mediaPlayer', inject(function ($compile, $rootScope) {
    $rootScope.testplaylist = [];
    var element = $compile('<audio media-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
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
    var element = $compile('<audio media-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
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
    var element = $compile('<audio media-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
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
    var element = $compile('<audio media-player="testplayer" playlist="testplaylist"> \
      <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" media="audio/ogg"> \
      <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.mp3" media="audio/mpeg"> \
      </audio>')($rootScope);
    expect($rootScope.testplaylist).to.have.length(1);
    expect($rootScope.testplaylist[0]).to.have.length(2);
    expect($rootScope.testplaylist[0][0].src).to.equal('http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg');
    expect($rootScope.testplaylist[0][1].src).to.equal('http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.mp3');
  }));
  it('should read existing <source> tags, and put it in the playlist, with object notation', inject(function ($compile, $rootScope) {
    $rootScope.testplaylist = [];
    var element = $compile('<audio media-player="testplayer" playlist="testplaylist"> \
      <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" media="audio/ogg"> \
      </audio>')($rootScope);
    expect($rootScope.testplaylist).to.have.length(1);
    expect($rootScope.testplaylist[0].src).to.equal('http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg');
  }));

});
