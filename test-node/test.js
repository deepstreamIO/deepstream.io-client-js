"use strict";
var Client_1 = require("../dist/Client");
var ds = new Client_1.Client('ws://localhost:6020');
ds.on('connectionStateChanged', function (a, b) {
    console.log("State:", a, "Data:", b);
});
ds.on('error', function (e) { return console.log(e); });
