{% extends '../layout' %}
{% import '../player.macro' as macro %}
{% block javascript %}
  <script type="text/javascript">{% include './ng-repeat.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="RepeatController">
{% endblock %}

{% block content %}
<div class="jumbotron">
  <h1>ng-repeat on a playlist</h1>
  <p>
    Iterating over the playlist object shouldn't be any different than any other <i>array</i>.
  </p>
</div>
{% markdown %}
### Interact
Click on the tracks below to play them, in this example only one `<audio>` tag gets used, the `ng-repeat` is used on the playlist, not on the `<audio>` tag.
{% endmarkdown %}
<audio media-player="mediaPlayer" playlist="audioPlaylist"></audio>
{{ macro.player('mediaPlayer') }}

<table class="table table-hover table-rounded table-cursor">
  <thead>
    <th>#</th>
    <th>Artist</th>
    <th>Title</th>
  </thead>
  <tbody>
    <tr ng-repeat="song in audioPlaylist" ng-click="mediaPlayer.playPause($index)" ng-class="{ active: mediaPlayer.playing && mediaPlayer.currentTrack-1 === $index }">
      <td>[[ $index+1 ]]</td>
      <td>[[ song.artist ]]</td>
      <td>[[ song.title ]]</td>
    </tr>
  </tbody>
</table>

<h3>player status in realtime</h3>
{{ macro.playerDebug('mediaPlayer') }}

<h1>Code</h1>
<small>...you can inspect aswell!</small>
{% highlight 'javascript' %}
{% include './ng-repeat.js' %}
{% endhighlight %}

<br>
<p>Template for this page</p>
{% highlight 'html' %}
{% raw %}
<table class="table table-hover table-rounded table-cursor">
  <thead>
    <th>#</th>
    <th>Artist</th>
    <th>Title</th>
  </thead>
  <tbody>
    <tr ng-repeat="song in audioPlaylist" ng-click="mediaPlayer.playPause($index)" ng-class="{ active: mediaPlayer.playing && mediaPlayer.currentTrack-1 === $index }">
      <td>{{ $index+1 }}</td>
      <td>{{ song.artist }}</td>
      <td>{{ song.title }}</td>
    </tr>
  </tbody>
</table>
{% endraw %}
{% endhighlight %}
{% endblock %}
