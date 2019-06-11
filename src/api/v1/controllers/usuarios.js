const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarios = require('../models/usuarios').modelUsuarios;
const options = require('../../config/options');

function buscarUsuarios() { 
    return new Promise((resolve, reject) => {
        usuarios.findAll().then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

function login(email, password) {
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
    buscarUsuarios: buscarUsuarios,
    login: login
};