// Copyright 2012, Jordi Íñigo Griera
// LGPL

var publisher = require('./publisher');
var args = require('commander');
var ops = require('./operations');

args
	.version('0.1')
	.option('-p, --port [number]', 'client port', process.env.port || 3000)
	.option('-c, --cluster', 'cluster of processes')
	.option('-t, --processes [number]', 'number of processes')
	.parse(process.argv);

if (!ops.start()) {
	console.log("RabbitMq connection is not listening yet...");
}

var port = process.env.port || args.port;

if (args.cluster) {
	require('./clustermanager').childSpawn(
		args.processes || require('os').cpus().length,
		function (id) {
			console.log('cluster: worker ' + id);
			publisher.createServer(ops.api, port);
		}
	);
} else {
	console.log('No cluster, listen on port: ' + port);
	publisher.createServer(ops.api, port);
}