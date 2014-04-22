angular.module('docs', ['mediaPlayer'])
.config(function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
})
.run(function ($rootScope) {
  // helper function to seek to a percentage
  $rootScope.seekPercentage = function ($event) {
    var percentage = ($event.offsetX / $event.target.offsetWidth);
    if (percentage <= 1) {
      return percentage;
    } else {
      return 0;
    }
  };
});
