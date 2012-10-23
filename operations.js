var amqp = require('amqp');
var amqp_hacks = require('./amqp_hacks');
var connection;
var resultQ;
var taskQ;
var rpc;

var start = function (){
	connection = amqp.createConnection({ url: 'amqp://localhost'});
	rpc = new (require('./amqprpc'))(connection);
	connection.on('ready', function(){
		//resultQ = connection.queue('resultQueue', {autoDelete: false, durable: true});
	});
};

var add = function (args, response) {
	var result = args[0];
	console.log("... to add");
	for(var i=1; i<args.length; ++i) {
		result += args[i];
	}
	response(result);
};

var subst = function (args, response) {
	var result = args[0];
	for(var i=1; i<args.length; ++i) {
		result -= args[i];
	}
	response(result);
};

var mult = function (args, response) {
	var result = args[0];
	for(var i=1; i<args.length; ++i) {
		result *= args[i];
	}
	response(result);
};

var div = function (args, response) {
	var result = args[0];
	for(var i=1; i<args.length; ++i) {
		result /= args[i];
	}
	response(result);
};

var dist = function (args, response) {
	var result = args[0]*args[0];
	for(var i=1; i<args.length; ++i) {
		result += args[i]*args[i];
	}
	response(Math.sqrt(result));
};

var load = function (args, response) {
	var result = 0;
	for(var j=0; j<10000; ++j) {
		for(var i=0; i<args.length; ++i) {
			result += Math.sqrt( args[i] * args[i] );
		}
	}
	response(result);
};	

var publish = function publish (args, response){

	var result = 0;
	var ctag;

	//console.log("THE ARGS: " + args);
    rpc.makeRequest('taskQueue', args, function (err, resp){
      	if(err){
        	console.error(err);
        }else {
        	//console.log(resp);
        	response(resp);
    	}
      //reduce for each timeout or response
    });
	//var connection = amqp.createConnection({ url: 'amqp://localhost'});
	//connection.on('ready', function(){

	/*connection.publish('taskQueue', args, {deliveryMode: 2});
 	
	resultQ.subscribe({ack: true, prefetchCount: 1}, function(msg){
		result += msg;
		resultQ.shift();
		resultQ.unsubscribe(ctag);
		//console.log(result);
		response(result);

	}).addCallback(function(ok) { ctag = ok.consumerTag; });
*/
	//});
};

/*
var rpc = new (require('./amqprpc'))(connection);

connection.on("ready", function(){
  console.log("ready");
  var outstanding=0; //counter of outstanding requests

  //do a number of requests
  for(var i=1; i<=10 ;i+=1){
    //we are about to make a request, increase counter
    outstanding += 1;
    rpc.makeRequest('msg_queue', {foo:'bar', index:outstanding}, function response(err, response){
      if(err)
        console.error(err);
      else
        console.log("response", response);
      //reduce for each timeout or response
      outstanding-=1;
      isAllDone();
    });
  }

  function isAllDone() {
    //if no more outstanding then close connection
    if(outstanding === 0){
      connection.end();
    }
  }*/
exports.add = add;
exports.subst = subst;
exports.mult = mult;
exports.div = div;
exports.dist = dist;
exports.load = load;
exports.publish = publish;
exports.start = start;