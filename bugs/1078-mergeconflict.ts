var recordName = 'test';

import { DeepstreamClient } from '../src/deepstream-client'
const client = new DeepstreamClient('ws://localhost:6020')

client.login({}, function () {
    const currentUserRecord = client.record.getRecord(recordName)
    currentUserRecord.whenReady(function (record) {
        var updateRecord = function() {
            currentUserRecord.set({ data: Math.random() }, err => {
                if (err) {
                    console.log('Record set with error:', err)
                } else {
                    console.log('Record set without error')
                }
            });
        }
        setInterval(updateRecord, 20);
    });
});
