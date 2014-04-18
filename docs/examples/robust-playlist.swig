{% extends '../layout' %}
{% import '../swig-macros.swig' as macro %}
{% block javascript %}
  <script type="text/javascript">{% include './robust-playlist.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="ProgressiveController">
{% endblock %}

{% block content %}
<div class="jumbotron">
  <h1>Robust Playlist</h1>
  <p>
    Simulates playlist population from time to time.
  </p>
</div>
{% markdown %}
### What happens
Every 5seconds a new ```mediaElement``` gets added into the playlist.  
Generally those gets added through events _(ex: user clicks and adds a track)_

You can notice the `currentTrack` property changing when a track gets added in front of the playlist.  
It goes from `currentTrack: 1` to `currentTrack: 2` without interrupting playback, thus making the information always consistent.
{% endmarkdown %}
<audio media-player="mediaPlayer" playlist="audioPlaylist"></audio>
{{ macro.buttons('mediaPlayer') }}

<pre><code>
  mediaPlayer.currentTrack: [[ mediaPlayer.currentTrack ]]
  mediaPlayer.playing: [[ mediaPlayer.playing ]]
</code></pre>

<p>Keep track of changes to <code>$scope.audioPlaylist</code> in realtime</p>
<pre><code>
  audioPlaylist: [[ audioPlaylist | json ]]
</code></pre>

<h1>Code</h1>
<small>...you can inspect aswell!</small>
{% highlight 'javascript' %}
{% include './robust-playlist.js' %}
{%endhighlight %}
{% endblock %}
