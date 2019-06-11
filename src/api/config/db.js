const Sequelize = require('sequelize');

const sequelize = new Sequelize('campeonato-de-piadas', 'rafaelmac', '', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    timezone: 'America/Sao_Paulo',
    dialectOptions: {
        supportBigNumbers: true
    }
});

module.exports = sequelize;