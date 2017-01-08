import { Client } from "../dist/Client";
import { CLI } from "./cli";

let client = new Client('localhost:6020');
let cli = new CLI();

client.on('connectionStateChanged', () => {
    console.log('Connection state changed', client.connectionState);
});

client.login({username: 'Wolfram'});

/****************************************
 * Record
 ****************************************/
cli.group('record')
    .command('listen', () => {
        client.record.listen('user/.*', (recordName, isSubscribed, response) => {
            console.log('received listener callback', recordName, isSubscribed, response);
        })
    })
    .command('subscribe', () => {
        client.record.getRecord('user/' + client.createUid());
    });

/****************************************
 * RPC
 ****************************************/
cli.group('rpc')
    .command('provide', () => {
        client.rpc.provide('addTwo', (data, response) => {
            console.log("Request:", data.numA, data.numB);
            response.send(data.numA + data.numB);
        });
    })
    .command('one', () => {
        console.time('totalRpcTime');
        client.rpc.make('addTwo', {numA: 3, numB: 43}, (err, result) => {
            console.log("Result:", result);
            console.timeEnd('totalRpcTime');
        });
    })
    .command('many', interval => {
        setInterval(() => {
            console.time('totalRpcTime');
            client.rpc.make('addTwo', {numA: 3, numB: 43}, (err, result) => {
                console.log("Result:", result);
                console.timeEnd('totalRpcTime');
            });
        }, parseInt(interval, 10));
    })
    .command('burst', numberOfMessages => {
        numberOfMessages = parseInt(numberOfMessages, 10);

        let responses = 0,
            i,
            callback = (expected, error, result) => {
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
            client.rpc.make('addTwo', {numA: 3, numB: i}, callback.bind(this, i + 3));
        }
        cli.write('Bursting ' + numberOfMessages);
    });
