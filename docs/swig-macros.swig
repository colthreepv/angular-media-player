{% macro buttons(playerName) %}
<div class="audio-control">
  <div class="btn" ng-click="{{ playerName }}.play()">
    <span>Simple Play</span>
    <i class="fa fa-play"></i>
  </div>
  <div class="btn" ng-click="{{ playerName }}.playPause()">
    <i class="fa" ng-class="{ 'fa-pause': {{ playerName }}.playing, 'fa-play': !{{ playerName }}.playing }"></i>
  </div>
  <div class="btn" ng-click="{{ playerName }}.next()">
    <span>Next</span>
    <i class="fa fa-step-forward"></i>
  </div>
  <div class="btn" ng-click="{{ playerName }}.prev()">
    <i class="fa fa-step-backward"></i>
    <span>Prev</span>
  </div>
  <div class="btn btn-noclick">
    <span>currentTrack: <span class="badge">[[ {{ playerName }}.currentTrack ]]</span></span>
  </div>
  <div class="btn btn-noclick">
    <span><i class="fa fa-clock-o"></i>: <span class="badge">[[ {{ playerName }}.formatTime ]]</span></span>
  </div>
  <div class="progress">
    <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" ng-style="{ width: {{ playerName }}.currentTime*100/{{ playerName }}.duration + '%' }"></div>
    <div class="time" ng-show="{{ playerName }}.formatTime">
      <span>[[ {{ playerName }}.formatTime ]]</span><b>/</b><span>[[ {{ playerName }}.formatDuration ]]</span>
    </div>
  </div>
</div>
{% endmacro %}
