{% extends '../layout' %}
{% import '../swig-macros.swig' as macro %}
{% block javascript %}
  <script type="text/javascript">{% include './development.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="DevelopmentController">
{% endblock %}

{% block content %}
<audio controls media-player="mediaPlayer" playlist="audioPlaylist"></audio>
{{ macro.buttons('mediaPlayer') }}

<pre><code>
  mediaPlayer.playing: [[ mediaPlayer.playing ]]
  mediaPlayer.ended: [[ mediaPlayer.ended ]]
</code></pre>
<pre><code>
  browser: [[ browser ]]
</code></pre>
{% endblock %}
