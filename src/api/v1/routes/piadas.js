const router = require('../../config/server').server;
const apiResponse = require('../utils/apiUtils').apiResponse;
const apiCheckToken = require('../utils/apiUtils').apiCheckToken;
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
    piadas.confirmarPiada(request.params.id_piada).then(data => {
            response.send(200, apiResponse(0, 'Piada confirmada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Ativar piada
router.put('/api/v1/piadas/ativar/:id_piada/:id_aparelho', (request, response, next) => {
    piadas.ativarPiada(request.params.id_piada, request.params.id_aparelho).then(data => {
            response.send(200, apiResponse(0, 'Piada Ativada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, error));
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
router.get('/api/v1/piadas/:id_piada/:id_aparelho', (request, response, next) => {
    piadas.verPiada(request.params.id_piada, request.params.id_aparelho).then(data => {
            response.setHeader('Cache-Control', 'max-age=10');
            response.send(200, apiResponse(0, 'Piada obtida.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Buscar piada por palavras
router.get('/api/v1/piadas/buscar/:palavras', (request, response, next) => {
    piadas.buscarPiadas(request.params.palavras).then(data => {
            response.setHeader('Cache-Control', 'max-age=10');
            response.send(200, apiResponse(0, 'Piadas encontradas.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Votar estrelas na piada pelo ID
router.put('/api/v1/piadas/votacao/:id_piada/:id_aparelho/:estrelas', (request, response, next) => {
    piadas.votarPiada(request.params.id_piada, request.params.id_aparelho, request.params.estrelas).then(data => {
            response.setHeader('Cache-Control', 'max-age=10');
            response.send(200, apiResponse(0, 'Piada votada.', data));
        }).catch(error => {
            response.send(500, apiResponse(1, 'Falha -> ' + error));
        });
    next();
});

//Denunciar piada pelo ID
//Lembrar de confirmar o token do usuário
router.put('/api/v1/piadas/denuncia/:id_piada', (apiCheckToken), (request, response, next) => {
    piadas.denunciarPiada(request.params.id_piada).then(data => {
            response.setHeader('Cache-Control', 'max-age=10');
            response.send(200, apiResponse(0, 'Piada denunciada.', data));
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

module.exports = router;