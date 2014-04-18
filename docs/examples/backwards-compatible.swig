{% extends '../layout' %}
{% import '../swig-macros.swig' as macro %}
{% block content %}
<div class="jumbotron">
  <h1>Backwards Compatible</h1>
  <p>
    playlist object gets created and populated with the tracks found in the <code>&lt;audio&gt;</code> tag.
  </p>
</div>
{% markdown %}
### Purpose
This is to give some sort of compatibility for audio tags already present in webpages where you can include this directive.
{% endmarkdown %}
<audio player-control="mediaPlayer" playlist="audioPlaylist" media-player>
  <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
</audio>
{{ macro.buttons('mediaPlayer') }}
<h4>Resulting <code>$scope.audioPlaylist</code> in the controller</h4>
<pre>
  <code>audioPlaylist = [[ audioPlaylist | json ]]</code>
</pre>

<h4>HTML of the audio tag</h4>
{% highlight 'html' %}
<audio data-player-control="mediaPlayer" data-playlist="audioPlaylist" media-player>
  <source src="http://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg" type="audio/ogg">
</audio>
{% endhighlight %}
{% endblock %}
