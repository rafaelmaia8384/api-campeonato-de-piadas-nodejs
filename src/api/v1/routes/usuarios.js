const router = require('../../config/server').server;
const apiResponse = require('../utils/apiUtils').apiResponse;
const apiCheckToken = require('../utils/apiUtils').apiCheckToken;
const usuarios = require('../controllers/usuarios');

//Fazer login e cadastrar se não existir no banco
router.get('/api/v1/usuarios/:googleId/:username/:email', (request, response, next) => {
    usuarios.login(request.params.googleId, request.params.username, request.params.email).then((data) => {
            response.send(200, apiResponse(0, 'Usuário logado.', data));
        }).catch(error => {
            console.log(error);
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Verificar se usuário possui crédito para saque
router.get('/api/v1/usuarios/saque', (apiCheckToken), (request, response, next) => {
    usuarios.obterCredito(request.usuario.id_usuario).then(data => {
            response.send(200, apiResponse(0, 'Crédito obtido.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Fazer solicitação do saque
router.post('/api/v1/usuarios/saque', (apiCheckToken), (request, response, next) => {
    usuarios.solicitarSaque(request.params, request.usuario.id_usuario).then(data => {
            response.send(200, apiResponse(0, 'Solicitação efetuada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

module.exports = router;