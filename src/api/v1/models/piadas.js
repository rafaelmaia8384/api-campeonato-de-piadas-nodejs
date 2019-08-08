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
    nome_usuario: {
        type: type.STRING,
        allowNull: false
    },
    id_blur_image: {
        type: type.INTEGER,
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
    audio_duracao: {
        type: type.INTEGER,
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
    musica_fundo: {
        type: type.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    conteudo_sensivel: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    visualizacoes: {
        type: type.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    premiada: {
        type: type.BOOLEAN,
        defaultValue: false
    },
    upload_ok: {
        type: type.BOOLEAN,
        defaultValue: false
    },
    ativacao_ok: {
        type: type.BOOLEAN,
        defaultValue: false
    },
    ativacao_aparelho: {
        type: type.STRING,
        allowNull: true,
        defaultValue: null
    },
    createdAt: {
        type: type.DATE,
        allowNull: false,
        defaultValue: db.fn('NOW')
    },
    updatedAt: {
        type: type.DATE,
        allowNull: false,
        defaultValue: db.fn('NOW')
    }
}, {
    paranoid: true,
    freezeTableName: true
}, {
    indexes: [
        {
            fields: ['id_piada', 'id_usuario', 'ativacao_aparelho']
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
    nome_usuario: {
        type: type.STRING,
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
    sequelize: db.Sequelize,
    modelPiadas: modelPiadas,
    modelPiadasComentarios: modelPiadasComentarios,
    modelPiadasEstrelas: modelPiadasEstrelas
};