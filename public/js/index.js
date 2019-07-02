// Change backbone 'id' to match mongodb '_id'
Backbone.Model.prototype.idAttribute = '_id';



// Backbone Model 
var Blog = Backbone.Model.extend({
  defaults: {
    author: "",
    title: "",
    url: ""
  }
});

// Backbone Collection
var Blogs = Backbone.Collection.extend({
  url: "http://localhost:3000/api/blogs"
});

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
  events: {
    'click .edit-blog': 'edit',
    'click .update-blog': 'update',
    'click .cancel': 'cancel',
    'click .delete-blog': 'delete'
  },
  edit: function () {
    this.$(".edit-blog").hide();
    this.$(".delete-blog").hide();
    this.$(".update-blog").show();
    this.$(".cancel").show();

    // store values
    var author = this.$('.author').html();
    var title = this.$('.title').html();
    var url = this.$('.url').html();

    // for edit button
    this.$('.author').html('<input type="text" class="form-control author-update" value="' + author + '">');
    this.$('.title').html('<input type="text" class="form-control title-update" value="' + title + '">');
    this.$('.url').html('<input type="text" class="form-control url-update" value="' + url + '">');
  },
  update: function () {
    this.model.set('author', this.$('.author-update').val()); // added this to remove setTimeout 
    this.model.set('title', this.$('.title-update').val());
    this.model.set('url', this.$('.url-update').val());

    this.model.save(null, {
      success: function(response) {
        console.log("Successfully UPDATED blog with id: " + response.toJSON()._id);
      },
      error: function() {
        console.log("Failed to UPDATE blog.")
      }
    });
  },
  cancel: function () {
    blogsView.render();
  },
  delete: function () {
    this.model.destroy({
      success: function(response) {
        console.log("Successfully DELETED blog with id: " + response.toJSON()._id);
      },
      error: function() {
        console.log("Failed to DELETE blog.");
      }
    });
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
    var self = this;

    this.model.on('add', this.render, this);
    // needs a slight delay
    this.model.on('change', function () {
      // setTimeout(() => {
      self.render();
      // }, 30);
    }, this);
    //listen for removal for item in the collection to delete
    this.model.on('remove', this.render, this);

    // initial load from db
    this.model.fetch({
      success : function(response){
        _.each(response.toJSON(), function(item) {
          console.log("Successfully GOT blog with _id: " + item._id);
        });
      },
      error: function() {
        console.log("Failed to get blogs.");
      }
    });
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

      // Clear fields
      authorInput.val('');
      titleInput.val('');
      urlInput.val('');

      blogs.add(blog); // will trigger the initialize for blog view

      // add to db
      blog.save(null, {
        success: function(response) {
          console.log("Successfully SAVED blog with id: " + response.toJSON()._id);
        },
        error: function() {
          console.log("Failed to save Blog");
        }
      });

    }

  });


});
// end document.ready