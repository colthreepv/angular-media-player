// https://gist.github.com/relay/3672350
/* Copyright (c) 2012 relay.github.com http://opensource.org/licenses/MIT
*
* Deferred is an implementation of the Promise pattern, which allows
* for asynchronous events to be handled in a unified way across an
* application. Deferred's are like callbacks on steroids.
*
* Rather than passing around callback functions, Deferred objects
* are passed around. Deferreds contain a queue of callback functions
* and manage the state of the asychronous event.
*
* When calling an asynchronous function, all functions should return a
* Deferred object. The caller function, having received the Deferred
* and having done whatever it wants to do, should also return that
* same Deferred when it exits, so that other parties have a chance to
* interact with it.
*
* The Deferred object represents the completed state of a future event.
* Interested parties can add a callback function to the Deferred that
* will be called when the Deferred event is deemed complete.
*
* When an asynchronous event is deemed completed, all the callbacks that
* were added to the Deferred will be called in serial order. The return
* value of each callback is passed as a parameter to the next callback.
* i.e., callback3(callback2(callback1( trigger(o) )))
*
* After the event is deemed completed and all the callbacks are called,
* further callbacks which are added to the Deferred at a later stage
* will be executed immediately.
*/

function Deferred() {
  this.callbacks = []
};

Deferred.prototype = {
  err: 0,
  x: 0,

  $: function(arr) {
    this.callbacks.push(arr);
    this.x == 2 && this._(this.o);
    return this
  },

  done: function(cb) {
    return this.$([cb, 0])
  },

  fail: function(cb) {
    return this.$([0, cb])
  },

  always: function(cb) {
    return this.$([0, 0, cb])
  },

  then: function(cb, err) {
    return this.$([cb, err])
  },

  reject: function(obj) {
    this.x || (this.err = 1, this._(obj));
    return this
  },

  resolve: function(obj) {
    this.x || this._(obj);
    return this
  },

  _: function(obj) {
    this.x = 1;
    for(var state = this.err, cb = this.callbacks, method = cb.shift(), value = obj; method; ) {
      try {
        while(method) {
          (method = method[2] || (state ? method[1] : method[0])) && (value = method(value || obj));

          if(value instanceof Deferred) {
            var that = this;
            value.always(function(v) {that._(v || obj); return v});
            return
          }
          method = cb.shift()
        }
      } catch(e) {
        state && (method = cb.shift()), this.err = state = 1
      }
    }
    this.o = value || obj;
    this.x = 2
  }
};

Deferred.when = function(m, args) {
  if(!args) return m;

  args = [].slice.call(arguments);
  m = new Deferred;

  var i = args.length,
    n = i,
    res = [],
    done = function(j) {return function(v) {res[j] = v; --n || m.resolve(res)}},
    fail = function(v) {m.reject(v)};

  while(i--) args[i].then(done(i), fail);
  return m
};
