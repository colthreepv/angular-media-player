{% extends '../layout' %}
{% import '../player.macro' as macro %}
{% block javascript %}
  <script type="text/javascript">{% include './video-support.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="VideoController">
{% endblock %}

{% block content %}
<div class="jumbotron">
  <h1>Video Support</h1>
  <p>
    All the legacy <code>&lt;audio&gt;</code> functionality inside a <code>&lt;video&gt;</code> tag.
  </p>
</div>
{% markdown %}
### Demo
There are 2 videos in `webm` format in this demo, you can play them using the same **API**.
{% endmarkdown %}
<video media-player="mediaPlayer" playlist="videoPlaylist"></video>
{{ macro.player('mediaPlayer') }}

<h3>player status in realtime</h3>
{{ macro.playerDebug('mediaPlayer') }}

<h1>Code</h1>
<small>...you can inspect aswell!</small>
{% highlight 'javascript' %}
{% include './video-support.js' %}
{%endhighlight %}
{% endblock %}
