{% extends '../layout' %}
{% block javascript %}
  <script type="text/javascript">{% include './development.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="DevelopmentController">
{% endblock %}

{% block content %}
{% raw %}
<audio controls media-player="mediaPlayer" playlist="audioPlaylist"></audio>
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
  mediaPlayer.playing: {{ mediaPlayer.playing }}
  mediaPlayer.ended: {{ mediaPlayer.ended }}
</code></pre>
<pre><code>
  browser: {{ browser }}
</code></pre>
{% endraw %}
{% endblock %}
