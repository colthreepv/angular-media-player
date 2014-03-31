/*describe('unit tests: scopes', function () {
  beforeEach(module('audioPlayer'));

  it('should create a scope inside the scope', inject(function ($compile, $rootScope) {
    var element = $compile('<audio audio-player="testplayer"></audio>')($rootScope);
    element.scope().testplayer.should.be.an('object');
  }));

  it('should create a scope if playlist attribute is declared', inject(function ($compile, $rootScope) {
    var element = $compile('<audio audio-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
    element.scope().testplaylist.should.be.an('array');
    element.scope().testplaylist.should.have.length(0);
  }));

  it('should create a local playlist even if the attribute is not declared', inject(function ($compile, $rootScope) {
    var element = $compile('<audio audio-player="testplayer"></audio>')($rootScope);
    element.scope().testplayer.$playlist.should.be.an('array');
    element.scope().testplayer.$playlist.should.have.length(0);
  }));

});*/

describe('unit tests: controllers behaviour', function () {
  // beforeEach(function () {
  //   // calls the module
  //   module('unit-tests');
  //   // injects angular $compile service to render a directive
  //   inject(function (_$compile_, _$rootScope_) {
  //     $compile = _$compile_;
  //     $rootScope = _$rootScope_;
  //   });
  // });

  // DIFFERENT from beforeEach! Those tests are interdependent

  // before(inject(['$compile', '$rootScope', function (c, r) {
  //   rootScope = r;
  //   compile = c;
  // }]));

  it('should create a directive with empty audioplayer playlist', inject(function ($compile, $rootScope) {
    expect($rootScope.testplayer).to.not.exist;
    expect($rootScope.testplaylist).to.not.exist;
    var element = $compile('<audio audio-player="testplayer" playlist="testplaylist"></audio>')($rootScope);
    $rootScope.testplayer.should.be.an('object');
    $rootScope.testplaylist.should.be.an('array');
  }));

  it('should create a directive with empty audioplayer', inject(function ($compile, $rootScope) {
    // expect($rootScope.testplayer).to.exist;
    /*$rootScope.testplaylist.should.be.an('array');
    // be rickrolled!
    $rootScope.testplaylist.push({
      src: 'http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg',
      type: 'audio/ogg'
    });
    $rootScope.$digest();*/
  }));

  // it('should read the scope somewhat', function () {
  //   var element = $compile('<audio audio-player="player"></audio>')($rootScope);
  // });
});

describe('unit tests: properties', function () {
  it('should initialize audioPlayer scope with playing: false', function () {});
});

describe('unit tests: methods', function () {});
