const router = require('../../config/server').server;
const apiResponse = require('../utils/apiUtils').apiResponse;
const apiCheckToken = require('../utils/apiUtils').apiCheckToken;
const usuarios = require('../controllers/usuarios');

//Fazer login e cadastrar se não existir no banco
router.get('/api/v1/usuarios/:googleId/:username/:email', (request, response, next) => {
    usuarios.login(request.params.googleId, request.params.username, request.params.email).then((data) => {
            response.send(200, apiResponse(0, 'Usuário logado.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

module.exports = router;