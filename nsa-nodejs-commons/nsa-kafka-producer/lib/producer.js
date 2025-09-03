/**
 * Created by senthil on 03/02/17.
 */

var events = require('events');
var kafka = require('kafka-node'),
    HighLevelProducer = kafka.HighLevelProducer,
    client = new kafka.Client(global.config.kafka.host+':'+global.config.kafka.port),
    producer = new HighLevelProducer(client);

var Producer = function f(options) {
    // var self = this;
};

Producer.sendMsg = function(vehicle) {
    console.info('sendMsg...', vehicle);
    producer.on('ready', function () {
        producer.send([
            {topic: 'VehicleLocation', partition: 0, messages: [vehicle]}
        ], function (err, result) {
            console.log(err || result);
            process.exit();
        });
    });
}


/*

var em = new events.EventEmitter();

em.emit('Logger', 'This is my first Node.js event emitter example.');

//kafka Logger Producer
em.on('Logger', function (req, data) {
    logEvent(req, data);
});

//kafka Notification Producer
em.on('Notification', function (req, data) {
    emailEvent(req, data);
    smsEvent(req, data);
    pushNotificationEvent(req, data);
});

//kafka Email Producer
em.on('Email', function (req, data) {
    emailEvent(req, data);
});

//kafka SMS Producer
em.on('SMSP', function (req, data) {
    smsEvent(req, data);
});

//kafka Push Notification Producer
em.on('PushNotification', function (req, data) {
    pushNotificationEvent(req, data);
});


function logEvent(req, data) {
    console.info('kafka log event = ', this.config.kafka.topic.logger);
    payloads = [{ topic: this.config.kafka.topic.logger, messages: data, partition: 0 }]
    producer.send(payloads, function (err, data) {
        console.log('Logged = ', data);
    });
}

function emailEvent(req, data) {
    console.info('kafka email event = ', this.config.kafka.topic.logger);
}

function smsEvent(req, data) {
    console.info('kafka sms event = ', this.config.kafka.topic.logger);
}

function pushNotificationEvent(req, data) {
    console.info('kafka push notification = ', this.config.kafka.topic.logger);
}

module.exports = em;*/
module.exports = Producer;