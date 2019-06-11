const db = require('../../config/db');
const type = db.Sequelize;

let modelUsuarios = db.define('usuarios', {
    id_usuario: {
        type: type.BIGINT,
        allowNull: false
    },
    oauth_provider: {
        type: type.STRING,
        allowNull: false
    },
    oauth_uid: {
        type: type.STRING,
        allowNull: false
    },
    username: {
        type: type.STRING,
        allowNull: false
    },
    email: {
        type: type.STRING,
        allowNull: false
    },
    password: {
        type: type.STRING,
        allowNull: false
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
    modelUsuarios: modelUsuarios
};