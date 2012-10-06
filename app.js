// Copyright 2012, Jordi Íñigo Griera
// LGPL

var express = require('express');
var http = require('http');

var app = express();

app.set('port', app.get('port') || 80);
app.use(express.bodyParser());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
	app.use(express.logger('dev'));
	app.use(express.errorHandler());
}

// production only
if ('production' == app.get('env')) {
}

app.post('/*', function (req, res, next) {
	req.accepts('application/json');
	next();
});

app.post('/mult', function (req, res) {
	res.json( req.body[0] * req.body[1] );
});

app.all('/*', function (req, res, next) {
	res.json(500, { error: 'something went horribly wrong' });
});

http.createServer(app).listen(
	app.get('port'), 
	function () {
		console.log("Express server listening on port " + app.get('port'));
	}
);
