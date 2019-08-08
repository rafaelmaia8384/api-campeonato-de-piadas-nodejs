const router = require('../../config/server').server;
const apiResponse = require('../utils/apiUtils').apiResponse;
const apiCheckToken = require('../utils/apiUtils').apiCheckToken;
const sistema = require('../controllers/sistema');

router.post('/api/v1/sistema/ativarcodigo', (request, response, next) => {
    sistema.ativarCodigo(request.params).then(data => {
            response.send(200, apiResponse(0, 'Busca realizada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

module.exports = router;