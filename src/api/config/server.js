const fs = require('fs');
const restify = require('restify');
const throttle = require('micron-throttle');
const port = process.env.PORT || 3000;
const server = restify.createServer({
    key: fs.readFileSync(__dirname + '/ssl/server.key', 'utf8'),
    certificate: fs.readFileSync(__dirname + '/ssl/server.cert', 'utf8')
});

server.use(restify.plugins.queryParser());

server.use(restify.plugins.bodyParser({
    mapParams: true,
    mapFiles: false,
    overrideParams: false
}));

// const rateLimit = throttle({
//     burst: 100,
//     rate: 10,
//     ip: true
// });

// server.use(rateLimit);

server.pre((request, response, next) => {
    response.charSet('utf-8');
    next();
});

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