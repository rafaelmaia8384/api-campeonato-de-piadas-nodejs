const db = require('./api/config/db');
const server = require('./api/config/server').server;
const port = require('./api/config/server').port;

require('./api/v1/routes/router');

db.sync().then(() => {
    server.listen(port, () => {
        console.log(`Campeonato de Piadas API WebService, running on port ${port}...`);
    });
}).catch((error) => {
    console.log(`Error while syncing database: ${error}`);
});