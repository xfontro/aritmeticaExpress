// Copyright 2012, Jordi Íñigo Griera
// LGPL

var express = require('express');
var http = require('http');
var lib = require('./service');

var app = express();

app.set('port', app.get('port') || 80);
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
	req.accepts('application/json');
	next();
});

for(func in lib.api) {
	console.log('install:' + func);
	app.post('/' + func, function (req, res) {
							lib.api[func](req.body, function(resObj) {
													res.json(resObj);
												});
	});	
}

// in case of requesting a inexisteng url
app.all('/*', function (req, res, next) {
	res.json(500, { error: 'something went horribly wrong' });
});

http.createServer(app).listen(
	app.get('port'), 
	function () {
		console.log("server listening on port " + app.get('port'));
	}
);
