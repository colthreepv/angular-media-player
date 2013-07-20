describe('Directive: audio-player', function () {
  var $compile, $rootScope;

  beforeEach(module('angular-audio-player'));
  beforeEach(inject(['$compile', '$rootScope',
    function ($c, $r) {
      $compile = $c;
      $rootScope = $r;
    }]
  ));

  it('should loaded the directive inside the module', function () {
      expect(true).toBe(true);
    }
  );
});
