const restify = require('restify');
const port = process.env.PORT || 3000;
const server = restify.createServer();

server.use(restify.plugins.queryParser());

server.use(restify.plugins.bodyParser({
    mapParams: true,
    mapFiles: false,
    overrideParams: false
}));

server.on('NotFound', function(request, response){
    response.send(404, {
        error: 1,
        msg: 'Acesso negado.'
    });
});

server.on('MethodNotAllowed', function(request, response){
    response.send(404, {
        error: 1,
        msg: 'Acesso negado.'
    });
});

module.exports = { 
    server: server, 
    port: port
};