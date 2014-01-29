angular-audio-player [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/mrgamer/angular-audio-player/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
====================
AngularJS Directive that wraps an `<audio>` tag exposing handy events and selectors to customize your audio player.

## Abstract / Idea
I've come across a lot of `<audio>` players on the web, many using Flash, many being easy-to-use, almost none of them being compatible with AngularJS.  
What i really was looking for was a simple audio wrapper **without** the need to support browser which don't have audio tag support!  
Means support for this project is the same as: [HTML5 audio draft][html5audiocompatibility], jQuery is not necessary, and DOM manipulation is done with 'modern' browsers in mind (IE9 not really being a top player here)  
[angular-audio-player][self] is html/css **agnostic**, meaning you can use it with your browser controls and default style, or bind the methods and properties in your own View

## Breaking changes with `0.2.0`

  * `angular.module` changed from `'angular-audio-player'` to `'audioPlayer'` - seemed more ngCompliant to me
  * property `'playingTrack'` renamed to `'currentTrack'` - again, on first directive tapeout names weren't the most important thing

Bower package: `angular-audio-playlist`

## Possible Roadmap

  * better way to expose current time and buffered data #4
  * song preload:
    * preload N songs before and after the current song.
    * multiple parallel preload connections
  * to achieve preload i need to use multiple `audio` tags
    * create only 2N `audio` tags
    * memorize/paginate `audio` properties even when the tag is removed from the DOM, so if it gets added back it haves the same progress.

## Getting Started
### [Examples here][examples]  
This directive it's just a way to expose `<audio>` tag property and methods to an AngularJS application, so you have to use custom html **and** css in order to interface with the audio directive.  

## Simple How-To
In your AngularJS application include in dependency injection `audioPlayer`

```javascript
angular.module('myApp', ['audioPlayer'])
```

Then in the html:
```html
<audio data-player-control="audio1" data-playlist="playlist1" data-player-name="audio1" audio-player>
  <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
</audio>
<span ng-show="audio1.playing">Player status: Playing</span>
<span ng-show="!audio1.playing">Player status: Paused</span>
```

## Directive
`audio-player` is a directive working as an _attribute_, it **must** be used on an `<audio>` tag.

### Attributes
Those can be used as any [AngularJS directive attributes notation](http://docs.angularjs.org/guide/directive#creating-custom-directives_matching-directives)

* **playlist**: An Array containing audioElements(s)
* **player-control**: Exposed properties and methods of the `<audio>` tag

### playlist structure

Playlist is an Array containing `audioElement(s)`.  
An `audioElement` itself could be an Array of sourceObjects, or a single sourceObject, mimicking the `<source>` [HTML draft][sourcedraft]  

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

#### player.load([audioElement, autoplayNext])
Parameter `audioElement` type `object`, structure as specified above.  
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
Goes to next audioElement if there is one in the playlist.  
Autoplay behaviour is the following:
If a song is _already_ playing, it will change to the next audioElement, and autoplay as soon as it's loaded.  
You can force the autoplay using the `autoplay` parameter.

#### player.prev([autoplay])
Parameter `autoplay` type `boolean`  
Goes to previous audioElement if there is one in the playlist.
If a song is _already_ playing, it will change to the previous audioElement, and autoplay as soon as it's loaded.  
You can force the autoplay using the `autoplay` parameter.

#### player.toggleMute()
Toggles mute property.

### player-control Properties

#### player.name
Default is `audioplayer`, it's the name-prefix used in the Events

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

### $rootScope events
Some events gets dispatched to the `$rootScope`, they give some informations when handled with an event listener.

Example:
```javascript
angular.module('myApp',['audioPlayer'])
.controller('MyController', function ($scope, $rootScope) {
  $rootScope.$on('audioplayer:load', function (event, autoplayNext) {
    // Tell someone a song is gonna get loaded.
  });
})

The player-name attribute specifies the namespace for the events audio player emits.

```
`audioPlayerName` stands for player-name attribute, defaults to `audioplayer`

#### audioPlayerName:ready
Parameter `playerInstance` type `AudioPlayer`, returns the audioplayer that has just got compiled by the directive.

example:
```javascript
$scope.$on('audioplayer:ready', function (playerInstance) {});
```

example with multiple audio tags:
```javascript
var players = {};
var count = 0;

function doSomething() { console.log('players are ready, sir!'); }
function whenPlayersReady(name) {
  count++;
  return function (playerInstance) {
    players[name] = playerInstance;
    if (--count === 0) { doSomething(); };
  }
}

$scope.$on('audio1:ready', whenPlayersReady('audio1'));
$scope.$on('audio2:ready', whenPlayersReady('audio2'));
```

#### audioPlayerName:load
Parameter `autoplayNext` type `boolean`, returns true or false wheter the loading song is going to get played as soon as it's loaded.

example:
```javascript
$scope.$on('audioplayer:load', function (autoplayNext) {});
```

#### audioPlayerName:play
Parameter `index` type `number`, referring to the playlist index (0...playlist.length-1)  

example:
```javascript
$scope.$on('audioplayer:play', function (index) {});
```

#### audioPlayerName:pause
Emitted when the player stops.

example:
```javascript
$scope.$on('audioplayer:play', function (index) {});
```

### Special Behaviour
You can add/remove tracks on-fly from/to the playlist.  
If the current track gets removed, the player goes on **pause()**. (And starts loading the first track of the new playlist)  
Try and get the hold of this in the [examples][examples]

### Credits
A lot of guidelines to realize a simple re-usable project like this have come mainly from:

* [angular-leaflet-directive][leafletdir] work of [tombatossals][leafletauth], i think is a good example of a standalone project. (other than being useful :) )
* [angular-socket-io][socketbf] I think most of AngularJS developers know [Brian Ford][brianf], I'm out of count how many times i found his posts or works an enlightenment! 

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
As you can see from the Issues, i would like some help (especially experience in cross-browser compatibility)

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
