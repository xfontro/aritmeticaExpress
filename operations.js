var amqp = require('amqp');
var amqp_hacks = require('./amqp_hacks');
var connection;
var resultQ;
//var taskQ;

var start = function () {
	/*connection = amqp.createConnection({ url: 'amqp://localhost'});
	connection.on('ready', function () {
		resultQ = connection.queue('resultQueue', {autoDelete: false, durable: true});
	});*/
};

var api = {

	add : function (args, response) {
		var result = args[0];
		console.log("... to add");
		for (var i = 1; i < args.length; ++i) {
			result += args[i];
		}
		response(result);
	},

	subst : function (args, response) {
		var result = args[0];
		for(var i=1; i<args.length; ++i) {
			result -= args[i];
		}
		response(result);
	},

	mult : function (args, response) {
		var result = args[0];
		for(var i=1; i<args.length; ++i) {
			result *= args[i];
		}
		response(result);
	},

	div : function (args, response) {
		var result = args[0];
		for(var i=1; i<args.length; ++i) {
			result /= args[i];
		}
		response(result);
	},

	dist : function (args, response) {
		var result = args[0]*args[0];
		for(var i=1; i<args.length; ++i) {
			result += args[i]*args[i];
		}
		response(Math.sqrt(result));
	},

	load : function (args, response) {
		var result = 0;
		for(var j=0; j<10000; ++j) {
			for(var i=0; i<args.length; ++i) {
				result += Math.sqrt( args[i] * args[i] );
			}
		}
		response(result);
	},	

	publish : function (args, response){

		var result = 0;
		
		var connection = amqp.createConnection({ url: 'amqp://localhost'});
		connection.on('ready', function(){
			var resultQ = connection.queue('resultQueue', {autoDelete: false, durable: true});
			connection.publish('taskQueue', args, {deliveryMode: 2});

			resultQ.subscribe({ack: true, prefetchCount: 1}, function(msg){
				result += msg;
				//console.log(result);
				response(result, function (){
					resultQ.shift();
					resultQ.close();
					resultQ.purge();
					connection.end();
		    		connection.destroy();
				});

			});
		});

	}
};

exports.api = api;
exports.start = start;