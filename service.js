// Copyright 2012, Jordi Íñigo Griera
// LGPL

var publisher = require('./publisher');

var api = {
	add: 
		function (args, response) {
			var result = args[0];
			for(var i=1; i<args.length; ++i) {
				result += args[i];
			}
			response(result);
		},
	subst: 
		function (args, response) {
			var result = args[0];
			for(var i=1; i<args.length; ++i) {
				result -= args[i];
			}
			response(result);
		},
	mult: 
		function (args, response) {
			var result = args[0];
			for(var i=1; i<args.length; ++i) {
				result *= args[i];
			}
			response(result);
		},
	div: 
		function (args, response) {
			var result = args[0];
			for(var i=1; i<args.length; ++i) {
				result /= args[i];
			}
			response(result);
		},
	dist: 
		function (args, response) {
			var result = args[0]*args[0];
			for(var i=1; i<args.length; ++i) {
				result += args[i]*args[i];
			}
			response(Math.sqrt(result));
		},
	load:
		function (args, response) {
			var result = 0;
			for(var j=0; j<10000; ++j) {
				for(var i=0; i<args.length; ++i) {
					result += Math.sqrt( args[i] * args[i] );
				}
			}
			response(result);
		}	
};

publisher.createServer(api, process.env.port);