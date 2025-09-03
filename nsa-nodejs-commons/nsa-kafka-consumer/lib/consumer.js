/**
 * Created by senthil on 10/02/17.
 */
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client(),
    consumer = new Consumer(client, [{ topic: this.config.kafka.topic.logger, partition: 0 }], {autoCommit: false});

consumer.on('message', function (message) {
    console.info('Listening Topic', this.config.kafka.topic.logger);
    console.log('Message = ', message);
});