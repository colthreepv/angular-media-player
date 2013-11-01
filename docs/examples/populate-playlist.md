### Purpose
This is to give some sort of compatibility for `<audio>` tags already present in webpages where you can include this directive.

#### HTML of the ```<audio>``` tag
```html
<audio data-player-control="audio1" data-playlist="playlist1" audio-player>
  <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
</audio>
```

#### Resulting `$scope.playlist`
```javascript
$scope.playlist1 = [
  [
    {"src":"http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg","type":"audio/ogg","media":""}
  ]
];
```
