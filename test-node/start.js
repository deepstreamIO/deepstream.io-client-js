"use strict";
var _this = this;
var Client_1 = require("../dist/Client");
var cli_1 = require("./cli");
var client = new Client_1.Client('localhost:6020');
var cli = new cli_1.CLI();
client.on('connectionStateChanged', function () {
    console.log('Connection state changed', client.connectionState);
});
client.login({ username: 'Wolfram' });
/****************************************
 * Record
 ****************************************/
cli.group('record')
    .command('listen', function () {
    client.record.listen('user/.*', function (recordName, isSubscribed, response) {
        console.log('received listener callback', recordName, isSubscribed, response);
    });
})
    .command('subscribe', function () {
    client.record.getRecord('user/' + client.createUid());
});
/****************************************
 * RPC
 ****************************************/
cli.group('rpc')
    .command('provide', function () {
    client.rpc.provide('addTwo', function (data, response) {
        console.log("Request:", data.numA, data.numB);
        response.send(data.numA + data.numB);
    });
})
    .command('one', function () {
    console.time('totalRpcTime');
    client.rpc.make('addTwo', { numA: 3, numB: 43 }, function (err, result) {
        console.log("Result:", result);
        console.timeEnd('totalRpcTime');
    });
})
    .command('many', function (interval) {
    setInterval(function () {
        console.time('totalRpcTime');
        client.rpc.make('addTwo', { numA: 3, numB: 43 }, function (err, result) {
            console.log("Result:", result);
            console.timeEnd('totalRpcTime');
        });
    }, parseInt(interval, 10));
})
    .command('burst', function (numberOfMessages) {
    numberOfMessages = parseInt(numberOfMessages, 10);
    var responses = 0, i, callback = function (expected, error, result) {
        responses++;
        if (error) {
            cli.write('ERROR + ' + error);
        }
        if (result !== expected) {
            cli.write('Expected ' + expected + ' but was ' + result);
        }
        if (responses === numberOfMessages) {
            console.timeEnd('Burst RPCs ' + numberOfMessages);
        }
    };
    console.time('Burst RPCs ' + numberOfMessages);
    for (i = 0; i < numberOfMessages; i++) {
        client.rpc.make('addTwo', { numA: 3, numB: i }, callback.bind(_this, i + 3));
    }
    cli.write('Bursting ' + numberOfMessages);
});
