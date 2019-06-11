const router = require('../../config/server').server;
const apiResponse = require('../utils/apiUtils').apiResponse;
const apiCheckToken = require('../utils/apiUtils').apiCheckToken;
const usuarios = require('../controllers/usuarios');

router.get('/api/v1/usuarios', apiCheckToken, (request, response, next) => {
    usuarios.buscarUsuarios().then(data => {
            response.send(200, apiResponse(0, 'Busca realizada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha ao buscar -> ' + error));
        });
    next();
});

router.post('/api/v1/usuarios/login', (request, response, next) => {
    usuarios.login(request.body.email, request.body.password).then(data => {
            if (data.length > 0) {
                response.send(200, apiResponse(0, 'Login efetuado.', data));
            }
            else {
                response.send(500, apiResponse(1, 'Email ou senha inválidos.'));    
            }
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha ao realizar login -> ' + error));
        });
    next();
});

module.exports = router;