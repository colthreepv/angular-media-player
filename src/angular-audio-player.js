angular.module('angular-audio-player', [])

.directive('audio-player', ['$rootScope', '$log',
  function ($rootScope, $log) {
    return {
      scope: {
        cssPrefix: '@cssPrefix',
        exposedPlayer: '=playerControl',
        playlist: '=playlist'
      },
      link: function (scope, element, attrs, ctrl) {
        
      }
    };
  }]
);
