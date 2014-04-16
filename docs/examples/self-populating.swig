{% extends '../layout' %}
{% block javascript %}
  <script type="text/javascript">{% include './self-populating.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="PopulateController">
{% endblock %}

{% block content %}
{% raw %}
<div class="jumbotron">
  <h1>Self-populating playlist</h1>
  <p>
    playlist object gets populated with the first audioElement found in the HTML.<br>
    <strong>WARNING</strong>: it's not a bi-directional binding.
  </p>
</div>
<div class="audio-control">
  <audio player-control="mediaPlayer" playlist="audioPlaylist" media-player>
    <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
  </audio>
  <div class="btn" ng-click="mediaPlayer.play()">
    <span>Simple Play</span>
    <i class="fa fa-play"></i>
  </div>
  <div class="btn" ng-click="mediaPlayer.playPause()">
    <i class="fa" ng-class="{ 'fa-pause': mediaPlayer.playing, 'fa-play': !mediaPlayer.playing }"></i>
  </div>
  <div class="btn" ng-click="mediaPlayer.next()">
    <span>Next</span>
    <i class="fa fa-step-forward"></i>
  </div>
  <div class="btn" ng-click="mediaPlayer.prev()">
    <i class="fa fa-step-backward"></i>
    <span>Prev</span>
  </div>
  <div class="btn btn-noclick">
    <span>currentTrack: <span class="badge">{{ mediaPlayer.currentTrack }}</span></span>
  </div>
</div>
<pre>
  <code>audioPlaylist = {{ audioPlaylist | json }}</code>
</pre>
{% endraw %}

<h3>Purpose</h3>
<p>This is to give some sort of compatibility for audio tags already present in webpages where you can include this directive.</p>

<h4>HTML of the audio tag</h4>
{% highlight 'html' %}
<audio data-player-control="mediaPlayer" data-playlist="audioPlaylist" media-player>
  <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
</audio>
{% endhighlight %}

<h4>Resulting <code>$scope.playlist</code></h4>
{% highlight 'javascript' %}
$scope.audioPlaylist = [
  [
    {
      "src":"http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg",
      "type":"audio/ogg",
      "media":""
    }
  ]
];
{% endhighlight %}
{% endblock %}
