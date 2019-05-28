var mongoose = require('mongoose');
var shortid = require('shortid');

var WebEmailSchema = new mongoose.Schema({
_id: {
  'type': String,
  'default': shortid.generate
},	
  title: String,
  link: String,
  postDate: String,
  type: String,
  html: String
});

mongoose.model('WebEmail', WebEmailSchema);