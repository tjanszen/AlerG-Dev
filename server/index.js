var Hapi = require('hapi');
var server = new Hapi.Server();
var routes = require('./config/routes');

server.connection({port:8080});

server.route(routes);
server.start(function() {
  console.log('info', server.info.uri);
});

module.exports = server;
