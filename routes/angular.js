var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/feed.(html|htm)', function(req, res) {
  res.render('feed', { maxitems: 50 });
});

module.exports = router;
