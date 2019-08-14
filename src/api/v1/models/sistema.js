const db = require('../../config/db');
const type = db.Sequelize;

let modelSistema = db.define('sistema', {
    api_versao: {
        type: type.INTEGER,
        allowNull: false
    },
    premio: {
        type: type.INTEGER,
        allowNull: false
    },
    premio_data: {
        type: type.STRING,
        allowNull: true,
    },
    createdAt: {
        type: type.DATE,
        allowNull: false,
        defaultValue: db.fn('NOW'),
    },
    updatedAt: {
        type: type.DATE,
        allowNull: false,
        defaultValue: db.fn('NOW'),
    }
}, {
    paranoid: true,
    freezeTableName: true
});

module.exports = {
    modelSistema: modelSistema
};