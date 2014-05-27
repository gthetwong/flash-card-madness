
//////////////////////////////////////
// CONFIGURATION AND INITIALIZATION //
//////////////////////////////////////
window.flashCardApp = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  start: function(){
    $.ajax({
      type:'Get',
      url: '../flashcard_input.json',
      async: false,
      jsonpCallback: 'spanishData',
      contentType: 'application/json',
      dataType: 'jsonp',
      success: function(json) {
        flashCardApp.words = new flashCardApp.Collections.Wordset();
        for (attr in json){
              var word = new flashCardApp.Models.Word({
                english : attr,
                spanish : json[attr]
              });
              flashCardApp.words.add(word);
            }
      },
      error: function(e) {
        console.log(e.message);
      }
    });
    this.router = new this.Routers.Main();
    Backbone.history.start();
    console.log("this is running the pushState");
  }
};

$(function(){
  flashCardApp.start();
});



/////////////////////////////////////
//      MODELS AND COLLECTIONS     //
/////////////////////////////////////

flashCardApp.Models.Word = Backbone.Model.extend({
  english : "",
  spanish : ""
});

flashCardApp.Collections.Wordset = Backbone.Collection.extend({
  model: flashCardApp.Models.Word
});

/////////////////////////////////////
//             THE VIEWS           //
/////////////////////////////////////

flashCardApp.Views.EnglishCard = Backbone.View.extend({
  className : "quizCard",
  events: {
    "click .answerBtn" : "showAnswer",
    "click .closeBtn" : "closeWindow"
  },
  render: function(){
    this.$el.html("<h2> Translate \"" + this.model.attributes.english + "\" to Spanish </h2><h4 class=\"answerBtn\">Show me the answer! </h4><div></div> <a class=\"closeBtn\" href=\"#\"></a>");
    return this;
  },
  showAnswer: function(){
    $(".quizCard div").html("<h3>" + this.model.attributes.spanish + "</h3>");
    flashCardApp.router.navigate("card/" + this.model.attributes.english + "/" + this.model.attributes.spanish);
    return this;
  },
  closeWindow: function(){
    $(".quizContainer").html("");
    flashCardApp.router.navigate("", {trigger:true});
    return this;
  }
})

flashCardApp.Views.EnglishTile = Backbone.View.extend({
  className : "tile",
  events: {
    "click" : "quiz"
  },
  render: function(){
    this.$el.html("<h3>" + this.model.attributes.english + "</h3>");
    return this;
  },
  quiz: function(){
    var flashCard = new flashCardApp.Views.EnglishCard({model: this.model});
     $(".quizContainer").html(flashCard.render().$el);
     flashCardApp.router.navigate("card/" + this.model.attributes.english, {trigger: true});
     return this;
  }
});

flashCardApp.Views.TileSet = Backbone.View.extend({
  el: "#spa",
  className: "tileView",
  render: function(){
    var that = this;
    this.collection.each(function(card){
        var tile = new flashCardApp.Views.EnglishTile({ model:card });
        this.$el.append(tile.render().$el);
    }, this);
    return this;
  }
});


/////////////////////////////////////
//             THE ROUTER          //
/////////////////////////////////////

flashCardApp.Routers.Main = Backbone.Router.extend({
  routes: {
    "": "index",
    "card/:english": "english",
    "card/:english/:spanish" : "englishAnswer"
  },
  index: function(){
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    tileSet.render();
  },
  english: function(english){
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    tileSet.render();
    var currentCard = flashCardApp.words.where({english: english});
    var currentCardView = new flashCardApp.Views.EnglishCard({model: currentCard[0]});
    $(".quizContainer").html(currentCardView.render().$el);
    //reconstruct what happens when it goes to the english flash card w/out answer
    //then build another route for what happens when its answered
  },
  englishAnswer: function(english, spanish){
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    tileSet.render();
    var currentCard = flashCardApp.words.where({english: english});
    var currentCardView = new flashCardApp.Views.EnglishCard({model: currentCard[0]});
    $(".quizContainer").html(currentCardView.render().$el);
    currentCardView.showAnswer();
  }
});