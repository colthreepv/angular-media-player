{% extends '../layout' %}
{% import '../player.macro' as macro %}
{% block content %}
<div class="jumbotron">
  <h1>Backwards Compatible</h1>
  <p>
    playlist object gets created and populated with the tracks found in the <code>&lt;audio&gt;</code> tag.
  </p>
</div>
<audio player-control="mediaPlayer" playlist="audioPlaylist" media-player>
  <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
</audio>
{{ macro.player('mediaPlayer') }}

<h3>Purpose</h3>
<p>This is to give some sort of compatibility for audio tags already present in webpages where you can include this directive.</p>

<p>HTML of the classic audio tag</p>
{% highlight 'html' %}
<audio>
  <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
</audio>
{% endhighlight %}

<br>
<p>Just by adding the <code>media-player</code> directive, it will read the source element(s) and instantiate a playlist containing it.</p>

<p>HTML with angular-media-player</p>
{% highlight 'html' %}
<audio player-control="mediaPlayer" playlist="audioPlaylist" media-player>
  <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
</audio>
{% endhighlight %}

<h4>Resulting <code>$scope.audioPlaylist</code> in the controller</h4>
<pre>
  <code>audioPlaylist = [[ audioPlaylist | json ]]</code>
</pre>
{% endblock %}
