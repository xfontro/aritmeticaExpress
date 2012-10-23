// Copyright 2012, Jordi Íñigo Griera
// LGPL
var http = require('http');
var url = require('url');

var createServer = function (api, port) {
	function onRequest(request, response) {
		var postData = '';
		var pathname = url.parse(request.url).pathname.split("/")[1];

		//console.log("Request for " + pathname + " received.");

		request.setEncoding("utf8");

		request.addListener("data", function (postDataChunk) {
			postData += postDataChunk;
			//console.log("Received POST data chunk '" + postDataChunk + "'.");
		});

		request.addListener("end", function () {
			try {

				var args = JSON.parse(postData);

				//console.log('The data is : ' + args);
				api[pathname](args, function (total) {

					var x = JSON.stringify(total);
					response.writeHead(200, {
						'Content-Length' : x.length,
						'Content-Type' : 'application/json'
					});
					response.write(x);
					response.end();
				});
			} catch (e) {
			}
		});
	}

	http.createServer(onRequest).listen(port);

};

exports.createServer = createServer;