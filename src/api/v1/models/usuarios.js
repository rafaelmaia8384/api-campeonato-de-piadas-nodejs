const db = require('../../config/db');
const type = db.Sequelize;

let modelUsuarios = db.define('usuarios', {
    id_usuario: {
        type: type.BIGINT,
        allowNull: false
    },
    googleId: {
        type: type.STRING,
        allowNull: false
    },
    username: {
        type: type.STRING,
        allowNull: false
    },
    email: {
        type: type.STRING,
        unique: true,
        allowNull: false
    },
    credito: {
        type: type.INTEGER,
        allowNull: false,
        defaultValue: 0
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
}, {
    indexes: [
        {
            fields: ['tokenId']
        }
    ]
});

let modelUsuariosSaques = db.define('usuarios_saques', {
    id_usuario: {
        type: type.BIGINT,
        allowNull: false
    },
    valor: {
        type: type.STRING,
        allowNull: false,
    },
    titular: {
        type: type.STRING,
        allowNull: false,
    },
    banco: {
        type: type.STRING,
        allowNull: false,
    },
    agencia: {
        type: type.STRING,
        allowNull: false,
    },
    conta: {
        type: type.STRING,
        allowNull: false,
    },
    pago: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
}, {
    indexes: [
        {
            fields: ['tokenId']
        }
    ]
});

module.exports = {
    modelUsuarios: modelUsuarios,
    modelUsuariosSaques: modelUsuariosSaques
};