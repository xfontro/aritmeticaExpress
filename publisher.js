// Copyright 2012, Jordi Íñigo Griera
// LGPL

var express = require('express');
var http = require('http');
var fs = require('fs');

var createServer = function (api, port) {
	var app = express();

	app.set('port', port);
	app.use('/debug2', function(req, res) {
		var data='';
		var length = 0;
		var writeStream = fs.createWriteStream('./output' + (new Date()).getTime() + '.json');
		
		req.setEncoding('utf8');
		req.on('data', function(chunk) { 
			data += chunk;
			length += chunk.length;	   
			writeStream.write(chunk);
			console.log(chunk.length);
		});

		req.on('end', function() {
			writeStream.end();
			req.body = data;
			console.log('total = ' + length);
			res.json(200, {resp: length});
		});
	});
	app.use(express.bodyParser());
	app.use(app.router);

	// development only
	if ('development' == app.get('env')) {
		app.use(express.logger('dev'));
		app.use(express.errorHandler());
	}

	// production only: if ('production' == app.get('env')) {}

	// all http posts accept json only
	app.post('/*', function(req, res, next) {
		req.accepts('application/json');
		next();
	});

	app.post('/debug', function(req, res) {
		console.log(req);
		res.json(200, { resp: 'ok' });
	});
	app.post('/save', function(req, res) {
		process.stdout.write('.');
		res.json(200, { resp: 'ok' });
	});

	// expose api
	for(func in api) {
		app.post('/' + func, (function (_f) {
									var f = _f;
									return function (req, res) {
												api[f](req.body, function(resObj) {
																		res.json(resObj);
																	});
											}
								})(func));	
	}

	// in case of requesting a inexisteng url
	app.all('/*', function (req, res, next) {
		res.json(500, { error: 'something went horribly wrong' });
	});

	http.createServer(app).listen(
		app.get('port'), 
		function () {
			console.log('server process listening');
		}
	);
};

exports.createServer = createServer;