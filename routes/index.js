5
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("BK routes index");
  res.render('sucess', { title: 'Express' });
});

module.exports = router;
