var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

router.all(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  //res.writeHead(200, {'Content-Type': 'application/json'});
});

/* Our bandwidth will not like this... */
router.get('/weather/image/*', function(req, res) {
   request.get('http://symbol.yr.no/grafikk/sym/b38/' + req.url.replace('/weather/image/', '') + '.png').pipe(res);
});

/* Save the client for some unnecessary bandwidth */
router.get('/weather/local', function(req, res) {
  var tr_symbol, tr_temperature, kr_symbol, kr_temperature;
  request('http://www.yr.no/sted/Norge/S%C3%B8r-Tr%C3%B8ndelag/Trondheim/Trondheim/varsel.xml', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      $('tabular > time:first-child').each(function () {
        tr_symbol = { name: $(this).find('symbol').attr('name'),
                       var: $(this).find('symbol').attr('var')
                     },
        tr_temperature = $(this).find('temperature').attr('value');
        request('http://www.yr.no/sted/Norge/S%C3%B8r-Tr%C3%B8ndelag/Melhus/Korsvegen/varsel.xml', function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            $('tabular > time:first-child').each(function () {
              kr_symbol = { name: $(this).find('symbol').attr('name'),
                             var: $(this).find('symbol').attr('var')
                           },
              kr_temperature = $(this).find('temperature').attr('value');
              res.json({trondheim: { temp: tr_temperature, title: tr_symbol.name, code: tr_symbol.var }, korsvegen: { temp: kr_temperature, title: kr_symbol.name, code: kr_symbol.var } });
            });
          } else {
            res.json({statusCode: response.statusCode, error: error});
          }
        });
      });
    } else {
      res.json({statusCode: response.statusCode, error: error});
    }
  });
});

router.get('/weather/*', function(req, res) {
  var result = [];
  request('http://www.yr.no/sted/' + req.url.replace('/weather/', '') + '/varsel.xml', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      $('tabular > time').each(function (index) {
        var from = $(this).attr('from'),
            to = $(this).attr('to'),
            period = $(this).attr('period'),
            symbol = { number: $(this).find('symbol').attr('number'),
                       numberEx: $(this).find('symbol').attr('numberEx'),
                       name: $(this).find('symbol').attr('name'),
                       var: $(this).find('symbol').attr('var'),
                     },
            precipitation = $(this).find('precipitation').attr('value'),
            windDirection = { deg: $(this).find('windDirection').attr('deg'),
                              code: $(this).find('windDirection').attr('code'),
                              name: $(this).find('windDirection').attr('name'),
                            },
            windSpeed = { mps: $(this).find('windSpeed').attr('mps'),
                          name: $(this).find('windSpeed').attr('name'),
                        },
            temperature = { unit: $(this).find('temperature').attr('unit'),
                            value: $(this).find('temperature').attr('value'),
                          },
            pressure = { unit: $(this).find('pressure').attr('unit'),
                         value: $(this).find('pressure').attr('value'),
                       };
        result[index] = {from: from, to: to, period: period, symbol: symbol,
                         precipitation: precipitation, windDirection: windDirection,
                         windSpeed: windSpeed, temperature: temperature, pressure: pressure
                        };
      });
      res.json(result);
    } else {
      res.json({statusCode: response.statusCode, error: error});
    }
  });
});

router.get('*', function(req, res) {
  res.json({version: '0.0.3', api: {GET: ['/weather/:yr-location', '/weather/local', '/weather/image/:imageID']}});
  //res.send('<b>API:</b><br/>GET /weather/:yr-location<br/>GET /weather/local<br/>GET /weather/image/:imageID');
});

module.exports = router;
