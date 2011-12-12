var Wordnik = {
  Views: {}
};

(function() {
  var concepts = [
    "Prokhorov",
    "Vladimir Putin",
    "United Russia party"
  ];
  
  var square = function(n) { return n*n; };
  
  var radius = 300; // px
  
  var color = "fe57a1"; //254 87 161
  var bgColor = function(ratio) {
    // 254 87 161
    if(ratio >= 1) {
      return "rgb(255,255,255)";
    } else {
      return "rgb(" + 
              Math.ceil( 254 + (255 - 254) * ratio ) + "," +
              Math.ceil( 87 +  (255 - 87)  * ratio ) + "," +
              Math.ceil( 161 + (255 - 161) * ratio ) +
              ")"
    };
  };
  
  
  Wordnik.Plus = Backbone.View.extend({
    el: 'body'
    ,events: {
      'mousemove': 'onMouseMove'
    }
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
      this.$concepts = $('div.article span.highlight');
      console.log("Done highlightConcepts");    
    }
    
    ,onMouseMove: function(e) {
      // console.log("e %o", e);
      var scrollTop = $(document).scrollTop(),
          x = e.clientX,
          y = e.clientY + scrollTop,
          i, length, position, distance, $el, ratio;
          
      for(i = 0, length = this.$concepts.length; i < length; i++) {
        $el = $(this.$concepts[i]);
        position = $el.offset();
        distance = Math.sqrt( square(x - position.left) + square(y - position.top) );
        ratio = distance/radius;
        
        // console.log("distance %o ratio %o", distance, ratio);
        // $el.css({ opacity: ratio >= 1 ? 0 : 1 - ratio });
        $el.css({backgroundColor: bgColor(ratio)});
        // console.log("ratio " + ratio);
      }
    }
  });
  
  
  
})();
