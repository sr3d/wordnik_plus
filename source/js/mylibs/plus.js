var Wordnik = {
  Views: {}
};

(function() {
  var concepts = [
    {text: "Prokhorov", concept: "Prokhorov"},
    {text: "Vladimir Putin", concept: "Vladimir Putin"},
    {text: "United Russia party", concept: "United Russia Party"},
    {text: "Russia", concept: "USSR"}
  ];
  
  // conan.{format}/textToConcept
  var conanBase = "http://ec2-50-18-98-244.us-west-1.compute.amazonaws.com/api/conan.json/";
  // var conanBase = "http://jake.local:8002/api/conan.json/";
  
  var square = function(n) { return n*n; };
  
  var radius = 150; // px
  var weight = 0.6;
  
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
  
  
  var pinnedConcepts = Wordnik.pinnedConcepts = {};
  
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
      var self = this;
      // debugger
      console.log("Submitting text %o", conanBase + 'textToConcept');
      
      var text = this.extractText();
      var limit = 800;
      for(var i = 0; i < Math.ceil(text.length / limit); i++ ) {
        // debugger
        var doc = text.substr( i * limit, i * limit + Math.min(text.length,  i * limit + limit) );
        // console.log("doc %o", doc); 
        (function() {
          $.getJSON( conanBase + 'textToConcept/?callback=?&numToReturn=10', { 
            doc: doc
          }, function(concepts) {
            console.log("concepts %o", concepts);
            /* read the text and highlight matching word */
            for(var i = 0; i < concepts.length; i++) {
              if(concepts[i].text.length > 3 )
                $('div.article p').highlight( concepts[i].text, concepts[i].concept );
            }
            self.$concepts = $('div.article span.highlight');
            console.log("Done highlightConcepts");

            self.ready = true;
          })
        })(doc);
      };

      
      // $.getJSON( conanBase + 'textToConcept/?callback=?&numToReturn=10', { 
      //   doc: this.extractText()
      // }, function(concepts) {
      //   console.log("concepts %o", concepts);
      //   /* read the text and highlight matching word */
      //   for(var i = 0; i < concepts.length; i++) {
      //     if(concepts[i].text.length > 3 )
      //       $('div.article p').highlight( concepts[i].text, concepts[i].concept );
      //   }
      //   self.$concepts = $('div.article span.highlight');
      //   console.log("Done highlightConcepts");
      //   
      //   self.ready = true;
      // })


      // for(var i = 0; i < concepts.length; i++) {
      //   $('div.article p').highlight(concepts[i].text, concepts[i].concept );
      // }
      // self.$concepts = $('div.article span.highlight');

      
    }
    
    ,extractText: function() {
      if(this.text) return this.text;
      var text = $('div.article p').map(function() { return this.innerHTML }).get().join('\n');
      // strip html text
      this.text = text.replace(/(<([^>]+)>)/ig,"")
        // .replace(/\ba|an|the|in|on|up|of\b/ig,'');
      
      // this.text = this.text.substr(0, Math.min(900, this.text.length));
      return this.text;
    }
    
    ,getConcepts: function() {
      $.getJSON('');
    }
    
    ,onMouseMove: function(e) {
      if(!this.ready) return;
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
          $el.removeClass('concept');
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
      if(pinnedConcepts[el.data('concept')]) {
        delete pinnedConcepts[el.data('concept')];
        el.removeClass('pinned');
        console.log("unpin" + el.data('concept') );
      } else {
        pinnedConcepts[el.data('concept')] = true;
        el.addClass('pinned');
        console.log("pin" + el.data('concept') );
      }
    }
  });
  
  
  
})();
