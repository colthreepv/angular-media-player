{% extends '../layout' %}
{% block javascript %}
  <script type="text/javascript" src="/libs/angular-dragdrop.js"></script>
  <script type="text/javascript">{% include './interactive.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="InteractiveController">
{% endblock %}

{% block content %}
{% raw %}
<div class="jumbotron">
  <h1>Interactive demo</h1>
  <p>
    Interact with the directive through this demo page.
  </p>
</div>
<div class="audio-control">
  <audio player-control="audioPlayer" playlist="audioPlaylist" audio-player></audio>
  <div class="btn" ng-click="audioPlayer.play()">
    <span>Simple Play</span>
    <i class="fa fa-play"></i>
  </div>
  <div class="btn" ng-click="audioPlayer.playPause()">
    <i class="fa" ng-class="{ 'fa-pause': audioPlayer.playing, 'fa-play': !audioPlayer.playing }"></i>
  </div>
  <div class="btn" ng-click="audioPlayer.next()">
    <span>Next</span>
    <i class="fa fa-step-forward"></i>
  </div>
  <div class="btn" ng-click="audioPlayer.prev()">
    <i class="fa fa-step-backward"></i>
    <span>Prev</span>
  </div>
  <div class="btn btn-noclick">
    <span>currentTrack: <span class="badge">{{ audioPlayer.currentTrack }}</span></span>
  </div>
  <div class="progress">
    <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" ng-style="{ width: audioPlayer.currentTime*100/audioPlayer.duration + '%' }">
      <span class="sr-only">{{ audioPlayer.currentTime*100/audioPlayer.duration }}% Complete</span>
    </div>
    <div class="time" ng-show="audioPlayer.formatTime">
      <span>{{ audioPlayer.formatTime }}</span><b>/</b><span>{{ audioPlayer.formatDuration }}</span>
    </div>
  </div>
</div>

<h3><i>Interactive</i> playlist</h3>
<p>Keep track of this demo playlist in real-time</p>
<p class="text-warning">You can drag songs, to re-order them!</p>
<table class="table table-hover table-rounded table-cursor">
  <thead>
    <th>#</th>
    <th>Src</th>
    <th>Type</th>
  </thead>
  <tbody>
    <tr ng-repeat="song in audioPlaylist" ng-click="audioPlayer.playPause($index)" ng-class="{ active: audioPlayer.playing && audioPlayer.currentTrack-1 === $index }"
        ui-draggable="true" drag="song" on-drop-success="removeSong($index)" ui-on-drop="dropSong($data, $index)">
      <td>{{ $index+1 }}</td>
      <td><span ng-show="song.src.length > 50">...</span>{{ song.src | limitTo:-50 }}</td>
      <td>{{ song.type }}</td>
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
      <td>{{ $index+1 }}</td>
      <td>{{ song.artist }}</td>
      <td>{{ song.title }}</td>
    </tr>
  </tbody>
</table>


<h3>Audio properties tracked in realtime</h3>
<pre>
  <code>
    audioPlayer = {
      playing: {{ audioPlayer.playing }}
      currentTrack: {{ audioPlayer.currentTrack }}
      tracks: {{ audioPlayer.tracks }}
      volume: {{ audioPlayer.volume }}
      formatDuration: {{ audioPlayer.formatDuration }}
      duration: {{ audioPlayer.duration }}
      currentTime: {{ audioPlayer.currentTime }}
      formatTime: {{ audioPlayer.formatTime }}
      position: {{ audioPlayer.position }}
      loadPercent: {{ audioPlayer.loadPercent }}
    };
  </code>
</pre>
{% endraw %}
{% endblock %}
