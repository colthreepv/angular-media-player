angular-audio-player
====================

AngularJS Directive that wraps an ```<audio>``` tag exposing handy events and selectors to customize your audio player.


## Abstract / Idea
I've come across a lot of ```<audio>``` players on the web, many using Flash, many being easy-to-use, almost none of them being compatible with AngularJS.  
What i really was looking for was a simple audio wrapper **without** the need to support browser which don't have audio tag support!  
Means support for this project is the same as: [HTML5 audio draft][html5audiocompatibility], jQuery is not necessary, and DOM manipulation is done with 'modern' browsers in mind (IE9 not really being a top player here)  
[angular-audio-player][self] is html/css **agnostic**, meaning you can use it with your browser controls and default style, or bind the methods and properties in your own View

## Dude i imported the library, now what? 
Well read below some basic how to :p   
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

*For whoever wondering what ```media``` is*: it's just a [css media query][cssmediaquery], so the browser can pick which ```<source>``` tag to load.

## player-control methods and properties

## Functionality


### Credits
A lot of guidelines to realize a simple re-usable project like this have come mainly from:

* [angular-leaflet-directive][leafletdir] work of [tombatossals][leafletauth], i think is a good example of a standalone project. (other than being useful :) )
* [angular-socket-io][socketbf] I think most of AngularJS developers know [Brian Ford][brianf], I'm out of count how many times i found his posts or works an enlightenment! 

[leafletdir]: https://github.com/tombatossals/angular-leaflet-directive
[leafletauth]: https://github.com/tombatossals
[socketbf]: https://github.com/btford/angular-socket-io
[brianf]: https://github.com/btford
[self]: http://github.com/mrgamer/angular-audio-player

[html5audiocompatibility]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#Browser_compatibility
[cssmediaquery]: http://www.w3.org/TR/2009/CR-css3-mediaqueries-20090915/#media0
