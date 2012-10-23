var amqp = require('amqp');

var connection = amqp.createConnection({url: 'amqp://localhost'});

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

            connection.publish(m.replyTo, result, {
                contentType: 'application/json',
                correlationId: m.correlationId
            });
        });
    });

});