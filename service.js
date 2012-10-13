// Copyright 2012, Jordi Íñigo Griera
// LGPL

var publisher = require('./publisher');
var args = require('commander');

args
	.version('0.1')
	.option('-p, --port [number]', 'client port', process.env.port || 80)
	.option('-c, --cluster', 'cluster of processes')
	.option('-t, --processes [number]', 'number of processes')
	.parse(process.argv);

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

if (args.cluster) {
	require('./clustermanager').childSpawn(
		args.processes || require('os').cpus().length,
		function (id) { 
			console.log('cluster: worker ' + id);
			publisher.createServer(api, process.env.port); 
		}
	);
} else {
	console.log('no cluster, listen on port ' + args.port);
	publisher.createServer(api, args.port);
}