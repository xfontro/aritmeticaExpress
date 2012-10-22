var amqp = require('amqp');
var amqp_hacks = require('./amqp_hacks.js');

var connection = amqp.createConnection({url: 'amqp://localhost'});

    connection.on('ready', function(){
    connection.queue('taskQueue', {autoDelete: false, durable: true}, function(queue)
    {

        console.log(' [*] Waiting for messages. To exit press CTRL+C');

        queue.subscribe({ack: true, prefetchCount: 1}, 
        function(msg)
        {
            var body = msg;

            var result = body[0];
            for(var i=1; i<body.length; ++i) {
                result += body[i];
            }

            queue.shift();
            console.log(result);
            connection.publish('resultQueue', result, {deliveryMode: 2});
        });
    });

});