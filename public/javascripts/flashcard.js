
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
    Backbone.history.start({ pushState: true });
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

flashCardApp.Views.Card = Backbone.View.extend({
  className : "quizCard",
  events: {
    "click .answerBtn" : "showAnswer"
  },
  render: function(){
    this.$el.html("<h2> Translate \"" + this.model.attributes.english + "\" to Spanish </h2><h4 class=\"answerBtn\">Show me the answer! </h4> <a class=\"closeBtn\" href=\"#\"></a>");
    return this;
  },
  showAnswer: function(){
    $(".quizCard").append(this.model.attributes.spanish);
  }
})

flashCardApp.Views.Tile = Backbone.View.extend({
  className : "tile",
  events: {
    "click" : "quiz"
  },
  render: function(){
    this.$el.html("<h3>" + this.model.attributes.english + "</h3>");
    return this;
  },
  quiz: function(){
    var flashCard = new flashCardApp.Views.Card({model: this.model});
     $(".quizContainer").html(flashCard.render().$el);
  }
});

flashCardApp.Views.TileSet = Backbone.View.extend({
  className: "tileView",
  render: function(){
    var that = this;
    this.collection.each(function(card){
        var tile = new flashCardApp.Views.Tile({ model:card });
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
    "card/:english": "english"
  },
  index: function(){
    var tileSet = new flashCardApp.Views.TileSet({ collection: flashCardApp.words });
    $("#spa").append(tileSet.render().$el);
  },
  english: function(){
    alert("alerting you this works!");
    $('#spa').html("this is the alerter page");
  }
});