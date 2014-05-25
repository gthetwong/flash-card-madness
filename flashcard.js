
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
      url: 'flashcard_input.json',
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


flashCardApp.Views.Home = Backbone.View.extend({
  render: function(){
    var that = this;
    _.each(flashCardApp.words.models, function(card, index){
      //passing in each card as a model to a new view
      that.$el.append("<p> " +card.attributes.english + " translates to " + card.attributes.spanish+ "</p>");
    });
    return this;
  }
});

flashCardApp.Views.Card = Backbone.View.extend({
  render: function(){
    this.$el.html("<div><h1>" + this.model.attributes.english + "</h1> </div>");
    return this;
  },
  // display: function(){
  //   $("#spa").append(this.render().$el);
  // }
});

flashCardApp.Views.Tile = Backbone.View.extend({
  render: function(){
    var that = this;
    this.collection.each(function(card){
        var tile = new flashCardApp.Views.Card({ model:card });
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
    "alert": "alert"
  },
  index: function(){
    var tileSet = new flashCardApp.Views.Tile({ collection: flashCardApp.words });
    $("#spa").append(tileSet.render().$el);
  },
  alert: function(){
    alert("alerting you this works!");
    $('#spa').html("this is the alerter page");
  }
});