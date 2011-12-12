var Wordnik = {
  Views: {}
};

(function() {
  var concepts = [
    "Prokhorov",
    "Vladimir Putin"
  ];
  
  Wordnik.Plus = Backbone.View.extend({
    el: 'body'
    ,init: function() {
      this.$article = this.$('div.article');
    }

    ,render: function() {
      this.appendCss();
      this.removeLinks();
      this.highlightConcepts();
    }

    ,removeLinks: function() {
      $('div.article p a').replaceWith(function() {
        return $(this).contents();
      });    
    }
    
    ,appendCss: function() {
      $('head').append('<link rel="stylesheet" href="http://localhost:4567/css/plus.css" type="text/css" />');
    }

    ,highlightConcepts: function() {
      /* read the text and highlight matching word */
      for(var i = 0; i < concepts.length; i++) {
        $('div.article p').highlight(concepts[i]);
      }
      console.log("Done highlightConcepts");    
    }
  });
})();
