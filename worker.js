var amqp = require('amqp');
var amqp_hacks = require('./amqp_hacks.js');
var util = require('util');

var connection = amqp.createConnection({url: 'amqp://localhost'});

    connection.on('ready', function(){
    connection.queue('taskQueue', /*{autoDelete: false, durable: true}, */function(queue)
    {

        console.log(' [*] Waiting for messages. To exit press CTRL+C');

        queue.subscribe(function(msg, headers, deliveryInfo, m)
        {
            var body = msg;

            var result = body[0];
            for(var i=1; i<body.length; ++i) {
                result += body[i];
            }
            //queue.shift();
            //console.log(result);
            connection.publish(m.replyTo, result, {
                contentType: 'application/json',
                correlationId: m.correlationId
            });
        });
    });



    /*
cnn.on('ready', function(){
  console.log("listening on msg_queue");
  cnn.queue('msg_queue', function(q){
      q.subscribe(function(message, headers, deliveryInfo, m){
        util.log(util.format( deliveryInfo.routingKey, message));
        //return index sent
        cnn.publish(m.replyTo, {response:"OK", index:message.index}, {
            contentType:'application/json',
            contentEncoding:'utf-8',
            correlationId:m.correlationId
          });
      });
  });
});
*/

});