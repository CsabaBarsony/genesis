'use strict';

var express    = require('express'),
    app        = express(),
    portNumber = 3001,
    stopping   = false,
    compiler   = require('../client/scripts/compiler.js'),
    watch      = require('watch'),
    targetDir  = './client',
    restricted = [
        '/toolkit.html',
        '/food_manager.html'
    ];

const cluster = require('cluster'),
    sysInfo = require('./openshift/sys-info.js'),
    stopSignals = [
        'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ],
    production = process.env.NODE_ENV == 'production';

cluster.on('disconnect', function(worker) {
    if (production) {
        if (!stopping) {
            cluster.fork();
        }
    } else {
        process.exit(1);
    }
});

function startWorkers() {
    const workerCount = process.env.NODE_CLUSTER_WORKERS || 4;
    console.log(`Starting ${workerCount} workers...`);
    for (let i = 0; i < workerCount; i++) {
        cluster.fork();
    }
    if (production) {
        stopSignals.forEach(function (signal) {
            process.on(signal, function () {
                console.log(`Got ${signal}, stopping workers...`);
                stopping = true;
                cluster.disconnect(function () {
                    console.log('All workers stopped, exiting.');
                    process.exit(0);
                });
            });
        });
    }
}

if (cluster.isMaster) {
    compiler.init();
    startWorkers();

    watch.watchTree(targetDir, function(file, curr, prev) {
        if (typeof file == "object" && prev === null && curr === null) {
            console.log('Watching files in ' + targetDir)
        }
        else {
            if (prev === null) {
                console.log(file + ' created');
            }
            else if (curr.nlink === 0) {
                console.log(file + ' removed');
            }
            else {
                console.log(file + ' changed');
            }
            compiler.init();
        }
    });
} else {
    app.use(restricted, function(req, res, next) {
        var auth;

        if (req.headers.authorization) {
            auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
        }

        if (!auth || auth[0] !== 'user' || auth[1] !== 'pass') {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="Nutrit.com"');
            res.end('Unauthorized');
        } else {
            next();
        }
    });

    app.use(express.static('public'));

    var db = require('./db_connection.js').connect();

    app.get('/api/foods/:category', function(req, res) {
        db.foods.getByCategory(req.params.category, function(error, rows) {
            if(!error) res.json(rows);
            else res.sendStatus(500);
        });
    });

    // IMPORTANT: Your application HAS to respond to GET /health with status 200
    // for OpenShift health monitoring
    app.get('/health', function(req, res) {
        res.sendStatus(200);
    });

    app.get('/info/:option', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.send(JSON.stringify(sysInfo[req.params.option]()));
    });

    app.listen(process.env.NODE_PORT || portNumber, process.env.NODE_IP || 'localhost', function() {
        console.log('Application listening on port ' + portNumber);
    });
}
