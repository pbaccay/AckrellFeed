var mongoose = require('mongoose');

var Newsfeeds = new mongoose.Schema({
  title: String,
  type: String,
  feeds: [String]
});

mongoose.model('Newsfeeds', Newsfeeds);
