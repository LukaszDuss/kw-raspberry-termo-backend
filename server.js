
const Hapi = require('hapi');
const Boom = require('boom');
const ds18b20 = require('ds18b20')

// Create a server with a host and port
const Server = Hapi.server({
    port:8001
});

let sensor1 = '';
let sensor2 = '';
let sensor3 = '';

setInterval(() => {
    ds18b20.temperature('28-0117c1c118ff', function(err, value1) {       
        if (err) sensor1 = null;
        sensor1 = value1;
    });
    ds18b20.temperature('28-0117c1bb98ff', function(err, value2) {       
        if (err) sensor2 = null;
        sensor2 = value2;
    });
    ds18b20.temperature('28-031730bb03ff', function(err, value3) {       
        if (err) sensor3 = null;
        sensor3 = value3;
    });
}, 1000);

// Add the route
Server.route({
    method: 'GET',
    path: '/T/OUT1',
    handler: async function(request) {
        return sensor1 
            ? `Current temperature is ${sensor1}\n` 
            : Boom.notFound('err1...');
    },
    method: 'GET',
    path: '/T/IN',
    handler: async function(request) {
        return sensor2
            ? `Current temperature is ${sensor2}\n` 
            : Boom.notFound('err2...');
    },
    method: 'GET',
    path: '/T/OUT2',
    handler: async function(request) {
        return sensor3 
            ? `Current temperature is ${sensor3}\n` 
            : Boom.notFound('err3...');
    },
    method: 'GET',
    path: '/T/ALL',
    handler: async function(request) {
        return sensor1&&sensor2&&sensor3 
            ? `Current temperature is ${sensor1}, ${sensor2}, ${sensor3}\n` 
            : Boom.notFound('err...');
    }
});

// Start the server
async function start() {

    try {
        await Server.start();
    }
    catch (err) {
        console.log('start error'+err);
        process.exit(1);
    }

    console.log('Server running at:', Server.info.uri);
};

start();



