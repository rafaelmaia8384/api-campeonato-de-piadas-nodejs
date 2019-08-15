const Sequelize = require('sequelize');

const sequelize = new Sequelize('campeonato_de_piadas_test', 'root', 'rafael110786MYSQL', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    timezone: 'America/Sao_Paulo',
    charset: 'utf8',
    collate: 'utf8_general_ci',
    dialectOptions: {
        supportBigNumbers: true
    }
});

module.exports = sequelize;