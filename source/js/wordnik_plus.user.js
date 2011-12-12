// ==UserScript==
// @name        Wordnik Plus
// @description Discovering News Made Easy
// @include     https://www.forbes.com/*
// @include     http://www.forbes.com/*
// @author      Alex & Colin - Wordnik
// ==/UserScript==

(function() {
  var script = document.createElement('script');
  // script.src = 'http://localhost/misc/githubfinder/javascripts/userscript.js';
  script.src = 'http://localhost:4567/js/wordnik_plus.js?r=' + (new Date).getTime();
  script.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(script);
})();