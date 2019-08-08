const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarios = require('../models/usuarios').modelUsuarios;
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

                resolve({
                    id_usuario: usuario.id_usuario, 
                    token: token,
                    enviadas: enviadas,
                    confirmadas: confirmadas,
                    premiadas: premiadas,
                    credito: usuario.credito,
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

function loginOld(email, password) {
    return new Promise((resolve, reject) => {
        usuarios.findAll({
            where: {
                email: email
            },
            limit: 1
        }).then(response => {
            if (response.length > 0) {
                bcrypt.compare(password, response[0].password, (error, result) => {
                    if (error) {
                        reject(error.message);        
                    }
                    else {
                        if (result) {
                            const token = jwt.sign({
                                id_usuario: response[0].id_usuario,
                                email: response[0].email
                            }, options.optJwtSecret, {
                                expiresIn: '1h'
                            });
                            resolve([{ token: token }]);
                        }
                        else {
                            resolve([]);
                        }
                    }
                });
            }
            else {
                resolve([]);
            }
        }).catch(error => {
            reject(error);
        });
    });
}

module.exports = { 
    login: login,
    loginOld: loginOld
};