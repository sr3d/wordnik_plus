(function() {
  var template = [
    '<h1>Wordnik Plus Recommendation</h1>',
    '<div class="intro">Hover mouse on document to see interesting topics</div>',
    '<div class="concepts"><h2>Interesting Concepts</h2>',
      '<ul></ul>',
    '</div>',
    '<div class="articles"><h2>Articles You Should Read</h2>',
      '<ul></ul>',
    '</div>',

    
  ];
  
  template = _.template(template.join(' '));
  
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
      if(concepts.length == 0){
        $intro.show();
        $concepts.hide();
        return;
      } 

      $intro.hide();
      for(var i = 0; i < concepts.length; i++ ) {
        html.push("<li>" + concepts[i] + "</li>");
      }
      $concepts.show().find('ul').html(html.join("\n"));
    }
    
    ,renderArticles: function() {
      this.$('.articles').hide();
    }

  });  
})();
