const cron = require('node-cron');
const db = require('./api/config/db');
const server = require('./api/config/server').server;
const port = require('./api/config/server').port;

require('./api/v1/routes/router');

db.sync().then(() => {
    server.listen(port, () => {
        console.log(`Campeonato de Piadas API WebService, running on port ${port}...`);
        //Aumentar o número de visualizações a cada 10 minutos
        cron.schedule('*/10 * * * *', () => {
            db.query('UPDATE piadas SET visualizacoes = visualizacoes + FLOOR( RAND() * 10 ) WHERE deletedAt IS NULL;');
        });
        //Inserir estrelas entre 3.0 e 5.0 a cada 30 minutos (probabilidade de 10% de afetar uma piada)
        cron.schedule('*/30 * * * * ', () => {
            db.query('SELECT id_piada FROM piadas WHERE deletedAt IS NULL ORDER BY createdAt DESC LIMIT 100;').then(([results, metadata]) => {
                console.log('CRON JOB!');
                for (var i = 0; i < results.length; i++) {
                    if (Math.random() > 0.1) continue;
                    var id_piada = results[i]['id_piada'];
                    db.query(`INSERT INTO piadas_estrelas ( id_piada, id_aparelho, estrelas, deletedAt ) VALUES ( ${id_piada}, 'server', FLOOR( 3 + RAND() * 3 ), NULL );`);
                }
            });
        });
    });
}).catch((error) => {
    console.log(`Error while syncing database: ${error}`);
});