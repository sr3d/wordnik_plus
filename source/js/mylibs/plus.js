var Wordnik = {
  Views: {}
};

(function() {
  var concepts = [
    {text: "Prokhorov", concept: "Prokhorov"},
    {text: "Vladimir Putin", concept: "Vladimir Putin"},
    {text: "United Russia party", concept: "United Russia Party"},
  ];
  
  var conanBase = "http://";
  
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
  
  
  var pinnedConcepts = {};
  
  Wordnik.Plus = Backbone.View.extend({
    el: 'body'
    ,events: {
      'mousemove': 'onMouseMove',
      'click span.highlight': 'pinConcept'
    }
    ,init: function() {
      this.$article = this.$('div.article');
      // this.pinnedConcepts = {};
    }

    ,render: function() {
      this.removeAd();
      
      this.appendCss();
      this.removeLinks();
      this.highlightConcepts();
      
      this.renderRecommendedWidget();
      

    }
    
    ,removeAd: function() {
      this.$('.ad').remove();
      this.$('.engagement_block').remove();
    }
    
    ,renderRecommendedWidget: function() {
      this.recommendedWidget = new Wordnik.Views.Recommended();
      $('body').append(this.recommendedWidget.render().el);
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
        $('div.article p').highlight(concepts[i].text, concepts[i].concept );
      }
      this.$concepts = $('div.article span.highlight');
      console.log("Done highlightConcepts");    
    }
    
    ,getConcepts: function() {
      $.getJSON('');
    }
    
    ,onMouseMove: function(e) {
      // console.log("e %o", e);
      var scrollTop = $(document).scrollTop(),
          x = e.clientX,
          y = e.clientY + scrollTop,
          i, length, position, distance, $el, ratio;
          
      var selectedConcepts = [];
          
      for(i = 0, length = this.$concepts.length; i < length; i++) {
        $el = $(this.$concepts[i]);

        position = $el.offset();
        distance = Math.sqrt( square(x - position.left) + square(y - position.top) );
        // skip over pinnedConcept;
        if(pinnedConcepts[ $el.data('concept')]) {
          ratio = 0;
        } else {
          ratio = distance/radius;
        }
        $el.css({backgroundColor: bgColor(ratio)});
        
        // select closeby elements and elements within the view
        if(ratio < 1 && position.top > scrollTop ) {
          selectedConcepts.push($el.data('concept'));
        }
        // console.log("ratio " + ratio);
      }
      
      
      selectedConcepts = _.union( _.keys(pinnedConcepts), selectedConcepts );
       // _(selectedConcepts).concat( _.keys(this.pinnedConcepts) ).uniq();
      // if(selectedConcepts.length > 0)
      this.getRecommendedArticles(selectedConcepts)
    }
    
    ,getRecommendedArticles: function(concepts) {
      this.recommendedWidget.renderRecommendedArticles(concepts);
    }
    
    ,pinConcept: function(e) {
      var el = $(e.currentTarget);
      if(el.hasClass('pinned')) {
        delete pinnedConcepts[el.data('concept')];
        el.removeClass('pinned');
        console.log("unpin");
      } else {
        pinnedConcepts[el.data('concept')] = true;
        el.addClass('pinned');
        console.log("pin");
      }
    }
  });
  
  
  
})();
