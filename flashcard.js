
window.flashCardApp = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  start: function(){
    this.router = new this.Routers.Main();
    Backbone.history.start({ pushState: true });
    console.log("this is running the pushState");
  }

};

$(function(){
  flashCardApp.start();
});


flashCardApp.Views.Home = Backbone.View.extend({
  template: 'index'
  render: function(){
    this.$el.html("Hellooo Backbone World");
    return this;
  }

});


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