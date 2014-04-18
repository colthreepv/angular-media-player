{% extends '../layout' %}
{% block javascript %}
  <script type="text/javascript">{% include './progressive-playlist.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="ProgressiveController">
{% endblock %}

{% block content %}
<div class="jumbotron">
  <h1>Progressive Playlist</h1>
  <p>
    Simulates playlist population from time to time.
  </p>
</div>
{% markdown %}
# What happens
Every 5seconds a new ```mediaElement``` gets added into the playlist.  
Generally those gets added through events _(ex: user clicks and adds a track)_

You can notice the `currentTrack` property changing when a track gets added in front of the playlist.  
It goes from `currentTrack: 1` to `currentTrack: 2` without interrupting playback, thus making the information always consistent.
{% endmarkdown %}
{% raw %}
<audio media-player="mediaPlayer" playlist="audioPlaylist"></audio>
<div class="audio-control">
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
  <div class="btn btn-noclick">
    <span><i class="fa fa-clock-o"></i>: <span class="badge">{{ mediaPlayer.formatTime }}</span></span>
  </div>
  <div class="progress">
    <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" ng-style="{ width: mediaPlayer.currentTime*100/mediaPlayer.duration + '%' }"></div>
    <div class="time" ng-show="mediaPlayer.formatTime">
      <span>{{ mediaPlayer.formatTime }}</span><b>/</b><span>{{ mediaPlayer.formatDuration }}</span>
    </div>
  </div>
</div>

<pre><code>
  mediaPlayer.currentTrack: {{ mediaPlayer.currentTrack }}
  mediaPlayer.playing: {{ mediaPlayer.playing }}
</code></pre>
<p>playlist:</p>
<pre><code>
  audioPlaylist: {{ audioPlaylist | json }}
</code></pre>
{% endraw %}

<h1>Code</h1>
<small>...you can inspect aswell!</small>
{% highlight 'javascript' %}
{% include './progressive-playlist.js' %}
{%endhighlight %}
{% endblock %}
