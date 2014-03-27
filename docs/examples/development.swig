{% extends '../layout' %}
{% block javascript %}
  <script type="text/javascript">{% include './development.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="DevelopmentController">
{% endblock %}

{% block content %}
{% raw %}
<audio controls audio-player="audioPlayer" playlist="audioPlaylist">
  <source src="http://www.soundjay.com/misc/bell-ringing-01.mp3" type="audio/mp3">
</audio>
<div class="audio-control">
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
  <div class="btn btn-noclick">
    <span><i class="fa fa-clock-o"></i>: <span class="badge">{{ audioPlayer.formatTime }}</span></span>
  </div>
  <div class="progress">
    <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" ng-style="{ width: audioPlayer.currentTime*100/audioPlayer.duration + '%' }"></div>
    <div class="time" ng-show="audioPlayer.formatTime">
      <span>{{ audioPlayer.formatTime }}</span><b>/</b><span>{{ audioPlayer.formatDuration }}</span>
    </div>
  </div>
</div>

<pre><code>
  audioPlayer.playing: {{ audioPlayer.playing }}
</code></pre>
<pre><code>
  browser: {{ browser }}
</code></pre>
{% endraw %}
{% endblock %}
