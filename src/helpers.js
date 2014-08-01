angular.module('mediaPlayer.helpers', [])
.factory('mp.throttle', ['$timeout', function ($timeout) {
  return function (delay, no_trailing, callback, debounce_mode) {
    var timeout_id,
    last_exec = 0;

    if (typeof no_trailing !== 'boolean') {
      debounce_mode = callback;
      callback = no_trailing;
      no_trailing = undefined;
    }

    var wrapper = function () {
      var that = this,
          elapsed = +new Date() - last_exec,
          args = arguments,
          exec = function () {
            last_exec = +new Date();
            callback.apply(that, args);
          },
          clear = function () {
            timeout_id = undefined;
          };

      if (debounce_mode && !timeout_id) { exec(); }
      if (timeout_id) { $timeout.cancel(timeout_id); }
      if (debounce_mode === undefined && elapsed > delay) {
        exec();
      } else if (no_trailing !== true) {
        timeout_id = $timeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - elapsed : delay);
      }
    };

    return wrapper;
  };
}]);
