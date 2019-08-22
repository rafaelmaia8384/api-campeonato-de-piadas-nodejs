const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarios = require('../models/usuarios').modelUsuarios;
const usuariosSaques = require('../models/usuarios').modelUsuariosSaques;
const piadas = require('../models/piadas').modelPiadas;
const options = require('../../config/options');
const apiUtils = require('../utils/apiUtils');

function login(googleId, username, email) { 
    return new Promise((resolve, reject) => {
        usuarios.findOne({
            where: {
                googleId: googleId,
                username: username,
                email: email
            },
        }).then(async (usuario) => {
            if (usuario) {
                const token = jwt.sign({
                    id_usuario: usuario.id_usuario,
                    username: username
                }, options.optJwtSecret);

                var enviadas = await piadas.count({
                    where: {
                        id_usuario: usuario.id_usuario,
                        upload_ok: true
                    }
                });

                var confirmadas = await piadas.count({
                    where: {
                        id_usuario: usuario.id_usuario,
                        upload_ok: true,
                        ativacao_ok: true
                    }
                });

                var premiadas = await piadas.count({
                    where: {
                        id_usuario: usuario.id_usuario,
                        upload_ok: true,
                        ativacao_ok: true,
                        premiada: true
                    }
                });

                var visualizacoes = await piadas.sum('visualizacoes', {
                    where: {
                        id_usuario: usuario.id_usuario,
                        upload_ok: true
                    }
                });

                var saques_solicitados = await usuariosSaques.findAll({
                    where: {
                        id_usuario: usuario.id_usuario,
                    }
                });

                resolve({
                    id_usuario: usuario.id_usuario, 
                    token: token,
                    enviadas: enviadas ? enviadas : 0,
                    confirmadas: confirmadas ? confirmadas : 0,
                    premiadas: premiadas ? premiadas : 0,
                    credito: usuario.credito,
                    saques_solicitados: saques_solicitados ? saques_solicitados : 0,
                    visualizacoes: visualizacoes ? visualizacoes : 0
                });
            }
            else {
                do {
                    var id_usuario = apiUtils.apiGenerateId();
                    result = await usuarios.findOne({
                        where: {
                            id_usuario: id_usuario
                        }
                    });
                }
                while(result != null)
                usuarios.create({
                    id_usuario: id_usuario,
                    googleId: googleId,
                    username: username,
                    email: email
                }).then((usuario) => {
                    const token = jwt.sign({
                        id_usuario: usuario.id_usuario,
                        username: username
                    }, options.optJwtSecret);
                    resolve({id_usuario: usuario.id_usuario, token: token});
                }).catch((error) => {
                    reject(error);
                });
            };
        }).catch((error) => {
            reject(error);
        });
    });
}

function obterCredito(id_usuario) {
    return new Promise(async(resolve, reject) => {
        usuarios.findOne({
            where: {
                id_usuario: id_usuario,
            },
            attributes: ['credito']
        }).then((result) => {
            if (result) {
                resolve(result);
            }
            else {
                reject();
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

function solicitarSaque(dados, id_usuario) {
    return new Promise(async(resolve, reject) => {
        var credito = await usuarios.findOne({
            where: {
                id_usuario: id_usuario
            }
        });
        credito = credito.toJSON();
        if (credito.credito == 0) {
            reject('Acesso negado.');
            return;
        }
        dados.id_usuario = id_usuario;
        dados.valor = credito.credito;
        usuariosSaques.create(dados).then(() => {
            usuarios.update({
                credito: 0
            }, {
                where: {
                    id_usuario: id_usuario
                }
            });
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

module.exports = { 
    login: login,
    obterCredito: obterCredito,
    solicitarSaque: solicitarSaque
};