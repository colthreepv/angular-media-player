angular-media-player
====================
AngularJS Directive that wraps `<audio>` or `<video`> tag exposing handy events and selectors to customize your player.

## Abstract / Idea
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
<script src="//mrgamer.github.io/angular-media-player/dist/angular-media-player.js" type="text/javascript"></script>
<script src="//mrgamer.github.io/angular-media-player/dist/angular-media-player.min.js" type="text/javascript"></script>
```

## Breaking changes with `0.5.x`

  * `angular.module` changed **AGAIN** from `'audioPlayer'` to `'mediaPlayer'` as the library supports `<video>` tag aswell
  * property `'position'` removed. Use `currentTime` instead.

If you find something is missing from this list please take a couple of minutes to open an [Issue](https://github.com/mrgamer/angular-audio-player/issues/new)


## Getting Started
### [Examples here][examples]  
This directive it's just a way to expose _HTMLMediaElement_ properties and methods to an AngularJS application, so you have to use custom html **and** css in order to interface with the audio directive.  

## Basic Example
In your AngularJS application include in dependency injection `mediaPlayer`

```javascript
angular.module('myApp', ['mediaPlayer'])
```

Then in the html:
```html
<audio media-player="audio1" data-playlist="playlist1">
  <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
</audio>
<span ng-show="audio1.playing">Player status: Playing</span>
<span ng-show="!audio1.playing">Player status: Paused</span>
```

## Directive
`media-player` is a directive working as an _attribute_, it **must** be used either on an `<audio>`, or `<video>` tag.

### Attributes
Those can be used as any [AngularJS directive attributes notation](http://docs.angularjs.org/guide/directive#creating-custom-directives_matching-directives)

* **playlist**: A string, representing the name in the parent scope containing an Array containing audioElements(s)
* **player-control**: _deprecated_: A string, referring to the name created in the parent scope to access `media-player` properties.
* **media-player**: A string, referring to the name created in the parent scope to access `media-player` properties.

Those attributes have a one-way binding, the objects gets allocated in the parent scope.

### playlist structure

Playlist is an Array containing `sourceElement(s)`.  
An `sourceElement` itself could be an Array of sourceObjects, or a single sourceObject, mimicking the `<source>` [HTML draft][sourcedraft]  

> **sourceObject structure**:
```javascript
{ src: 'http://some.where.com', type: 'mime/type', media: '.css.media.query' }
```
> **or alternatively**
```javascript
[
  { src: 'http://some.where.com', type: 'audio/ogg' },
  { src: 'http://some.where.com/lowquality', type: 'audio/ogg' },
  { src: 'http://some.where.com/crapquality', type: 'audio/ogg' },
  { src: 'http://some.where.com', type: 'audio/mp3' },
]
```

*For whoever wondering what `media` is*: it's just a [css media query][cssmediaquery], so the browser can pick which `<source>` tag to load.

### player-control Methods

#### player.load([mediaElement, autoplayNext])
Parameter `mediaElement` type `object`, structure as specified above.  
Parameter `autoplayNext` type `boolean`  
Internal function called from the below methods, can still be accessed directly if want to, if no parameter is provided just calls the `<audio>` _load_ method (means it starts buffering).

#### player.play([index])
Parameter `index` type `number`, referring to the playlist index (0...playlist.length-1)  
You can force to play a specific song using the `index` param.

#### player.playPause([index])
Parameter `index` type `number`, referring to the playlist index (0...playlist.length-1)  
If you `playPause` the same index twice it will alternate start and stop.

#### player.pause()
Pauses the player.

#### player.next([autoplay])
Parameter `autoplay` type `boolean`  
Goes to next mediaElement if there is one in the playlist.  
Autoplay behaviour is the following:
If a song is _already_ playing, it will change to the next mediaElement, and autoplay as soon as it's loaded.  
You can force the autoplay using the `autoplay` parameter.

#### player.prev([autoplay])
Parameter `autoplay` type `boolean`  
Goes to previous mediaElement if there is one in the playlist.
If a song is _already_ playing, it will change to the previous mediaElement, and autoplay as soon as it's loaded.  
You can force the autoplay using the `autoplay` parameter.

#### player.toggleMute()
Toggles mute property.

### player-control Properties

#### player.name **REMOVED**
~~Default is `audioplayer`, it's the name-prefix used in the Events~~

#### player.playing
`true` or `false`

#### player.currentTrack
Tracks the position of the playing track, it **might** change during playing the same track due to pushing elements into `playlistArray`

#### player.tracks
Number of tracks in the playlist, zero-based (0....playlist.length)

#### `<audio>` properties forward
Some properties are just forwared to this `player-control` but are unchanged against [HTMLMediaElement spec][mediaelement]  
`player.volume`  
`player.muted`  
`player.duration`  
`player.currentTime`  
`player.position` _same_ as `player.currentTime`  
`player.buffered`  
`player.played`  
`player.seekable`  

#### formatted properties
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

If you wonder all the logic, just [check out the source](https://github.com/mrgamer/angular-audio-player/blob/master/src/directive.js#L280), it has comments!

### Credits
A lot of guidelines to realize a simple re-usable project like this have come mainly from:

* [angular-leaflet-directive][leafletdir] work of [tombatossals][leafletauth], i think is a good example of a standalone project. (other than being useful :) )
* [angular-socket-io][socketbf] I think most of AngularJS developers know [Brian Ford][brianf], I'm out of count how many times i found his posts or works an enlightenment! 
* [ng-media](https://github.com/caitp/ng-media) Trying to merge `mediaPlayer` lib and `ng-media` togheter, I've learned a lot. In the end, that didn't happen because those projects were born for _very_ different usages.

[leafletdir]: https://github.com/tombatossals/angular-leaflet-directive
[leafletauth]: https://github.com/tombatossals
[socketbf]: https://github.com/btford/angular-socket-io
[brianf]: https://github.com/btford
[self]: http://github.com/mrgamer/angular-audio-player
[examples]: http://aap.col3.me
[sourcedraft]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source
[mediaelement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement


[html5audiocompatibility]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#Browser_compatibility
[cssmediaquery]: http://www.w3.org/TR/2009/CR-css3-mediaqueries-20090915/#media0

### Contributing
Contributing is **always** welcome, both via opening Issues, or compiling a Pull Request.

# Important
While you're filing a _Pull Request_ be sure to edit files under the `src/` folder

You can clone the repository and start working:
```bash
git clone git@github.com:mrgamer/angular-audio-player.git
cd angular-audio-player
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
# !update package.json with a new version!
npm install
grunt build
git tag x.x.x
git push && git push --tags
```

# Release History

  * 0.5.0 - complete refactor, tests added, `<video>` tag support.
  * 0.2.2 - backport to fix incompatibility with IE9+
  * 0.2.x - site with examples and documentation expanded
  * 0.1.2 - first release, with basic functionalities
