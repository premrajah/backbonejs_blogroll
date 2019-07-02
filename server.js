var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blogroll', {
  useNewUrlParser: true
});
var Schema = mongoose.Schema;

var BlogSchema = new Schema({
  author: String,
  title: String,
  url: String
});

mongoose.model('Blog', BlogSchema);
var Blog = mongoose.model('Blog'); // shortcut to access blog schema

// var blog = new Blog({
//   author: "Prem",
//   title: "Prem's Blog",
//   url: "http://premrajah.com"
// });

// blog.save();  // saves to server (mongo)

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// ROUTES
app.get('/api/blogs', function (req, res) {
  Blog.find(function (err, docs) {
    docs.forEach(item => {
      console.log("Received a GET request for _id: " + item._id);
    });
    res.send(docs);
  });
});

app.post('/api/blogs', function (req, res) {
  console.log("Received a POST request.");

  // Log post request
  for (var key in req.body) {
    console.log(key + ' : ' + req.body[key]);
  }

  var blog = new Blog(req.body);
  blog.save(function (err, doc) {
    res.send(doc);
  });

});

var port = 3000;
app.listen(port);
console.log('Server on : ' + port);