//= require "libs/underscore"
//= require "libs/backbone"
//= require "mylibs/plus.js"
//= require "mylibs/utils.js"
//= require_tree "./mylibs"


(function($) {

  var basePath = "http://plus.dev/js";
  var plus = new Wordnik.Plus();
  plus.render();
  
  window.wordnikPlus = plus;

  console.log("done");
})(jQuery);