{% extends '../layout' %}
{% import '../player.macro' as macro %}

{% block application %}
<html ng-app="docs-interactive">
{% endblock %}
{% block javascript %}
  <script type="text/javascript" src="libs/angular-dragdrop.js"></script>
  <script type="text/javascript">{% include './interactive.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="InteractiveController">
{% endblock %}

{% block content %}
<div class="jumbotron">
  <h1>Interactive demo</h1>
  <p>
    Interact with the directive through this demo page.
  </p>
</div>
<audio media-player="mediaPlayer" playlist="audioPlaylist"></audio>
{{ macro.player('mediaPlayer') }}

<h3><i>Interactive</i> playlist</h3>
<p>Keep track of this demo playlist in real-time</p>
<p class="text-warning">You can drag songs in this table, to re-order them!</p>
<table class="table table-hover table-rounded table-cursor">
  <thead>
    <th>#</th>
    <th>Src</th>
    <th>Type</th>
  </thead>
  <tbody>
    <tr ng-repeat="song in audioPlaylist" ng-click="mediaPlayer.playPause($index)" ng-class="{ active: mediaPlayer.playing && mediaPlayer.currentTrack-1 === $index }"
        ui-draggable="true" drag="song" on-drop-success="removeSong($index)" ui-on-drop="dropSong($data, $index)">
      <td>[[ $index+1 ]]</td>
      <td><span ng-show="song.src.length > 50">...</span>[[ song.src | limitTo:-50 ]]</td>
      <td>[[ song.type ]]</td>
    </tr>
  </tbody>
</table>


<h3>Add audio track</h3>
<p>Just click any of those sample songs to get added to your <i>interactive</i> playlist</p>
<table class="table table-hover table-rounded table-cursor">
  <thead>
    <th>#</th>
    <th>Artist</th>
    <th>Title</th>
  </thead>
  <tbody>
    <tr ng-repeat="song in prefabPlaylist" ng-click="addSong(song)">
      <td>[[ $index+1 ]]</td>
      <td>[[ song.artist ]]</td>
      <td>[[ song.title ]]</td>
    </tr>
  </tbody>
</table>


<h3>player status in realtime</h3>
{{ macro.playerDebug('mediaPlayer') }}
{% endblock %}
