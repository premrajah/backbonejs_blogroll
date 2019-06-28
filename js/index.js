// Backbone Model 
var Blog = Backbone.Model.extend({
  defaults: {
    author: "",
    title: "",
    url: ""
  }
});

// Backbone Collection
var Blogs = Backbone.Collection.extend({});

// Instantiate two blogs 
/*
var blog1 = new Blog({ author: "Prem Rajah", title: "Prem's World", url: "http://premsworld.com"});
var blog2 = new Blog({ author: "Clarke Kent", title: "It it a plane", url: "http://superman.com"});
*/

// Instantiate collection 
// var blogs = new Blogs([blog1, blog2]);
var blogs = new Blogs();

// Backbone Views - One blog
var BlogView = Backbone.View.extend({
  model: new Blog(),
  tagName: 'tr',
  initialize: function () {
    this.template = _.template($('.blogs-list-template').html());
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

// Backbone Views - All blogs
var BlogsView = Backbone.View.extend({
  model: blogs,
  el: $('.blogs-list'),
  initialize: function () {
    this.model.on('add', this.render, this);
  },
  render: function () {
    var self = this; // to access this element

    this.$el.html('');
    _.each(this.model.toArray(), function (blog) {
      self.$el.append((new BlogView({
        model: blog
      })).render().$el);
    });

    return this;
  }
});

var blogsView = new BlogsView(); // Instantiate

$(document).ready(function () {

  let authorInput = $(".author-input");
  let titleInput = $(".title-input");
  let urlInput = $(".url-input");

  $(".add-blog").on('click', function () {

    if (authorInput.val() != '' && titleInput.val() != '' && urlInput.val() != '') {
      var blog = new Blog({
        author: authorInput.val(),
        title: titleInput.val(),
        url: urlInput.val()
      });
      // console.log(blog.toJSON());

      // Clear fields
      authorInput.val('');
      titleInput.val('');
      urlInput.val('');
      
      blogs.add(blog); // will trigger the initialize for blog view
    }

  });


});
// end document.ready