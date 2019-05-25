const mongoose = require('mongoose');

const FeedItem = new mongoose.Schema({
  title: String,
  link: String,
  pubDate: String,
  description: String,
  description_text: String,
  guid: String,
  categories:String,
  images: [String],
  isoDate: String
},{ _id : false });


const Feed = new mongoose.Schema({
		feed_title: String,
		feed_url:  {type: String, index: {unique: true}},
		feed_type: String,
		feed_generator: String,
		feed_img: String,
		feed_description: String,
		feed_lastBuildDate: String,
		feed_updated: String,
		feed_link: String,
		feed_serverUpdateID: Number,
		feed_items: [FeedItem]
});

Feed.virtual('lastUpdated').get(function() {
	return this.feed_updated;
});


mongoose.model('Feed', Feed);
mongoose.model('FeedItem', FeedItem);
