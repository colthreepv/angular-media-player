{% extends '../layout' %}
{% block javascript %}
  <script type="text/javascript">{% include './development.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="DevelopmentController">
{% endblock %}

{% block content %}
{% raw %}
<audio audio-player="audioPlayer" playlist="audioPlaylist" controls>
  <source src="http://www.soundjay.com/misc/bell-ringing-01.mp3" type="audio/mp3">
</audio>
<div class="audio-control">
  <div class="btn" ng-click="playPls(audioPlayer)">
    <span>Simple Play</span>
    <i class="fa fa-play"></i>
  </div>
</div>
{% endraw %}
{% endblock %}
