var express = require('express');
var router = express.Router();



/* GET user profile. */
router.get('/getstatus', function(req, res, next) {
			console.log("PBK routes user /GETSTATUS");
			res.json({
			message : 'You made it to the secure route',
			user : req.user,
			token : req.query.secret_token
			}); 
  });

module.exports = router;