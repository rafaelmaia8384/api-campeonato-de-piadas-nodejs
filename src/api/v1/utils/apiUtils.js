//Este arquivo contém os principais métodos e constantes para
//executar nos serviços da API.

const jwt = require('jsonwebtoken');
const options = require('../../config/options');

const apiCheckToken = (request, response, next) => {
    jwt.verify(request.headers.authorization, options.optJwtSecret, (error, decoded) => {
        if (error) {
            return response.send(401, apiResponse(1, 'Acesso negado: token inválido.'));
        }
        else {
            request.usuario = decoded;
            next();
        }
    });
};

const apiCheckTokenNotBlock = (request, response, next) => {
    jwt.verify(request.headers.authorization, options.optJwtSecret, (error, decoded) => {
        if (error) {
            next();
        }
        else {
            request.usuario = decoded;
            next();
        }
    });
};

function apiResponse(error, msg, data) {
    const response = {
        error: error,
        msg: msg,
        data: data
    };
    return response;
}

function apiGenerateId() {

    var result = '';
    var characters = '0123456789ABCDEF';

    for (var i = 0; i < 8; i++) {
        var char = characters.charAt(Math.floor(Math.random() * characters.length));
        if (i == 0 && char === '0') continue;
        result += char;
    }
    return parseInt(result, 16);
}

function apiGenerateRandomFileName(ext) {

    var result = '';
    var characters = '0123456789ABCDEF';

    for (var i = 0; i < 64; i++) {
        var char = characters.charAt(Math.floor(Math.random() * characters.length));
        if (i == 0 && char === '0') continue;
        result += char;
    }

    return Date.now() + '-' + result + ext;
}

module.exports = {
    apiResponse: apiResponse,
    apiCheckToken: apiCheckToken,
    apiCheckTokenNotBlock: apiCheckTokenNotBlock,
    apiGenerateId: apiGenerateId,
    apiGenerateRandomFileName: apiGenerateRandomFileName
};