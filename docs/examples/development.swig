{% extends '../layout' %}
{% import '../player.macro' as macro %}
{% block javascript %}
  <script type="text/javascript">{% include './development.js' %}</script>
{% endblock %}

{% block controller %}
<div class="col-xs-12 col-sm-9" ng-controller="DevelopmentController">
{% endblock %}

{% block content %}
<div class="jumbotron">
  <h1>Dev Test Page</h1>
  <p>
    Intent of this page is to interact directly with angular-media-player from your browser.
  </p>
</div>
<audio media-player="mediaPlayer" playlist="mediaPlaylist"></audio>
{{ macro.player('mediaPlayer') }}

{% markdown %}
### how-to
Just open your favourite browser console and type:
```javascript
var angularmp = angular.element(document.querySelector('audio')).scope().mediaPlayer;
var angularpl = angular.element(document.querySelector('audio')).scope().mediaPlaylist;
```

You've just accessed the `mediaPlayer` and its playlist.  
Push an element to the playlist with:
```javascript
angularpl.push({ src: '<srchere>', type: '<typehere>'});
```
{% endmarkdown %}

<h3>player status in realtime</h3>
{{ macro.playerDebug('mediaPlayer') }}
<pre><code>
  browser: [[ browser ]]
</code></pre>
{% endblock %}
