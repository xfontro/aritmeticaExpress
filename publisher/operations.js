var amqp = require('amqp');
var connection;
var rpc;

function rabbitUrl() {
  if (process.env.VCAP_SERVICES) {
    conf = JSON.parse(process.env.VCAP_SERVICES);
    return conf['rabbitmq-2.4'][0].credentials.url;
  }
  else {
    return "amqp://localhost";
  }
}

var start = function (callback){
	connection = amqp.createConnection({ url: rabbitUrl()});
	rpc = new (require('./amqprpc'))(connection);
	connection.on('ready', function(){
		callback();
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

    rpc.makeRequest('taskQueue', args, function (err, resp){
      	if(err){
        	console.error(err);
        }else {
        	console.log(resp);
        	response(resp);
    	}
    });
};

exports.add = add;
exports.subst = subst;
exports.mult = mult;
exports.div = div;
exports.dist = dist;
exports.load = load;
exports.publish = publish;
exports.start = start;