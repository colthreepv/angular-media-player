angular-media-player [![Build Status](https://travis-ci.org/colthreepv/angular-media-player.svg?branch=master)](https://travis-ci.org/colthreepv/angular-media-player)
====================
AngularJS Directive that wraps `<audio>` or `<video`> tag exposing methods and properties to manipulate your player  

examples on github pages: http://colthreepv.github.io/angular-media-player/

## DEPRECATED: development stalled
This library has reached way more users than expected when I first developed it;  
I am very happy of that, but this means it has higher contribution and testing requirements that I was expecting!  

From what I could see there's another valid (and quite customizable) project in the angular world: [videogular](https://github.com/2fdevs/videogular)  
I don't think it covers **ALL** the use cases but that is not the point, most of them are covered, and documentation is extensive.  
There's an example of using it as [audio player with playlist](http://www.videogular.com/examples/creating-an-audio-player/), and the project is definitely future-proof.

## Project Idea
I've come across a lot of `<audio>` players on the web, many using Flash, many being easy-to-use, almost none of them being compatible with AngularJS.  
What i really was looking for was a simple audio wrapper **without** the need to support browser which don't have audio tag support!  
Means support for this project is the same as: [HTML5 audio draft][html5audiocompatibility], jQuery is not necessary, and DOM manipulation is done only with jqLite (IE9+)  
[angular-media-player][self] is html/css **agnostic**, meaning you can use it with your browser controls and default style, or bind the methods and properties in your own View

## How-to use it in your project
Using [bower](http://bower.io):
```bash
$ bower install angular-media-player
```

Using github hosting:
```html
<!-- non-minified for debugging -->
<script src="//colthreepv.github.io/angular-media-player/dist/angular-media-player.js" type="text/javascript"></script>
<!-- minified -->
<script src="//colthreepv.github.io/angular-media-player/dist/angular-media-player.min.js" type="text/javascript"></script>
```

## Test coverage
At the moment IE passes only 8 tests of 20, most of them require an `<audio>` tag to work with `.ogg` files.
![test-coverage](http://i.imgur.com/mkFdC4q.gif)

IE supports **only** `.mp3` files, works as expected if you use them.

## Breaking changes with `0.5.x`

  * `angular.module` changed **AGAIN** from `'audioPlayer'` to `'mediaPlayer'` as the library supports `<video>` tag aswell
  * property `'position'` removed. Use `currentTime` instead.

If you find something is missing from this list please take a couple of minutes to open an [Issue][issues]

### What's new

  * I've already written it but... `<video>` tag support!
  * new property `network`
  * playback rate support
  * seeking
  * test-driven: both unit tests and asynchronous tests with real audio/video files (requires internet working)
  * playlist handling is way more robust, and tested.
  * `mediaPlayer` is not created as an isolated scope, instead it **pollutes** the father scope. Watch out for name collisions.
  * Events are no more sent to `$rootScope`, they are handled by the namespaced `mediaPlayer`, that is now an [angular.js Scope][angularscopes]
  * Minimalist and flexible [event system](#events), based off browser implementation.

The new documentation is on-going work, you can keep track of it being developed, but is not ready to be deployed yet.  
And this time will be on `gh-pages`!

More tests are coming.

## Getting Started
### [Examples here][examples]  
This directive it's just a way to expose _HTMLMediaElement_ properties and methods to an AngularJS application, so you have to use custom html **and** css in order to interface with the audio directive.  

## Basic Example
In your AngularJS application include in dependency injection `mediaPlayer`

```javascript
angular.module('myApp', ['mediaPlayer'])
.controller('MyController', function ($scope) .......)
```

Then in the html:
```html
<div ng-controller="MyController">
  <audio media-player="audio1" data-playlist="playlist1">
    <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
  </audio>
  <span ng-show="audio1.playing">Player status: Playing</span>
  <span ng-show="!audio1.playing">Player status: Paused</span>
</div>
```

What happens here: a variable called `audio1` gets created on the scope bound to the controller that holds the `<audio>` tag.
That might be one of your specific controller, or, if you didn't define anyone, it will be `$rootScope`.

You can access those methods like this:
```javascript
angular.module('myApp').controller('MyController', function ($scope) {

  // access properties
  console.log($scope.audio1.network);
  console.log($scope.audio1.ended);

  $scope.mySpecialPlayButton = function () {
    $scope.customText = 'I started angular-media-player with a custom defined action!';
    $scope.audio1.playPause();
  };
})
```
You can use the methods in the controller AND directly in the HTML (as shown in the snippet before), since they are exposed in the $scope.

## Directive
`media-player` is a directive working as an _attribute_, it **must** be used either on an `<audio>`, or `<video>` tag.

### Attributes
Those can be used as any [AngularJS directive attributes notation][angularattributes]

* **playlist**: A string, representing the name in the parent scope containing an Array containing audioElements(s)
* **player-control**: _deprecated_: A string, referring to the name created in the parent scope to access `media-player` properties.
* **media-player**: A string, referring to the name created in the parent scope to access `media-player` properties.

Those attributes have a one-way binding, the objects gets allocated in the parent scope.

### playlist structure

Playlist is an Array containing `sourceElement(s)`.  
An `sourceElement` itself could be an Array of sourceObjects, or a single sourceObject, mimicking the `<source>` [HTML draft][sourcedraft]  

**sourceObject structure**:
```javascript
{ src: 'http://some.where.com', type: 'mime/type', media: '.css.media.query' }
```
**or alternatively**
```javascript
[
  { src: 'http://some.where.com', type: 'audio/ogg' },
  { src: 'http://some.where.com/lowquality', type: 'audio/ogg' },
  { src: 'http://some.where.com/crapquality', type: 'audio/ogg' },
  { src: 'http://some.where.com', type: 'audio/mpeg' },
]
```

_For whoever wondering what `media` is_: it's just a [css media query][cssmediaquery], so the browser can pick which `<source>` tag to load.  
It's recent news that `media` it's (probably) getting [deprecated anyway](https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/5sWUMC_d8Tg/ZZ0Z7rfeCqUJ)

### Exposed Methods

##### player.load([mediaElement, autoplay])
Parameter `mediaElement` type `object`, structure as specified above.  
Parameter `autoplay` type `boolean`  
Internal function called from the below methods, can still be accessed directly if want to, if no parameter is provided just calls the `<audio>` _load_ method (means it starts buffering).

##### player.play([index], [selectivePlay])
> **NOTE**: this is _0-based_ exactly as you refer to the elements of an Array.

Parameter `index` type `number`, referring to the playlist index (0...playlist.length-1)  
You can force to play a specific song using the `index` param.

Parameter `selectivePlay` type `boolean`, when this is `true` will be only played the specified track

##### player.playPause([index], [selectivePlay])
> **NOTE**: this is _0-based_ exactly as you refer to the elements of an Array.

Parameter `index` type `number`, referring to the playlist index (0...playlist.length-1)  
If you `playPause` the same index twice it will alternate start and stop.

Parameter `selectivePlay` type `boolean`, when this is `true` will be only played the specified track

##### player.pause()
Pauses the player.

##### player.next([autoplay])
Parameter `autoplay` type `boolean`  
Goes to next mediaElement if there is one in the playlist.  
Autoplay behaviour is the following:
If a song is _already_ playing, it will change to the next mediaElement, and autoplay itas soon as it's loaded.  
You can force the autoplay using the `autoplay` parameter.

##### player.prev([autoplay])
Parameter `autoplay` type `boolean`  
Goes to previous mediaElement if there is one in the playlist.
If a song is _already_ playing, it will change to the previous mediaElement, and autoplay it as soon as it's loaded.  
You can force the autoplay using the `autoplay` parameter.

##### player.toggleMute()
Toggles mute property.

##### player.setVolume(value)
Parameter `value` type `number`  
This method is a _setter_ for the `volume` property.  
`value` is between `0.0` and `1.0`, [refer to MDN][mediaelement].

##### player.setPlaybackRate(value)
Parameter `value` type `number`  
This method is a _setter_ for the `playbackRate` property.  
`value` is between `0.0` and `1.0`, [refer to MDN][mediaelement].

##### player.seek(value)
Parameter `value` can be type `number` or `string`  
This method _sets_ `currentTime` on the element.  
`value` can be between `0.0` and `max duration`, or it can be expressed in `HH:mm:ss` string format.

### Exposed Properties

##### ~~player.name~~ **REMOVED**
~~Default is `audioplayer`, it's the name-prefix used in the Events~~

##### player.playing
`true` or `false`

##### player.ended
`true` or `false`

##### player.network
`'progress'`, `'stalled'`, `'suspend'`, `undefined` (at initialization).  
This property is a sum-up of the network state, the value changes when the respective events gets fired.

##### player.currentTrack
> **NOTE**: this is _1-based_ exactly as `length` property of an Array.

Tracks the position of the playing track, it **might** change during playing the same track due to pushing elements into `playlistArray`

##### player.tracks
> **NOTE**: this is _0-based_ exactly as you refer to the elements of an Array.

Number of tracks in the playlist.

#### Properties from HTMLMediaElement
Some properties are just forwarded to the scope, but are unchanged [HTMLMediaElement spec][mediaelement]  

`player.currentTime`  
`player.duration`  
`player.muted`  
`player.playbackRate`  
`player.volume`  

Timeranges:  
`player.buffered`  
`player.played`  
`player.seekable`  

##### Note about currentTime updating system

Version `0.5.8` has a configurable throttle options.  
The default is that `timeupdate` event gets throttled to trigger not more than once per second (so currentTime aswell, since it reflects `timeupdate` value).  

Default value, already inside the library, if you want to change it, copy/paste and change values for your (__ENTIRE__) application:
```javascript
angular.module('yourModule')
.value('mp.throttleSettings', {
  enabled: true,
  time: 1000
});
```

It can be disabled or enabled with a configurable timeout.  

#### Additional Properties
The following properties refer to some [HTMLMediaElement spec][mediaelement] properties, but are formatted for handiness.  
`player.formatDuration`  hh:mm:ss version of `player.duration`  
`player.formatTime` hh:mm:ss version of `player.duration`  
`player.loadPercent` 0-100 version of `player.buffered`, it's just a number, not a TimeRange element.  

### Events
In case of need you can bind directly to the events generated by the browser.

This is done via wrappers, they just call angular.js jqLite methods:

  * [`on (type, fn)`](http://api.jquery.com/on/) - binds a function to an event
  * [`off (type, fn)`](http://api.jquery.com/off/) - removes a function from an event
  * [`one (type, fn)`](http://api.jquery.com/one/) - binds a function to an event, once

**WARNING**: the events are not sent to the `$rootScope` anymore. Player namespacing is no more nocessary, thus removed.

Example:
```javascript
angular.module('myApp',['mediaPlayer'])
.controller('MyController', function ($scope) {
  $scope.playerName.on('load', function (evt) {
    // Tell someone a song is gonna get loaded.
  });
})
```

### Playlist Behaviour
You can add/remove tracks on-fly from/to the playlist.  
If the current track gets removed, the player goes on **pause()**. (And starts loading the first track of the new playlist)  
Try and get the hold of this in the [examples][examples]

If you wonder all the logic, just [check out the source](https://github.com/colthreepv/angular-media-player/blob/master/src/directive.js#L280), it has comments!

### Credits
A lot of guidelines to realize a simple re-usable project like this have come mainly from:

* [angular-leaflet-directive][leafletdir]: work of [tombatossals][leafletauth], i think is a good example of a standalone project. (other than being useful :) )
* [angular-socket-io][socketbf]: I think most of AngularJS developers know [Brian Ford][brianf], I'm out of count how many times i found his posts or works an enlightenment! 
* [ng-media][ngmedia]: thanks to [caitp][caitp], I've been trying to merge `mediaPlayer` lib and `ng-media` togheter, I've learned a lot. In the end, that didn't happen because those projects were born for _very_ different usages.

[leafletdir]: https://github.com/tombatossals/angular-leaflet-directive
[leafletauth]: https://github.com/tombatossals
[socketbf]: https://github.com/btford/angular-socket-io
[brianf]: https://github.com/btford
[ngmedia]: https://github.com/caitp/ng-media
[caitp]: https://github.com/caitp
[self]: http://github.com/colthreepv/angular-media-player
[issues]: https://github.com/colthreepv/angular-media-player/issues/new
[angularscopes]: http://docs.angularjs.org/guide/scope
[angularattributes]: http://docs.angularjs.org/guide/directive#matching-directives
[examples]: http://aap.col3.me
[sourcedraft]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
[mediaelement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement



[html5audiocompatibility]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#Browser_compatibility
[cssmediaquery]: http://www.w3.org/TR/2009/CR-css3-mediaqueries-20090915/#media0

# Contributing
Contributing is **always** welcome, both via opening Issues, or compiling a Pull Request.

You can clone the repository and start working:
```bash
git clone git@github.com:colthreepv/angular-media-player.git
cd angular-media-player
?!?!?
profit!
```

To test the documentation system you need to:
```bash
npm install
# if you don't have bower installed globally
# sudo npm install bower -g
bower install
# if you don't have grunt installed globally
# sudo npm install grunt-cli -g
grunt docs
# keep grunt executing and open a browser on http://localhost:8181/
```

To create a new release:
```bash
npm install
# test before commit
bower install
npm test
grunt build
git commit -m "release X.Y.Z"
git tag X.Y.Z
git push && git push --tags
```

# Release History

  * 0.5.8 - implemented a config system for throttling the `timeupdate` events, this functionality is on debate in the issues: [#50](https://github.com/colthreepv/angular-media-player/issues/50)
  * 0.5.6 - fixed several bugs reported by the community (thanks contributors!!!): [#44](https://github.com/colthreepv/angular-media-player/issues/44), [#29](https://github.com/colthreepv/angular-media-player/issues/29), [#27](https://github.com/colthreepv/angular-media-player/issues/27)
  * 0.5.3 - test coverage run on IE aswell (8/20), just not the playback ones (because tests are written to use .ogg files). bugfix from 0.5.2
  * 0.5.2 - fixed bug regarding how i used `angular.forEach`, sorry. (closes [#26](https://github.com/colthreepv/angular-media-player/issues/26))
  * 0.5.1
    * added [selective play](#playerplayindex-selectiveplay) functionality on `play` and `playPause`
    * [seek](#playerseekvalue) now works correctly and is tested
    * 2 more tests
  * 0.5.0 - complete refactor, tests added, `<video>` tag support.
  * 0.2.2 - backport from the `next` branch to support IE9-10
  * 0.2.0 :
    * `angular.module` changed from `'angular-audio-player'` to `'audioPlayer'` - seemed more ngCompliant to me
    * property `'playingTrack'` renamed to `'currentTrack'` - again, on first directive tapeout names weren't the most important thing
  * 0.1.2 - first release, with basic functionalities
