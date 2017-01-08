import { Client } from "../dist/Client";

const ds = new Client('ws://localhost:6020');

ds.on('connectionStateChanged', (a, b) => {
    console.log("State:", a, "Data:", b)
});

ds.on('error', e => console.log(e));
