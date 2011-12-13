(function() {
  var template = [
    '<h1>Wordnik Plus Recommendation</h1>',
    '<div class="intro">Hover mouse on document to see interesting topics</div>',
    '<div class="concepts"><h2>Interesting Concepts</h2>',
      '<div class="loading"><img src="http://localhost:4567/img/spinner.gif"> Asking a Ph.D professor to read this article right now</div> ',
      '<ul></ul>',
    '</div>',
    '<div class="articles"><h2>Articles You Should Read</h2>',
      '<ol></ol>',
      '<div class="loading" style="display: none"><img src="http://localhost:4567/img/spinner.gif"> busy typing good articles for ya...</div> ',
    '</div>'
  ];
  
  template = _.template(template.join(' '));
  
  var cache = {};
  var pinnedConcepts = Wordnik.pinnedConcepts;
  
  Wordnik.Views.Recommended = Backbone.View.extend({
    className: 'block wordnik_plus_recommended'
    ,id: 'recommendedView'
    ,init: function() {
      console.log("RecommendedView");
    }

    ,render: function() {
      // append to the page
      $(this.el).html( template() );
      return this;
    }

    ,renderRecommendedArticles: function(concepts) {
      // console.log("getting Recommendation for concepts %o", concepts);
      this.concepts = concepts;
      this.renderConcepts(concepts);
      this.renderArticles();
    }
    
    ,renderConcepts: function(concepts) {
      var html = [];
      var $concepts = this.$('.concepts'), $intro = this.$('.intro');

      $concepts.find('.loading').hide();

      if(concepts.length == 0){
        $intro.show();
        $concepts.hide();
        return;
      } 
      // $concepts.find('.loading').hide();
      $intro.hide();
      for(var i = 0; i < concepts.length; i++ ) {
        html.push(
          (pinnedConcepts[concepts[i]] ? 
            ('<li class="pinned">' + concepts[i] + ' <span>Unpin</span>') :
            '<li>' + concepts[i] + ''
          ) +
          "</li>"
        );
      }
      $concepts.show().find('ul').html(html.join("\n"));
    }
    
    ,renderArticles: function() {
      // this.$('.articles').hide();
      if(this.concepts.length == 0) return;
      if(this.isRunning) return;
      
      this.$('.loading').show();
      
      this.isRunning = true;
      var url = "http://monster.local:8000/find_docs/?callback=?";
      var params = {};
      for(var i = 0; i < this.concepts.length; i++) {
        params[ this.concepts[i] ] = '1.0'
      };

      console.log("params %o", params);
            
      var sortedConcepts = this.concepts.sort();
      var cacheKey = sortedConcepts.join('');

      var self = this;
      var onData = function(articles) {
        if(articles.length == 0) {
          self.$('.articles').hide();
          return;
        } 
        var html = [];
        for(var i = 0; i < articles.length; i++ ) {
          html.push('<li><a href="javascript:void(0)">' + articles[i] + '</a></li>');
        }
        self.$('.articles').show().find('ol').html( html.join('\n'));
        self.isRunning = false;
        self.$('.loading').hide();
      }
      
      if(cache[cacheKey]) {
        console.log("Hitting cache");
        onData(cacheKey[cacheKey]);
      } else {
        console.log("Request articles...");
        $.getJSON(url, params, function(articles) { 
          cache[cacheKey] = articles; onData(articles )
        });
      }

    }

  });  
})();
