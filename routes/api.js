var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Parser = require('rss-parser');
var parser = new Parser();
var aws = require('aws-sdk');
var jsdom = require('jsdom').JSDOM
var async = require('async');
var Newsfeeds = mongoose.model('Newsfeeds');
var Feed = mongoose.model('Feed');
var FeedItem = mongoose.model('FeedItem');
var AckrellFeed = mongoose.model('AckrellFeed');
var AckrellFeedItem = mongoose.model('AckrellFeedItem');
var    urls = [
"https://news.google.com/news/rss/search/section/q/cannabis%7Cmarijuana%7Cmedical+marijuana%7CCBD%7Cdispensary%7Clicensed+producer%7Ccannabis+market+estimates%7Chemp%7CDEA%7CFDA?ned=us&gl=US&hl=en"
    ];

var css = "";

var i = 0;
// load aws sdk

// load aws config
aws.config.loadFromPath('config.json');

// this must relate to a verified SES account
var from = 'test@fixplanner.com'

//Add Ackrell Channels One time
var ackrellurl = "https://ackrellclub.com/rss";
var ackrellpendingurl = "https://ackrellclub.com/pending/rss";
var ackrelltitle = "Ackrell Club Newfeed";
var ackrellPendingtitle = "Ackrell Club Newfeed (Pending Items)";
var ackrelllogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAj8AAAHgCAMAAAB98vxiAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAAECU/pqamAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJkw5VgAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAABFNJREFUeF7t0kEBwDAIADGGf8+dB+6baMh8cOcPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lD4Q+EPhT8U/lDMgzt/KPyh8IfCHwp/KPyh8IfCHwp/KPyh8IfCHwp/KPyh8IfCHwp/KPyh8IfCHwp/KPyh8IfCHwp/KPyh8IfCHwp/KPyhmIU7fyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh8Kfyj8ofCHwh/udn+IeEmjRaBmxQAAAABJRU5ErkJggg==";
var ackrelldesc = "Cannabis and Marijuana industry newsfor investors";
var ackrellpubDate = new Date();
var ackrellserverupdateid = 1;
var feedackrelldb = new AckrellFeed({feed_title: ackrelltitle, feed_url: ackrellurl, feed_type:"rss", feed_generator: "", feed_img: ackrelllogo, 
			feed_description: ackrelldesc, feed_lastBuildDate: ackrellpubDate,  feed_updated: new Date(), feed_serverUpdateID: ackrellserverupdateid, feed_items: []});	  
	 console.log('PBK saveAcrellFeedtoDB : ' + ackrellurl );
			AckrellFeed.find({feed_url: ackrellurl}).count( function(err, count) {
				if(count === 1) { // Update existing
				console.log("PBK Ackrell Feed exists");
				} else {  // Add new RSS Feed channel
						feedackrelldb.save(function(err, feedackone) {
							console.log("PBK FeedAckSave Success");
							if(err) {
							console.log("PBK FeedAck Save ERROR: " + err);
							return(err, feedackone);
							}
						});
					}
			});
var feedpendingackrelldb = new AckrellFeed({feed_title: ackrellPendingtitle, feed_url: ackrellpendingurl, feed_type:"rss", feed_generator: "", feed_img: ackrelllogo, 
			feed_description: ackrelldesc, feed_lastBuildDate: ackrellpubDate,  feed_updated: new Date(), feed_serverUpdateID: ackrellserverupdateid, feed_items: []});	  
	 console.log('PBK saveAcrellPendingFeedtoDB : ' + ackrellpendingurl );
			AckrellFeed.find({feed_url: ackrellpendingurl}).count( function(err, count) {
				if(count === 1) { // Update existing
				console.log("PBK Pending Ackrell Feed exists");
				} else {  // Add new RSS Feed channel
						feedpendingackrelldb.save(function(err, feedackone) {
							console.log("PBK FeedAckPendingSave Success");
							if(err) {
							console.log("PBK FeedAckPending Save ERROR: " + err);
							return(err, feedackone);
							}
						});
					}
			});

//Save channel data			
 function saveFeedtoDB(feed) {
	 console.log('PBK saveFeedtoDB : ' + feed.feed_url );
			Feed.find({feed_url: feed.feed_url}).count( function(err, count) {
				if(count === 1) { // Update existing
				Feed.update({'feed_url': feed.feed_url},{$set:{'feed_updated': feed.feed_updated, 'feed_title': feed.feed_title, 'feed_generator': feed.feed_generator, 'feed_img': feed.feed_img, 
				'feed_description': feed.feed_description, 'feed_lastBuildDate': feed.feed_lastBuildDate, 'feed_link': feed.feed_link, 'feed_items' :feed.feed_items}}, function(err, feedone) {

				//	Feed.save({'feed_url': feed.feed_url, feed}, function(err, feedone) {
						console.log("PBK FeedOne Update");
						if(err) {
						console.log("PBK FeedOne update ERROR: "  + err);
						return(err, feedone);
						}
					});
				} else {  // Add new RSS Feed channel
						feed.save(function(err, feedone) {
							console.log("PBK FeedOne Save");
							if(err) {
							console.log("PBK FeedOne Save ERROR: " + err);
							return(err, feedone);
							}
						});
					}
			});
 }

//Save channel data			
 function saveAckrellFeedtoDB(feed) {
	 console.log('PBK saveFeedtoDB : ' + feed.feed_url );
			AckrellFeed.find({feed_url: feed.feed_url}).count( function(err, count) {
				if(count === 1) { // Update existing
				Feed.update({'feed_url': feed.feed_url},{$set:{'feed_updated': feed.feed_updated, 'feed_title': feed.feed_title, 'feed_generator': feed.feed_generator, 'feed_img': feed.feed_img, 
				'feed_description': feed.feed_description, 'feed_lastBuildDate': feed.feed_lastBuildDate, 'feed_link': feed.feed_link, 'feed_items' :feed.feed_items}}, function(err, feedone) {
						console.log("PBK FeedOne Update");
						if(err) {
						console.log("PBK FeedOne update ERROR: "  + err);
						return(err, feedone);
						}
					});
				} else {  
						// Add new RSS Feed channel
						feed.save(function(err, feedone) {
							console.log("PBK FeedOne Save");
							if(err) {
							console.log("PBK FeedOne Save ERROR: " + err);
							return(err, feedone);
							}
						});
					}
			});
 } 
 
 function lastUpdateCheck(updatedateString) {
        let rightNow = new Date();
        let then = new Date(updatedateString);

        let diff = rightNow - then;

        let second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;

        if (diff < minute) {
            // within minute
            return 0;
        } else 
			return 999;



    }
	
 function isFeedDataNew(updatedateString) {
        let rightNow = new Date();
        let then = new Date(updatedateString);

        let diff = rightNow - then;

        let second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;
		month = week * 4

        if (diff > month) {
            // within minute
            return false;
        } else 
			return true;
    }
 
 
 //check if last update happened in last minute, if so send DB data
async function isDataStale(url) {
	console.log("PBK isDataStale enter");
	var resultv = await Feed.findOne({"feed_url": url});
	console.log("PBK isDataStale Result");
	if(resultv) {
		var result = resultv.lastUpdated;
		var timediff = lastUpdateCheck(result);
		console.log('PBK timediff: ' + timediff);
		if(timediff > 0) {
			return true;
		} else
			return false;	
	} else {
		console.log('PBK timediff - New channel ');
	return true;
	}

}
async function getChannelData(url) {
	//await make asynch call sync
	var result = await Feed.findOne({"feed_url": url});
	if(result) {
		return result;
	} else {
		return null;
	}
		
}

async function getAckrellChannelData(url) {
	//await make asynch call sync
	var result = await AckrellFeed.findOne({"feed_url": url});
	if(result) {
		return result;
	} else {
		return null;
	}
		
}

//API Calls
router.get('/getAckrellPending', function(req, res, next) {
			  var channelfeedinfo = {};		
		  	  var channelfeed = {};
			  var queryurl = "https://ackrellclub.com/pending/rss";
		  getAckrellChannelData(queryurl).then(channelresult  => {
				if(channelresult) {
					console.log("PBK getAckrellPending return feed");
					channelfeedinfo['link'] = channelresult.feed_link;
					channelfeedinfo['img'] = channelresult.feed_img;
					channelfeedinfo['description'] = channelresult.feed_description;
					channelfeedinfo['lastBuildDate'] = channelresult.feed_lastBuildDate;
					channelfeedinfo['lastUpdated'] = channelresult.feed_updated;
					channelfeedinfo['generator'] = channelresult.feed_generator;	
					channelfeedinfo['title'] = channelresult.feed_title;	
					channelfeedinfo['serverUpdateID'] = channelresult.feed_serverUpdateID;	
					channelfeedinfo['items'] = channelresult.feed_items;	
					channelfeed['channel'] = channelfeedinfo;	  
					res.send(JSON.stringify(channelfeed));
				} else {
						console.log("PBK getAckrellPending no Data");
						res.send(500);	
					}
				console.log("PBK getAckrellPending Still Fresh");
			});
});

router.get('/getAckrellFeed', function(req, res, next) {
			  var channelfeedinfo = {};		
		  	  var channelfeed = {};
			  var queryurl = "https://ackrellclub.com/rss";
		  getAckrellChannelData(queryurl).then(channelresult  => {
				if(channelresult) {
					console.log("PBK getAckrellFeed return feed");
					channelfeedinfo['link'] = channelresult.feed_link;
					channelfeedinfo['img'] = channelresult.feed_img;
					channelfeedinfo['description'] = channelresult.feed_description;
					channelfeedinfo['lastBuildDate'] = channelresult.feed_lastBuildDate;
					channelfeedinfo['lastUpdated'] = channelresult.feed_updated;
					channelfeedinfo['generator'] = channelresult.feed_generator;	
					channelfeedinfo['title'] = channelresult.feed_title;	
					channelfeedinfo['serverUpdateID'] = channelresult.feed_serverUpdateID;	
					channelfeedinfo['items'] = channelresult.feed_items;	
					channelfeed['channel'] = channelfeedinfo;	  
					res.send(JSON.stringify(channelfeed));
				} else {
						console.log("PBK getAckrellFeed no Data");
						res.send(500);	
					}
				console.log("PBK getAckrellFeed Still Fresh");
			});
});

 router.post('/updateAckrellPending', function(req, res, next) {
	 console.log("PBK routes api updateAckrellPending");
	 if(req.body && req.body.link && req.body.feed_items) {
	 console.log('PBK updateAckrellPending saveFeedtoDB : ' + req.body.link );
			AckrellFeed.findOne({feed_url: req.body.link}, function(err, feed) {
				if(feed) { // Update existing
				//AckrellFeed.update({'feed_url': req.body.link},{$set:{'feed_items' : req.body.feed_items}}, function(err, feedone) {
					feed.feed_items = req.body.feed_items;
					var updateval = feed.feed_serverUpdateID;
					updateval = updateval + 1;
					feed.feed_serverUpdateID = updateval;
					feed.feed_lastBuildDate = new Date();
					feed.feed_updated = new Date();
						feed.save(function(err, feedone) {
				//	Feed.save({'feed_url': feed.feed_url, feed}, function(err, feedone) {
						console.log("PBK updateAckrellPending Update");
						if(err) {
						console.log("PBK updateAckrellPending update ERROR: "  + err);
						return(err, feedone);
						}
					});
				} else {  // Add new RSS Feed channel
					 console.log("PBK routes api updateAckrellPending missing");
					}
			}); 
			}
	 	res.json({ success: true, response: req.body});
	// if(req.body)
	 	// console.log("PBK routes api sendnewsletter emailhtml: " + req.body.emailhtml);
	 });

 router.post('/updateAckrellApproved', function(req, res, next) {
	 console.log("PBK routes api updateAckrellApproved");
	 if(req.body && req.body.link && req.body.feed_items) {
	 console.log('PBK updateAckrellApproved saveFeedtoDB : ' + req.body.link );
			AckrellFeed.findOne({feed_url: req.body.link}, function(err, feed) {
				if(feed) { // Update existing
					feed.feed_items = req.body.feed_items;
					var updateval = feed.feed_serverUpdateID;
					updateval = updateval + 1;
					feed.feed_serverUpdateID = updateval;
					feed.feed_lastBuildDate = new Date();
					feed.feed_updated = new Date();
						feed.save(function(err, feedone) {

						console.log("PBK updateAckrellApproved Update");
						if(err) {
						console.log("PBK updateAckrellApproved update ERROR: "  + err);
						return(err, feedone);
						}
					});
				} else {  // Add new RSS Feed channel
					 console.log("PBK routes api updateAckrellApproved missing");
					}
			}); 
			}
	 	res.json({ success: true, response: req.body});

	 });	 
	 

 router.post('/sendNewsletter', function(req, res, next) {
	 console.log("PBK routes api sendnewsletter");
	 });

	 
router.post('/publishNewsletter', function(req, res, next) {
// load AWS SES
 console.log("PBK routes api publishnewsletter A");


// send to list
var emailto = ['support@fixplanner.com', 'peterbaccay@yahoo.com'];
console.log("PBK routes api sendnewsletter 2");
if(req.body && req.body.emaillist) {
	emailto = req.body.emaillist;
}
console.log("PBK routes api sendnewsletter 3");
var emailsubject = "Ackrell Club Newsletter";
if(req.body && req.body.subject) {
	emailsubject = req.body.subject;
}
console.log("PBK routes api sendnewsletter 4");
var ses = new aws.SES({apiVersion: '2010-12-01'});
console.log("PBK routes api sendnewsletter 5");
const ebody_html1 =`<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">

    <style type="text/css">
      body, p, div {
        font-family:Roboto,Helvetica,Arial,sans-serif;
        font-size: 15px;
      }
      body {
        color: #626262;
      }
      body a {
        color: #7ED321;
        text-decoration: none;
      }
      p { margin: 0; padding: 0; }
      table.wrapper {
        width:100% !important;
        table-layout: fixed;
        -webkit-font-smoothing: antialiased;
        -webkit-text-size-adjust: 100%;
        -moz-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      img.max-width {
        max-width: 100% !important;
      }
      .column.of-2 {
        width: 50%;
      }
      .column.of-3 {
        width: 33.333%;
      }
      .column.of-4 {
        width: 25%;
      }
      @media screen and (max-width:480px) {
        .preheader .rightColumnContent,
        .footer .rightColumnContent {
            text-align: left !important;
        }
        .preheader .rightColumnContent div,
        .preheader .rightColumnContent span,
        .footer .rightColumnContent div,
        .footer .rightColumnContent span {
          text-align: left !important;
        }
        .preheader .rightColumnContent,
        .preheader .leftColumnContent {
          font-size: 80% !important;
          padding: 5px 0;
        }
        table.wrapper-mobile {
          width: 100% !important;
          table-layout: fixed;
        }
        img.max-width {
          height: auto !important;
          max-width: 480px !important;
        }
        a.bulletproof-button {
          display: block !important;
          width: auto !important;
          font-size: 80%;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .columns {
          width: 100% !important;
        }
        .column {
          display: block !important;
          width: 100% !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
      }
    </style>
    <!--user entered Head Start-->
    
     <!--End Head user entered-->
  </head>
  <body>`;
const ebody_html2=`</body></html>`; 
console.log("PBK routes api sendnewsletter 6");
const charset = "UTF-8";	 
const body_text = "";	 
var completedemail = "";
const configuration_set = "AckrellTesting";
if(req.body) {
	completedemail = ebody_html1 + req.body.html + ebody_html2;
}
console.log("PBK routes api sendnewsletter 7");
ses.sendEmail( 
	{ 
		Source: from, 
		Destination: { ToAddresses: emailto },
		Message: {
			Subject: {
				Data: emailsubject
			},
			Body: {
			  Text: {
				Data: body_text,
				Charset: charset 
			  },
			  Html: {
				Data: completedemail,
				Charset: charset
			  }
			}
		},
		ConfigurationSetName: configuration_set
	}
, function(err, data) {
	if(err) {
		console.log('PBK route api publish email ERROR: ' + err);
		res.status(400).json({ err });
	}
	console.log('PBK route api publish Email sent:');
	console.log(data);
	res.json({ success: true, response: data});
});  
	 });	 
 
router.get('/rsstest', function(req, res, next) {
	console.log("PBK RSS TEST: " + req.query.url);
	var queryurl = req.query.url;
	
	if(req.query.url) {
		
		urls = [];
		urls.push(req.query.url);
	}
	console.log("******** REQUEST *********");
	var feedsset = false;

	isDataStale(queryurl).then(stalecheck => {
			console.log("PBK stalecheck value: " + stalecheck);
		if(!stalecheck) {			
			console.log("PBK return feed fresh");
		  var channelfeedinfo = {};		
		  	  var channelfeed = {};
			  
		  getChannelData(queryurl).then(channelresult  => {
				if(channelresult) {
					console.log("PBK return feed fresh2");
					channelfeedinfo['link'] = channelresult.feed_link;
					channelfeedinfo['img'] = channelresult.feed_img;
					channelfeedinfo['description'] = channelresult.feed_description;
					channelfeedinfo['lastBuildDate'] = channelresult.feed_lastBuildDate;
					channelfeedinfo['generator'] = channelresult.feed_generator;	
					channelfeedinfo['title'] = channelresult.feed_title;	
					channelfeedinfo['items'] = channelresult.feed_items;	
					channelfeed['channel'] = channelfeedinfo;	  
					res.send(JSON.stringify(channelfeed));
				} else {
						console.log("PBK return feed fresh3");
						returnSingleFeed(res, queryurl);
					}
				console.log("PBK isDataStale: Still Fresh");
			});
		}
		else {
			console.log("PBK isDataStale: Stale");
				console.log("PBK return feed stale");
				returnSingleFeed(res, queryurl);
		}
	});
});



function displayArticle(res, a, title) {

 // some feeds don't have author (BBC!)
 var author = a.author || title;
  res.write('<div class="article">')
  res.write("<h3>"+a.title +"</h3>");
  res.write("<p><strong>" +author +" - " +a.pubDate +"</strong> <br />\n");
  res.write(a.content+"</p> </div>\n");
}


function displayFeed(res) {
  // send basic http headers to client
  res.writeHead(200, {
      "Content-Type": "text/html",
      "Transfer-Encoding": "chunked"
  });
  // setup simple html page:
  res.write("<html>\n<head>\n<title>RSS Feeds - Stream</title>\n" +css +"</head>\n<body>");
  // loop through our list of RSS feed urls
  for (var j = 0; j < urls.length; j++) {
    parser.parseURL(urls[j], function(err, feed) {
			  if (err) {
		  console.log(err);
		  return(err, feed);
	  }
	  console.log("FEED url: " + feed.title + " url items: " + feed.items.length);	
      // loop through the list of feed returned

      feed.items.forEach(function(entry, idx, array) {
        // stream article title (and what ever else you want) to client
		var itemtitle = "";
		var googlsubstring = "Google News";
		if(feed.title.includes(googlsubstring)) {
	        itemtitle = "";
		} else {
			itemtitle = feed.title;
		}
		displayArticle(res, entry, itemtitle);
		if(idx === array.length - 1 && j === urls.length-1) {
		  console.log("FINISH - Normal");	  
          res.end("</body>\n</html>"); 
		  // end http response
        }
		 if(idx === array.length - 1) {
			  console.log("FEED Finish - Normal - " + feed.title);	  
        }

      }) //  end inner for loop
    }); // end call to feed (feed-read) method
  } // end urls for loop


  setTimeout(function() {
	  console.log("FINISH by TIMEOUT");
    res.end("</body>\n</html>"); // end http response
  }, 4000);
}

function returnSingleFeed(res, queryurlvar) {
var keepGoing = true;
var keepGoingItr = 0;
var useErrorResp = true;
  // loop through our list of RSS feed urls
  //for (var j = 0; j < urls.length; j++) { queryurl


    parser.parseURL(queryurlvar, function(err, feed) {
			  if (err) {
				  console.log(err);
			  	return(err, feed);
			  }
	 console.log("FEED url: " + queryurlvar + " url items: " + feed.items.length);	
	//console.log("parser.parseURL 2 "+j + " feed: " + feed.title);
    // loop through the list of feed returned

	  newsid = 0;
	  var channelfeed = {};
	  var channelfeedinfo = {};
	  var newsarray = [];
	  var dbnewsarray = [];
		if(typeof feed.title != 'undefined') {
			if(feed.link.indexOf('news.google.com') > -1) {
				channelfeedinfo['title'] = "Google News - Cannabis"
			} else
			channelfeedinfo['title'] = feed.title;
		}
		if(typeof feed.link != 'undefined')	
	  channelfeedinfo['link'] = feed.link;
		if(typeof feed.image != 'undefined')	
	  channelfeedinfo['img'] = feed.image.url;
		if(typeof feed.description != 'undefined')	
	  channelfeedinfo['description'] = feed.description;
		if(typeof feed.lastBuildDate != 'undefined')	
	  channelfeedinfo['lastBuildDate'] = feed.lastBuildDate;
		if(typeof feed.generator != 'undefined')	
	  channelfeedinfo['generator'] = feed.generator;

	  //Store feed in db
	  
	var feeddb = new Feed({feed_title: channelfeedinfo['title'], feed_url: queryurlvar, feed_type:"rss", feed_generator: channelfeedinfo['generator'], feed_img: channelfeedinfo['img'], 
			feed_description: channelfeedinfo['description'], feed_lastBuildDate: channelfeedinfo['lastBuildDate'],  feed_updated: new Date(), feed_link: channelfeedinfo['link'],  feed_items: []});	  
	saveFeedtoDB(feeddb);
	  channelfeed['channel'] = channelfeedinfo;
      feed.items.forEach(function(entry, idx, array) {

        // stream article title (and what ever else you want) to client
		var itemtitle = "";
		var googlsubstring = "Google News";
		if (feed.title.includes(googlsubstring)) {
			itemtitle = "";
		} else {
			itemtitle = feed.title;
		}
		var newsobj = {};
		var feedimages = [];
		var fulldescription = entry.content;

		var dom = new jsdom(fulldescription);
		var window = dom.window;
		var imagestemp = window.document.querySelectorAll('img');
			
		    if (imagestemp && imagestemp.length > 0) {

		    	window.document.querySelectorAll('img').forEach(function (entry, idx, array) {
		    		if (window.document.querySelectorAll('img')[0]) {
		    			feedimages.push(window.document.querySelectorAll('img')[0].getAttribute('src'));
		    		}
		    	});

		    }
			newsobj['title'] = entry.title;
			newsobj['link'] = entry.link;
			newsobj['description'] = entry.content;
			newsobj['description_text'] = entry.contentSnippet;
			newsobj['pubDate'] = entry.pubDate;
			newsobj['images'] = feedimages;
			dbnewsobj = new FeedItem({title: newsobj['title'], link: newsobj['link'], description: newsobj['description'], description_text: newsobj['description_text'], pubDate: newsobj['pubDate'], images: newsobj['images']});	  
			if( isFeedDataNew(entry.pubDate)) {
			newsarray.push(newsobj);
			feeddb.feed_items.push(dbnewsobj);
			} 

	    if (idx === array.length - 1) {
	    	keepGoing = false;
	    	useErrorResp = false;
	    	console.log("FEED Finish - Normal - " + feed.title + " json data: " + newsobj.link);
	    	res.contentType('application/json');
	    	channelfeedinfo['items'] = newsarray;
	    	channelfeed['channel'] = channelfeedinfo;
	    	res.send(JSON.stringify(channelfeed));

	    }
		newsid++;
      }) //  end inner for loop
    }); // end call to feed (feed-read) method


function myLoop() {
    // ... Do something ...
    if(keepGoing && keepGoingItr < 6) {
		keepGoingItr++;
        setTimeout(myLoop, 1000);
    } else {
		console.log("RETURN NEWSJSON LOOP DONE");
		if(useErrorResp) {
				console.log("RETURN NEWSJSON LOOP ERROR");	
				res.status(400).json({ error });
		}
	}
}
  
if(keepGoing) {
        setTimeout(myLoop, 1000);
		}

function startLoop() {
    keepGoing = true;
    myLoop();
}

function stopLoop() {
    keepGoing = false;
}

}


function returnFeed(res) {
var keepGoing = true;
var keepGoingItr = 0;
var useErrorResp = true;
  // loop through our list of RSS feed urls
  for (var j = 0; j < urls.length; j++) {
    // fetch rss feed for the url:
    parser.parseURL(urls[j], function(err, feed) {
	console.log("FEED url: " + feed.title + " url items: " + feed.items.length);	
      // loop through the list of feed returned
	  if (err) {
		  console.log(err);
		  
	  }
	  newsid = 0;
	  var channelfeed = {};
	  var channelfeedinfo = {};
	  var newsarray = [];
		if(typeof feed.title != 'undefined') {
			if(feed.link.indexOf('news.google.com') > -1) {
				channelfeedinfo['title'] = "Google News - Cannabis"
			} else
			channelfeedinfo['title'] = feed.title;
		}
		if(typeof feed.link != 'undefined')	
	  channelfeedinfo['link'] = feed.link;
		if(typeof feed.image != 'undefined')	
	  channelfeedinfo['img'] = feed.image.url;
		if(typeof feed.description != 'undefined')	
	  channelfeedinfo['description'] = feed.description;
		if(typeof feed.lastBuildDate != 'undefined')	
	  channelfeedinfo['lastBuildDate'] = feed.lastBuildDate;
		if(typeof feed.generator != 'undefined')	
	  channelfeedinfo['generator'] = feed.generator;	  
	  
	  channelfeed['channel'] = channelfeedinfo;
      feed.items.forEach(function(entry, idx, array) {

        // stream article title (and what ever else you want) to client
		var itemtitle = "";
		var googlsubstring = "Google News";
		if(feed.title.includes(googlsubstring)) {
	        itemtitle = "";
		} else {
			itemtitle = feed.title;
		}
			var newsobj = {};
			newsobj['title'] = entry.title;
			newsobj['link'] = entry.link;
			newsobj['description'] = entry.content;
			newsobj['description_text'] = entry.contentSnippet;
			newsobj['pubDate'] = entry.pubDate;
			newsarray.push(newsobj);
	    if(idx === array.length - 1) {
							keepGoing = false;
				useErrorResp = false;
			  console.log("FEED Finish - Normal - " + feed.title + " json data: " + newsobj.link);	  
				res.contentType('application/json');
				channelfeed['items']=newsarray
				res.send(JSON.stringify(channelfeed));

        }
		newsid++;

      }) //  end inner for loop
    }); // end call to feed (feed-read) method
  } // end urls for loop

function myLoop() {
    // ... Do something ...

    if(keepGoing && keepGoingItr < 6) {
		keepGoingItr++;
        setTimeout(myLoop, 1000);
    } else {
		console.log("RETURN NEWSJSON LOOP DONE");
		if(useErrorResp) {
				console.log("RETURN NEWSJSON LOOP ERROR");	
				res.status(400).json({ error });
		}
	}
}
  
if(keepGoing) {
        setTimeout(myLoop, 1000);
		}

function startLoop() {
    keepGoing = true;
    myLoop();
}

function stopLoop() {
    keepGoing = false;
}



}

module.exports = router;