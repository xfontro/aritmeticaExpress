// Copyright 2012, Jordi Íñigo Griera
// LGPL

var publisher = require('./publisher');
var args = require('commander');
var ops = require('./operations');

args
	.version('0.1')
	.option('-p, --port [number]', 'client port', process.env.port || 80)
	.option('-c, --cluster', 'cluster of processes')
	.option('-t, --processes [number]', 'number of processes')
	.parse(process.argv);

var api = {
	add: ops.add,
	subst: ops.subst,
	mult: ops.mult,
	div: ops.div,
	dist: ops.dist, 
	load: ops.load,
	publish: ops.publish
};

ops.start(function(){
	var port = process.env.port || args.port;

	if (args.cluster) {
		require('./clustermanager').childSpawn(
			args.processes || require('os').cpus().length,
			function (id) { 
				console.log('cluster: worker ' + id);
				publisher.createServer(api, port); 
			}
		);
	} else {
		console.log('No cluster, listen on port: ' + port);
		publisher.createServer(api, port);
	}
});