const faker = require('faker');
const AWS = require('aws-sdk');
const bigInt = require('big-integer');
const seq = require('../../config/db');
const options = require('../../config/options');
const sequelize = require('../models/piadas').sequelize;
const usuarios = require('../models/usuarios').modelUsuarios;
const piadas = require('../models/piadas').modelPiadas;
const piadasComentarios = require('../models/piadas').modelPiadasComentarios;
const piadasEstrelas = require('../models/piadas').modelPiadasEstrelas;
const apiUtils = require('../utils/apiUtils');

function cadastrarPiada(piada, usuario) {
    return new Promise(async(resolve, reject) => {
        do {
            var id_piada = apiUtils.apiGenerateId();
            result = await piadas.findOne({
                where: {
                    id_piada: id_piada
                }
            });
        }
        while(result != null)

        piada.id_usuario = usuario.id_usuario;
        piada.nome_usuario = usuario.username;
        piada.id_piada = id_piada;
        piada.audio_file = apiUtils.apiGenerateRandomFileName('.mp3');

        if (piada.img_busca) piada.img_busca = apiUtils.apiGenerateRandomFileName('.jpg');
        if (piada.img_principal) piada.img_principal = apiUtils.apiGenerateRandomFileName('.jpg');

        piadas.create(piada).then(() => {
            const spacesEndpoint = new AWS.Endpoint(options.optS3EndPoint);
            const s3 = new AWS.S3({
                endpoint: spacesEndpoint,
                accessKeyId: options.optS3AccessKey,
                secretAccessKey: options.optS3SecretKey,
                signatureVersion: 'v4',
                s3ForcePathStyle: true
            });

            var url_audio = s3.getSignedUrl('putObject', {
                Bucket: options.optUploadBucket,
                Expires: 180,
                ContentType: 'audio/mpeg',
                ACL: 'public-read', 
                Key: options.optAppName + '/audios/' + piada.audio_file
            });
    
            var url_img_busca = piada.img_busca ? s3.getSignedUrl('putObject', {
                Bucket: options.optUploadBucket,
                Expires: 180,
                ContentType: 'image/jpeg',
                ACL: 'public-read', 
                Key: options.optAppName + '/imagens/' + piada.img_busca
            }) : null;
    
            var url_img_principal = piada.img_principal ? s3.getSignedUrl('putObject', {
                Bucket: options.optUploadBucket,
                Expires: 180,
                ContentType: 'image/jpeg',
                ACL: 'public-read', 
                Key: options.optAppName + '/imagens/' + piada.img_principal
            }) : null;

            resolve({
                id_piada: id_piada,
                url_audio: url_audio,
                url_img_busca: url_img_busca,
                url_img_principal: url_img_principal
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

function confirmarPiada(id_piada) {
    return new Promise((resolve, reject) => {
        piadas.update({
            upload_ok: true
        },
        {
            where: {
                id_piada: id_piada
            }
        }).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

function ativarPiada(id_piada, id_aparelho) {
    return new Promise(async(resolve, reject) => {
        if (id_piada.length != 8) {
            reject('Código inválido.');
        }
        var aparelhoExistente = await piadas.findOne({
            where: {
                ativacao_aparelho: id_aparelho
            }
        });
        if (aparelhoExistente) {
            reject('Você já utilizou um código de ativação.');
            return;
        }
        id_piada = bigInt(id_piada, 16);
        var piada = await piadas.findOne({
            where: {
                id_piada: id_piada
            }
        });
        if (!piada) {
            reject('Código de ativação inválido.');
            return;
        }
        piadas.update({
            ativacao_ok: true,
            ativacao_aparelho: id_aparelho
        }, {
            where: {
                id_piada: id_piada
            }
        }).then(()=> {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

function excluirPiada(id_piada) {
    return new Promise((resolve, reject) => {
        piadas.update({
            deletedAt: sequelize.fn('NOW')
        }, {
            where: {
                id_piada: id_piada
            }
        }).then(()=> {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

function obterComentarios(id_piada) {
    return new Promise((resolve, reject) => {
        piadasComentarios.findAll({
            where: {
                id_piada: id_piada
            },
            limit: 100,
            order: [['id', 'DESC']]
        }).then((comentarios) => {
            resolve(comentarios);
        }).catch((error) => {
            reject(error);
        });
    });
}

function enviarComentario(id_piada, id_usuario, comentario) {
    return new Promise(async(resolve, reject) => {
        var usuario = await usuarios.findOne({
            where: {
                id_usuario: id_usuario
            }
        });
        if (usuario) {
            var username = usuario.email;
            if (usuario.username && usuario.username != 'null') {
                username = usuario.username;
            }
            piadasComentarios.create({
                id_piada: id_piada,
                id_usuario: id_usuario,
                nome_usuario: username,
                comentario: comentario
            }).then((comentario) => {
                resolve(comentario);
            }).catch((error) => {
                reject(error);
            });
        }
        else {
            reject('Usuário não encontrado.');
        }
    });
}

function excluirComentario(id, id_usuario) {
    return new Promise((resolve, reject) => {
        piadasComentarios.update({
            deletedAt: sequelize.fn('NOW')
        }, {
            where: {
                id: id,
                id_usuario: id_usuario
            }
        }).then(()=> {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

function verPiada(id_piada, id_aparelho) {
    return new Promise((resolve, reject) => {
        piadas.findOne({
            where: {
                id_piada: id_piada
            }
        }).then(async(piada) => {
            if (piada) {
                piadas.increment(['visualizacoes'], {
                    where: {
                        id_piada: id_piada
                    }
                });
                seq.query(`SELECT AVG(estrelas) as media, COUNT(estrelas) as total FROM piadas_estrelas WHERE id_piada = ${id_piada}`).then(([results, metadata]) => {
                    piada = piada.toJSON();
                    piada.media = results[0]['media'] ? results[0]['media'] : 0;
                    piada.votos = results[0]['total'];
                    piada.meu_voto = 0;
                    piadasEstrelas.findOne({
                        where: {
                            id_piada: id_piada,
                            id_aparelho: id_aparelho
                        }
                    }).then((meuVoto) => {
                        if (meuVoto) {
                            piada.meu_voto = meuVoto.estrelas;
                        }
                        resolve(piada)
                    }).catch((error) => {
                        reject(error)
                    });
                }).catch((error) => {
                    reject(error);
                });
            }
            else {
                reject('Piada não encontrada.');
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

function votarPiada(id_piada, id_aparelho, estrelas) {
    return new Promise((resolve, reject) => {
        if (estrelas < 1 || estrelas > 5) {
            reject('Número de estrelas inválido.');
        }
        piadasEstrelas.findOne({
            where: {
                id_piada: id_piada,
                id_aparelho
            }
        }).then((piadaEstrelas) => {
            if (piadaEstrelas) {
                piadaEstrelas.update({
                    estrelas: estrelas
                }).then(() => {
                    resolve();
                }).catch((error) => {
                    reject(error);
                });
            }
            else {
                piadasEstrelas.create({
                    id_piada: id_piada,
                    id_aparelho: id_aparelho,
                    estrelas: estrelas
                }).then(() => {
                    resolve();
                }).catch((error) => {
                    reject(error)
                });
            }
        });
    });
}

function denunciarPiada(id_piada) {
    return new Promise((resolve, reject) => {
        piadas.increment(['denuncias'], {
            where: {
                id_piada: id_piada
            }
        }).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
}

function buscarPiadas(palavras) {
    return new Promise((resolve, reject) => {
        piadas.findAll({
            where: seq.literal([`titulo LIKE "%${palavras}%" OR palavras_chave LIKE "%${palavras}%" AND upload_ok = 1`]),
            order: [['visualizacoes', 'DESC']],
            limit: 50,
        }).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
}

function listarPiadasEnviadas(userId) {
    return new Promise((resolve, reject) => {
        piadas.findAll({
            where: {
                id_usuario: userId,
                upload_ok: true
            },
            //offset: (pagina-1) * options.optSearchLimit,
            limit: 100,
            order: [['id', 'DESC']]
        }).then(response => {
            resolve(response);
            // setTimeout(() => {
            //     resolve(response);
            // }, 10);
        }).catch(error => {
            reject(error);
        });
    });
}

function listarPiadasUltimas(lastId) {
    return new Promise(async(resolve, reject) => {
        piadas.findAll({
            where: {
                id: {
                    [sequelize.Op.lt]: lastId == 0 ? 9999999 : lastId
                },
                upload_ok: true,
            },
            //offset: (pagina-1) * options.optSearchLimit,
            limit: options.optSearchLimit,
            order: [['id', 'DESC']]
        }).then(response => {
            resolve(response);
            // setTimeout(() => {
            //     resolve(response);
            // }, 10);
        }).catch(error => {
            reject(error);
        });
    });
}

function listarPiadasSemana(pagina) {
    return new Promise((resolve, reject) => {
        var offset = pagina * options.optSearchLimit;
        var limit = options.optSearchLimit;
        seq.query(`SELECT piadas.*, AVG(piadas_estrelas.estrelas) as media FROM piadas INNER JOIN piadas_estrelas ON piadas.id_piada = piadas_estrelas.id_piada WHERE piadas_estrelas.createdAt >= DATE(NOW()) - INTERVAL 30 DAY GROUP BY piadas.id ORDER BY piadas.visualizacoes * media DESC LIMIT ${offset}, ${limit};`).then(([results, metadata]) => {
            resolve(results);
        }).catch((error) => {
            reject(error);
        });
    });
}

function listarPiadasPremiadas(pagina) {
    return new Promise((resolve, reject) => {
        piadas.findAll({
            where: {
                premiada: true
            },
            offset: pagina * options.optSearchLimit,
            limit: options.optSearchLimit,
            order: [['premiadaAt', 'DESC']]
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

function seed() {
    return new Promise((resolve, reject) => {
        for (var i = 0; i < 100; i++) {

            var busca = randRange(0, 10) > 5 ? null : 'awodiahdiawgdwadanoiudnaiodawihda.jpg';
            var principal = busca ? 'awodiahdiawgdwadanoiudnaiodawihda.jpg' : null;

            const info = {
                id_piada: apiUtils.apiGenerateId(),
                id_usuario: 3443907009,
                id_blur_image: randRange(1, 350),
                img_busca: busca,
                img_principal: principal,
                titulo: faker.random.words(randRange(5, 15)),
                palavras_chave: faker.random.words(randRange(4, 10)),
                audio_file: 'audio-awodiahdiawgdwadanoiudnaiodawihda.mp3',
            };
            piadas.create(info).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        }
    });
}

function randRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

module.exports = { 
    cadastrarPiada: cadastrarPiada,
    confirmarPiada: confirmarPiada,
    ativarPiada: ativarPiada,
    verPiada: verPiada,
    votarPiada: votarPiada,
    denunciarPiada: denunciarPiada,
    excluirPiada: excluirPiada,
    buscarPiadas: buscarPiadas,
    listarPiadasEnviadas: listarPiadasEnviadas,
    listarPiadasUltimas: listarPiadasUltimas,
    listarPiadasSemana: listarPiadasSemana,
    listarPiadasPremiadas: listarPiadasPremiadas,
    obterComentarios: obterComentarios,
    enviarComentario: enviarComentario,
    excluirComentario: excluirComentario,
    seed: seed
}; 