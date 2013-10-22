angular-audio-player
====================
AngularJS Directive that wraps an ```<audio>``` tag exposing handy events and selectors to customize your audio player.

## Abstract / Idea
I've come across a lot of ```<audio>``` players on the web, many using Flash, many being easy-to-use, almost none of them being compatible with AngularJS.  
What i really was looking for was a simple audio wrapper **without** the need to support browser which don't have audio tag support!  
Means support for this project is the same as: [HTML5 audio draft][html5audiocompatibility], jQuery is not necessary, and DOM manipulation is done with 'modern' browsers in mind (IE9 not really being a top player here)  
[angular-audio-player][self] is html/css **agnostic**, meaning you can use it with your browser controls and default style, or bind the methods and properties in your own View

## Roadmap

  * better way to expose current time and buffered data (?!?)
  * song preload:
    * preload N songs before and after the current song.
    * multiple parallel preload connections
  * to achieve preload i need to use multiple `audio` tags
    * create only 2N `audio` tags
    * memorize/paginate `audio` properties even when the tag is removed from the DOM, so if it gets added back it haves the same progress. 

  * Documentation
    * ~~playPause(index) documentation~~
    * example4, displaying playlist with `ng-repeat` and using `playPause($index)` on it.

## Dude i imported the library, where i can see it work? 
### [Examples here][examples]  
This directive it's just a way to expose ```<audio>``` tag property and methods to an AngularJS application, so you have to use custom html **and** css in order to interface with the audio directive.  

## Simple How-To
In your AngularJS application include in dependency injection ```angular-audio-player```

```javascript
angular.module('myApp', ['angular-audio-player'])
```

Then in the html:

```html
<audio data-player-control="audio1" data-playlist="playlist1" audio-player>
  <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
</audio>
<span ng-show="audio1.playing">Player status: Playing</span>
<span ng-show="!audio1.playing">Player status: Paused</span>
```

## Directive Attributes

* **playlist**: An Array containing audioElements(s)
* **player-control**: Exposed properties and methods of the ```<audio>``` tag

## playlist structure

Playlist is an Array containing ```audioElement(s)```.  
An ```audioElement``` could be an Array of sourceObjects, or a single sourceObject.  

sourceObject mimics ```<source>``` HTML draft  

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

*For whoever wondering what ```media``` is*: it's just a [css media query][cssmediaquery], so the browser can pick which ```<source>``` tag to load.

## player-control methods and properties

### `player.play([index])`
`index` is an _optional_ parameter, referring to the playlist index (0...playlist.length-1)

### `player.playPause([index])`
`index` is an _optional_ parameter, referring to the playlist index (0...playlist.length-1)

### `player.pause()`

### `player.next([autoplay])`
Goes to next audioElement if there is one in the playlist, otherwise does **nothing**.  
Autoplay behaviour is the following:
If a song is _already_ playing, it will change to the next audioElement, and start playing ASAP.  
You can force the autoplay on/off using the `autoplay` Boolean parameter.

### `player.prev([autoplay])`
Goes to previous audioElement if there is one in the playlist, otherwise does **nothing**.  
Refer to `.next()` about `autoplay` parameter.

### `player.playing`
```true``` or ```false```

### `player.currentTrack`
Tracks the position of the playing track, it **might** change during playing the same track due to pushing elements into ```playlistArray```

### `player.tracks`
Number of tracks in the playlist

## Functionality

You can add/remove tracks on-fly from/to the playlist.  
If the current track gets removed, the player goes on **pause()**. (And starts loading the first track of the new playlist)

**TBD**

## Examples

```bash
$ git clone https://github.com/mrgamer/angular-audio-player.git
$ cd angular-audio-player
$ npm install
# -- WORK WORK HERE --
$ node webserver.js
```

Now open up [localhost:8080](http://localhost:8080/) and you will find the demo index page with other examples.

### Credits
A lot of guidelines to realize a simple re-usable project like this have come mainly from:

* [angular-leaflet-directive][leafletdir] work of [tombatossals][leafletauth], i think is a good example of a standalone project. (other than being useful :) )
* [angular-socket-io][socketbf] I think most of AngularJS developers know [Brian Ford][brianf], I'm out of count how many times i found his posts or works an enlightenment! 

[leafletdir]: https://github.com/tombatossals/angular-leaflet-directive
[leafletauth]: https://github.com/tombatossals
[socketbf]: https://github.com/btford/angular-socket-io
[brianf]: https://github.com/btford
[self]: http://github.com/mrgamer/angular-audio-player
[examples]: http://mrgamer.github.com/angular-audio-player/


[html5audiocompatibility]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#Browser_compatibility
[cssmediaquery]: http://www.w3.org/TR/2009/CR-css3-mediaqueries-20090915/#media0
