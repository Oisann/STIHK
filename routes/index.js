var express = require('express');
var UAParser = require('ua-parser-js');
var router = express.Router();

function getBrowser(req) {
  var parser = new UAParser();
  var ua = req.headers['user-agent'];
  var browserName = parser.setUA(ua).getBrowser().name;
  var fullBrowserVersion = parser.setUA(ua).getBrowser().version;
  var browserVersion = fullBrowserVersion.split(".",1).toString();
  var browserVersionNumber = Number(browserVersion);
  return {name: browserName, version: browserVersion};
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Hjem' });
});

/* GET update page. */
router.get('/update', function(req, res) {
  res.render('update', { browser: getBrowser(req) });
});

module.exports = router;
