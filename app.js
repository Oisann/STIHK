var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var UAParser = require('ua-parser-js');
var debug = require('debug')('STIHK');

function ensureLatestBrowser(req, res, next) {
  var parser = new UAParser();
  var ua = req.headers['user-agent'];
  var browserName = parser.setUA(ua).getBrowser().name;
  var fullBrowserVersion = parser.setUA(ua).getBrowser().version;
  var browserVersion = fullBrowserVersion.split(".",1).toString();
  var browserVersionNumber = Number(browserVersion);
  if (browserName == 'IE' && browserVersion <= 8)
    res.redirect('/update/');
  else if (browserName == 'Firefox' && browserVersion <= 24)
    res.redirect('/update/');
  else if (browserName == 'Chrome' && browserVersion <= 29)
    res.redirect('/update/');
  else if (browserName == 'Canary' && browserVersion <= 32)
    res.redirect('/update/');
  else if (browserName == 'Safari' && browserVersion <= 5)
    res.redirect('/update/');
  else if (browserName == 'Opera' && browserVersion <= 16)
    res.redirect('/update/');
  else
    return next();
}

/*var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_insert');
    collection.insert({a:2}, function(err, docs) {

      collection.count(function(err, count) {
        console.log(format("count = %s", count));
      });

      // Locate all the entries using find
      collection.find().toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
        db.close();
      });
    });
  });
*/
var routes = require('./routes/index');
var api = require('./routes/api');
var users = require('./routes/users');
var angular = require('./routes/angular');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public/img/favicon.png')));
app.use(logger('dev'));
/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded());*/
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all(/^(?!(\/update)).*$/, ensureLatestBrowser);

app.use('/', routes);
app.use('/api', api);
app.use('/users', users);
app.use('/module', angular);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(app.get('port'), function(){
  debug('Express server listening on port ' + server.address().port);
});

io.sockets.on('connection', function(socket) {
  socket.on('console', function(data) {
    io.emit('console', data);
  });
});
