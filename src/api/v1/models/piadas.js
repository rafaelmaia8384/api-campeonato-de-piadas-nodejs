const db = require('../../config/db');
const type = db.Sequelize;

let modelPiadas = db.define('piadas', {
    id_piada: {
        type: type.BIGINT,
        allowNull: false
    },
    id_usuario: {
        type: type.BIGINT,
        allowNull: false
    },
    img_busca: {
        type: type.STRING,
        allowNull: true
    },
    img_principal: {
        type: type.STRING,
        allowNull: true
    },
    audio_file: {
        type: type.STRING,
        allowNull: false
    },
    titulo: {
        type: type.STRING,
        allowNull: false
    },
    palavras_chave: {
        type: type.STRING,
        allowNull: false
    },
    upload_ok: {
        type: type.BOOLEAN,
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
            fields: ['id_piada', 'id_usuario']
        },
        {
            type: 'FULLTEXT', 
            fields: ['titulo', 'palavras_chave'] 
        }
    ]
});

let modelPiadasComentarios = db.define('piadas_comentarios', {
    id_piada: {
        type: type.BIGINT,
        allowNull: false
    },
    id_usuario: {
        type: type.BIGINT,
        allowNull: false
    },
    comentario: {
        type: type.TEXT,
        allowNull: false
    },
    like_up: {
        type: type.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    like_down: {
        type: type.INTEGER,
        defaultValue: 0,
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
            fields: ['id_piada']
        }
    ]
});

let modelPiadasEstrelas = db.define('piadas_estrelas', {
    id_piada: {
        type: type.BIGINT,
        allowNull: false
    },
    id_usuario: {
        type: type.BIGINT,
        allowNull: false
    },
    estrelas: {
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
}, {
    indexes: [
        {
            fields: ['id_piada', 'id_usuario']
        }
    ]
});

module.exports = { 
    Op: db.Sequelize.Op,
    modelPiadas: modelPiadas,
    modelPiadasComentarios: modelPiadasComentarios,
    modelPiadasEstrelas: modelPiadasEstrelas
};