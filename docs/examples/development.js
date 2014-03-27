angular.module('docs', ['audioPlayer'])
.controller('DevelopmentController', function ($scope, $log) {
  $scope.browser = navigator.userAgent;
});
