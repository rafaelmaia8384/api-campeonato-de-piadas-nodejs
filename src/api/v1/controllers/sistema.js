const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sistema = require('../models/sistema').modelSistema;
const sistemaCodigos = require('../models/sistema').modelSistemaCodigos;
const options = require('../../config/options');

function ativarCodigo(codigo) { 
    return new Promise((resolve, reject) => {
        sistemaCodigos.findAll({
            where: {
                id_usuario: codigo.id_usuario,
                id_piada: codigo.id_piada
            },
            limit: 1
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

function obterPremio() {
    return new Promise((resolve, reject) => {
        sistema.findOne({
            where: {
                id: 1
            }
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

module.exports = { 
    ativarCodigo: ativarCodigo,
    obterPremio: obterPremio
};