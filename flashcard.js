
//////////////////////////////////////
// CONFIGURATION AND INITIALIZATION //
//////////////////////////////////////
window.flashCardApp = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  start: function(){
    this.router = new this.Routers.Main();
    Backbone.history.start({ pushState: true });
    console.log("this is running the pushState");
    $.ajax({
      type:'Get',
      url: 'flashcard_input.json',
      async: false,
      jsonpCallback: 'spanishData',
      contentType: 'application/json',
      dataType: 'jsonp',
      success: function(json) {
        console.log(json,"this is the json");
      },
      error: function(e) {
        console.log(e.message);
      }
    });
  }
};

$(function(){
  flashCardApp.start();
});



/////////////////////////////////////
//      MODELS AND COLLECTIONS     //
/////////////////////////////////////

flashCardApp.Models.EnglishWord = Backbone.Model.extend({

});

flashCardApp.Models.SpanishWord = Backbone.Model.extend({

});

flashCardApp.Collections.SpanishWords = Backbone.Collection.extend({
  model: flashCardApp.Models.SpanishWord
});

flashCardApp.Collections.EnglishWords = Backbone.Collection.extend({
  model: flashCardApp.Models.EnglishWord
});

/////////////////////////////////////
//             THE VIEWS           //
/////////////////////////////////////


flashCardApp.Views.Home = Backbone.View.extend({
  render: function(){
    this.$el.html("Hellooo Backbone World");
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
    var home = new flashCardApp.Views.Home();
    
    $('#spa').html(home.render().$el);
  },
  alert: function(){
    alert("alerting you this works!");
    $('#spa').html("this is the alerter page");
  }
});