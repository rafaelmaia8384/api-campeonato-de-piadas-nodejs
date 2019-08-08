const router = require('../../config/server').server;
const apiResponse = require('../utils/apiUtils').apiResponse;
const apiCheckToken = require('../utils/apiUtils').apiCheckToken;
const apiCheckTokenNotBlock = require('../utils/apiUtils').apiCheckTokenNotBlock;
const piadas = require('../controllers/piadas');

//Cadastrar piada
//Lembrar de confirmar o token do usuário
router.post('/api/v1/piadas', (apiCheckToken), (request, response, next) => {
    piadas.cadastrarPiada(request.params, request.usuario).then(data => {
            response.send(200, apiResponse(0, 'Piada cadastrada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Confirmar cadastro da piada
//Lembrar de confirmar o token do usuário
router.put('/api/v1/piadas/:id_piada', (apiCheckToken), (request, response, next) => {
    console.log('confirmar piada (rota)');
    piadas.confirmarPiada(request.params.id_piada).then(data => {
            console.log('confirmar piada (then)');
            response.send(200, apiResponse(0, 'Piada confirmada.', data));
        }).catch(error => {
            console.log('confirmar piada (catch)');
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Excluir piada
//Lembrar de confirmar o token do usuário
router.del('/api/v1/piadas/:id_piada', (apiCheckToken), (request, response, next) => {
    piadas.excluirPiada(request.params.id_piada).then(data => {
            response.send(200, apiResponse(0, 'Piada excluída.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Obter comentários da piada
router.get('/api/v1/piadas/comentarios/:id_piada', (request, response, next) => {
    piadas.obterComentarios(request.params.id_piada).then(data => {
            response.send(200, apiResponse(0, 'Comentários obtidos.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Enviar comentário na piada
//Lembrar de confirmar o token do usuário
router.post('/api/v1/piadas/comentarios/:id_piada', (apiCheckToken), (request, response, next) => {
    piadas.enviarComentario(request.params.id_piada, request.usuario.id_usuario, request.params.comentario).then(data => {
            response.send(200, apiResponse(0, 'Comentário enviado.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Excluir comentário na piada
//Lembrar de confirmar o token do usuário
router.del('/api/v1/piadas/comentarios/:id', (apiCheckToken), (request, response, next) => {
    piadas.excluirComentario(request.params.id, request.usuario.id_usuario).then(data => {
            response.send(200, apiResponse(0, 'Comentário excluído.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Ver piada pelo ID
router.get('/api/v1/piadas/:id_piada', (apiCheckTokenNotBlock), (request, response, next) => {
    var id_usuario = request.usuario ? request.usuario.id_usuario : null; 
    piadas.verPiada(id_usuario, request.params.id_piada).then(data => {
            response.setHeader('Cache-Control', 'max-age=10');
            response.send(200, apiResponse(0, 'Piada obtida.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Votar estrelas na piada pelo ID
//Lembrar de confirmar o token do usuário
router.put('/api/v1/piadas/votacao/:id_piada/:estrelas', (apiCheckToken), (request, response, next) => {
    piadas.votarPiada(request.usuario.id_usuario, request.params.id_piada, request.params.estrelas).then(data => {
            response.setHeader('Cache-Control', 'max-age=10');
            response.send(200, apiResponse(0, 'Piada votada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Piadas enviadas pelo usuário
router.get('/api/v1/piadas/enviadas/:id_usuario', (apiCheckToken), (request, response, next) => {
    piadas.listarPiadasEnviadas(request.params.id_usuario).then(data => {
            response.setHeader('Cache-Control', 'max-age=10');
            response.send(200, apiResponse(0, 'Piadas obtidas.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Ultimas piadas adicionadas
router.get('/api/v1/piadas/ultimas/:lastId', (request, response, next) => {
    piadas.listarPiadasUltimas(request.params.lastId).then(data => {
            response.setHeader('Cache-Control', 'max-age=10')
            response.send(200, apiResponse(0, 'Busca realizada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Rank das piadas melhores avaliadas dos últimos 7 dias
router.get('/api/v1/piadas/semana/:pagina', (request, response, next) => {
    piadas.listarPiadasSemana(request.params.pagina, request.query).then(data => {
            response.setHeader('Cache-Control', 'max-age=10')
            response.send(200, apiResponse(0, 'Busca realizada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Rank das piadas melhores avaliadas dos últimos 30 dias
router.get('/api/v1/piadas/mes/:pagina', (request, response, next) => {
    piadas.listarPiadasMes(request.params.pagina, request.query).then(data => {
            response.setHeader('Cache-Control', 'max-age=10')
            response.send(200, apiResponse(0, 'Busca realizada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Piadas premiadas
router.get('/api/v1/piadas/premiadas/:pagina', (request, response, next) => {
    piadas.listarPiadasPremiadas(request.params.pagina, request.query).then(data => {
            response.setHeader('Cache-Control', 'max-age=10')
            response.send(200, apiResponse(0, 'Busca realizada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Gerar conteúdo na tabela de piadas
router.get('/api/v1/piadas/seed', (request, response, next) => {
    piadas.seed().then(data => {
            response.send(200, apiResponse(0, 'Seed realizado.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

module.exports = router;