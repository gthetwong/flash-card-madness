
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
    Backbone.history.start(); //pushState option was causing errors with external links
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
    this.$el.html("<h2> Translate : <br>  <span>\"" + this.model.attributes.english + "\"</span></h2> <h2 class=\"answerBtn\">Show me the answer ! </h2><div></div> <button class=\"closeBtn\"></button>");
    return this;
  },
  showAnswer: function(){
    $(".quizCard div").html("<h2> <span>" + this.model.attributes.spanish + "</span></h2>");
    var query = window.location.hash;
    if (query.indexOf("card")> -1){
    flashCardApp.router.navigate("card/" + this.model.cid + "/english/answer");
    }else {
      flashCardApp.router.navigate("blitz/" + this.model.cid + "/english/answer");
    }
    return this;
  },
  closeWindow: function(event){
    event.preventDefault();
    $(".quizContainer").html("");
    flashCardApp.router.navigate("/", {trigger:true});
    return this;
  }
});

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
     flashCardApp.router.navigate("card/" + this.model.cid + "/english");
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
    this.$el.append("<button class=\"blitzBtn\"> Random Mode! </button>");
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
    $("#spa").html("");
    this.initialize();
    var randomWord= flashCardApp.words.at(Math.floor(Math.random()*flashCardApp.words.length));
    var flashCard = new flashCardApp.Views.EnglishCard({model: randomWord});    
    $(".quizContainer").html(flashCard.render().$el);
    flashCardApp.router.navigate("blitz/"+ randomWord.cid);
    return this;
  }
});


/////////////////////////////////////
//             THE ROUTER          //
/////////////////////////////////////

flashCardApp.Routers.Main = Backbone.Router.extend({
  routes: {
    "": "index",
    "card/:id/english": "english",
    "card/:id/english/answer" : "englishAnswer",
    "blitz/:card_id" : "blitz",
    "blitz/:card_id/english/answer": "blitzAnswer"
  },
  index: function(){
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    tileSet.initialize().render();
  },
  english: function(id){
    $("#spa").html("");
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    tileSet.initialize().render();
    var currentCard = flashCardApp.words.get({ cid: id});
    var currentCardView = new flashCardApp.Views.EnglishCard({model: currentCard});
    $(".quizContainer").html(currentCardView.render().$el);
  },
  englishAnswer: function(id){
    $("#spa").html("");
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    tileSet.initialize().render();
    var currentCard = flashCardApp.words.get({cid: id});
    var currentCardView = new flashCardApp.Views.EnglishCard({model: currentCard});
    $(".quizContainer").html(currentCardView.render().$el);
    currentCardView.showAnswer();
  },
  blitz: function(card_id){
    $("#spa").html("");
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    tileSet.initialize();
    var currentCard = flashCardApp.words.get({cid: card_id});
    var currentCardView = new flashCardApp.Views.EnglishCard({model: currentCard});
    $(".quizContainer").html(currentCardView.render().$el);
  },
  blitzAnswer: function(card_id){
    $("#spa").html("");
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    tileSet.initialize();
    var currentCard = flashCardApp.words.get({cid: card_id});
    var currentCardView = new flashCardApp.Views.EnglishCard({model: currentCard});
    $(".quizContainer").html(currentCardView.render().$el);
    currentCardView.showAnswer();
  }


});