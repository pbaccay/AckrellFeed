const mongoose = require('mongoose');

const AckrellFeedItem = new mongoose.Schema({
  title: String,
  link: String,
  pubDate: String,
  description: String,
  description_text: String,
  approvedBy: String,
  hideFromAckrellFeed: Boolean,
  ackrellCreated: Boolean,
  parameters: String,
  guid: String,
  categories:String,
  images: [String],
  isoDate: String
},{ _id : false });


const AckrellFeed = new mongoose.Schema({
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
		feed_items: [AckrellFeedItem]
});

AckrellFeed.virtual('lastUpdated').get(function() {
	return this.feed_updated;
});


mongoose.model('AckrellFeed', AckrellFeed);
mongoose.model('AckrellFeedItem', AckrellFeedItem);
