
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
    this.$el.html("<h2> Translate : <br>  <span>\"" + this.model.attributes.english + "\"</span></h2> <h2 class=\"answerBtn\">Show me the answer ! </h2><div></div> <a class=\"closeBtn\" href=\"#\"></a>");
    return this;
  },
  showAnswer: function(){
    $(".quizCard div").html("<h2> <span>" + this.model.attributes.spanish + "</span></h2>");
    flashCardApp.router.navigate("card/" + this.model.attributes.english + "/" + this.model.attributes.spanish);
    return this;
  },
  closeWindow: function(){
    $(".quizContainer").html("");
    flashCardApp.router.navigate("/");
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
     flashCardApp.router.navigate("card/" + this.model.attributes.english);
     return this;
  }
});

flashCardApp.Views.TileSet = Backbone.View.extend({
  el: "#spa",
  className: "tileView",
  events: {
    "click .blitzBtn": "quizView"
  },
  initialize: function(){
    this.$el.append("<a href=\"#\" class=\"blitzBtn\"> Blitz Mode! </a>");
    return this;
  },
  render: function(){
    var that = this;
    this.collection.each(function(card){
        var tile = new flashCardApp.Views.EnglishTile({ model:card });
        this.$el.append(tile.render().$el);
    }, this);
    return this;
  },
  quizView: function(){
    // $("#spa").html("");
    var random = flashCardApp.words.at(Math.floor(Math.random()*flashCardApp.words.length));
    console.log(random);
  }
});


/////////////////////////////////////
//             THE ROUTER          //
/////////////////////////////////////

flashCardApp.Routers.Main = Backbone.Router.extend({
  routes: {
    "": "index",
    "card/:english": "english",
    "card/:english/:spanish" : "englishAnswer",
    "blitz/:card_id" : "blitz"
  },
  index: function(){
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    tileSet.initialize().render();
  },
  english: function(english){
    $("#spa").html("");
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    tileSet.initialize().render();
    var currentCard = flashCardApp.words.where({english: english});
    var currentCardView = new flashCardApp.Views.EnglishCard({model: currentCard[0]});
    $(".quizContainer").html(currentCardView.render().$el);
    //reconstruct what happens when it goes to the english flash card w/out answer
    //then build another route for what happens when its answered
  },
  englishAnswer: function(english, spanish){
    $("#spa").html("");
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    tileSet.initialize().render();
    var currentCard = flashCardApp.words.where({english: english});
    var currentCardView = new flashCardApp.Views.EnglishCard({model: currentCard[0]});
    $(".quizContainer").html(currentCardView.render().$el);
    currentCardView.showAnswer();
  }
});