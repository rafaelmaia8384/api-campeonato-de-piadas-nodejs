const db = require('../../config/db');
const type = db.Sequelize;

let modelSistema = db.define('sistema', {
    api_versao: {
        type: type.INTEGER,
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

let modelSistemaCodigos = db.define('sistema_codigos', {
    id_usuario: {
        type: type.BIGINT,
        allowNull: false
    },
    id_piada: {
        type: type.BIGINT,
        allowNull: false
    },
    id_aparelho: {
        type: type.STRING,
        allowNull: true,
        defaultValue: null
    },
    confirmado: {
        type: type.BOOLEAN,
        defaultValue: false,
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
}, {
    indexes: [
        {
            fields: ['id_usuario', 'id_piada', 'id_aparelho']
        }
    ]
});

module.exports = {
    modelSistema: modelSistema,
    modelSistemaCodigos: modelSistemaCodigos
};