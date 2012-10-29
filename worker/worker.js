var amqp = require('amqp');

var connection = amqp.createConnection({url: rabbitUrl()});

var http = require('http');
http.createServer(function (req, res){}).listen(process.env.VCAP_APP_PORT);


function rabbitUrl() {
  if (process.env.VCAP_SERVICES) {
    conf = JSON.parse(process.env.VCAP_SERVICES);
    console.log(conf['rabbitmq-2.4'][0].credentials.url);
    return conf['rabbitmq-2.4'][0].credentials.url;
  }
  else {
    return "amqp://localhost";
  }
}

connection.on('ready', function(){
    connection.queue('taskQueue', function(queue)
    {
        console.log(' [*] Waiting for messages. To exit press CTRL+C');

        queue.subscribe(function(msg, headers, deliveryInfo, m)
        {
            var body = msg;
            var result = body[0];

            for(var i=1; i<body.length; ++i) {
                result += body[i];
            }

            //console.log(result);

            connection.publish(m.replyTo, result, {
                contentType: 'application/json', // This may also be m.contentType
                correlationId: m.correlationId
            });
        });
    });

});
