{% extends '../layout' %}
{% import '../player.macro' as macro %}
{% block javascript %}
  <script type="text/javascript">{% include './robust-playlist-2.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="SwapController">
{% endblock %}

{% block content %}
<div class="jumbotron">
  <h1>Robust Playlist #2</h1>
  <p>
    Editing the playing track while it's playing, simply makes it pause, and load the new track(s) on fly.
  </p>
</div>
{% markdown %}
### Interact
To test out this functionality, play the pre-loaded track, and then push the swap button.  
You can track changes in the playlist below.
{% endmarkdown %}
<audio media-player="mediaPlayer" playlist="audioPlaylist"></audio>
{{ macro.player('mediaPlayer') }}

<div class="player-control">
  <div class="btn btn-info" ng-click="swapSong()">
    <i class="fa fa-retweet"></i>
    <span>Swap Track</span>
  </div>
</div>

<h3>player status in realtime</h3>
{{ macro.playerDebug('mediaPlayer') }}

<p>Keep track of changes to <code>$scope.audioPlaylist</code> in realtime</p>
<pre><code>
  audioPlaylist: [[ audioPlaylist | json ]]
</code></pre>

<h1>Code</h1>
<small>...you can inspect aswell!</small>
{% highlight 'javascript' %}
{% include './robust-playlist-2.js' %}
{%endhighlight %}
{% endblock %}
