const router = require('../../config/server').server;
const apiResponse = require('../utils/apiUtils').apiResponse;
const piadas = require('../controllers/piadas');

//Cadastrar piada
router.post('/api/v1/piadas', (request, response, next) => {
    piadas.cadastrarPiada(request.params).then(data => {
            response.send(200, apiResponse(0, 'Piada cadastrada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha ao cadastrar -> ' + error));
        });
    next();
});

//Ultimas piadas adicionadas
router.get('/api/v1/piadas/ultimas/:pagina/:lastId', (request, response, next) => {
    piadas.listarPiadasUltimas(request.params.pagina, request.params.lastId).then(data => {
            response.setHeader('Cache-Control', 'max-age=30')
            response.send(200, apiResponse(0, 'Busca realizada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha ao buscar -> ' + error));
        });
    next();
});

//Rank das piadas melhores avaliadas dos últimos 7 dias
router.get('/api/v1/piadas/semana/:pagina', (request, response, next) => {
    piadas.listarPiadasSemana(request.params.pagina, request.query).then(data => {
            response.setHeader('Cache-Control', 'max-age=30')
            response.send(200, apiResponse(0, 'Busca realizada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha ao buscar -> ' + error));
        });
    next();
});

//Rank das piadas melhores avaliadas dos últimos 30 dias
router.get('/api/v1/piadas/mes/:pagina', (request, response, next) => {
    piadas.listarPiadasMes(request.params.pagina, request.query).then(data => {
            response.setHeader('Cache-Control', 'max-age=30')
            response.send(200, apiResponse(0, 'Busca realizada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha ao buscar -> ' + error));
        });
    next();
});

//Piadas premiadas
router.get('/api/v1/piadas/premiadas/:pagina', (request, response, next) => {
    piadas.listarPiadasPremiadas(request.params.pagina, request.query).then(data => {
            response.setHeader('Cache-Control', 'max-age=30')
            response.send(200, apiResponse(0, 'Busca realizada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha ao buscar -> ' + error));
        });
    next();
});

//Gerar conteúdo na tabela de piadas
router.get('/api/v1/piadas/seed', (request, response, next) => {
    piadas.seed().then(data => {
            response.send(200, apiResponse(0, 'Seed realizado.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha ao gerar seed -> ' + error));
        });
    next();
});

module.exports = router;