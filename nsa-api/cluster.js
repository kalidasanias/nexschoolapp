/**
 * Created by senthil on 30/08/16.
 */
var cluster = require('cluster');

if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    console.info('cpuCount = ', cpuCount);

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function () {
        cluster.fork();
    });
} else {
    require('./app');
}