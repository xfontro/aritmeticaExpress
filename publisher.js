// Copyright 2012, Jordi Íñigo Griera
// LGPL

var express = require('express');
var http = require('http');
var fs = require('fs');

var createServer = function (api, port) {
	var app = express();

	app.use(express.bodyParser());
	app.use(app.router);

	// development only
	if ('development' == app.get('env')) {
		app.use(express.logger('dev'));
		app.use(express.errorHandler());
	}

	// production only: if ('production' == app.get('env')) {}

	// all http posts accept json only
	app.post('/*', function (req, res, next) {
		//console.log('In publisher ALL, req: ' + req.body[0]);
		req.accepts('application/json');
		next();
	});

	// expose api
	for(func in api) {
		app.post('/' + func, (function (_f) {
									var f = _f;
									return function (req, res) {
												//console.log('In publisher, req: ' + req.body[0]);
 												api[f](req.body, function(resObj) {
																		res.json(resObj);	
																	});
											}
								})(func));	
	}

	// in case of requesting a inexisteng url
	app.all('/*', function (req, res, next) {
		res.json(500, { error: 'Something went horribly wrong' });
	});

	app.listen(port);
	console.log('Server process listening at port: ' + port);
};

exports.createServer = createServer;