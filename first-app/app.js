const http = require('http');

const route = require('./routes.js');

// const reqListener = (route);

const server = http.createServer(route);

server.listen(3000);