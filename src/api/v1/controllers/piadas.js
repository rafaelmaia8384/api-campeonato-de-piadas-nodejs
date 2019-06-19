const faker = require('faker');
const AWS = require('aws-sdk');
const options = require('../../config/options');
const Op = require('../models/piadas').Op;
const piadas = require('../models/piadas').modelPiadas;
const piadasComentarios = require('../models/piadas').modelPiadasComentarios;
const piadasComentariosLikes = require('../models/piadas').modelPiadasComentariosLikes;
const piadasEstrelas = require('../models/piadas').modelPiadasEstrelas;
const apiUtils = require('../utils/apiUtils');

function cadastrarPiada(piada) {
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
                url_audio: url_audio,
                url_img_busca: url_img_busca,
                url_img_principal: url_img_principal
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

function listarPiadasUltimas(pagina, lastId) {
    return new Promise((resolve, reject) => {

        console.log('Last id:' + lastId);

        piadas.findAll({
            where: {
                id: {
                    [Op.lt]: lastId == 0 ? 9999999 : lastId
                }
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
        piadas.findAll({
            where: {},
            offset: (pagina-1) * options.optSearchLimit,
            limit: options.optSearchLimit,
            order: [['id', 'DESC']]
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

function listarPiadasMes(pagina) {
    return new Promise((resolve, reject) => {
        piadas.findAll({
            where: {},
            offset: (pagina-1) * options.optSearchLimit,
            limit: options.optSearchLimit,
            order: [['id', 'DESC']]
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

function listarPiadasPremiadas(pagina) {
    return new Promise((resolve, reject) => {
        piadas.findAll({
            where: {},
            offset: (pagina-1) * options.optSearchLimit,
            limit: options.optSearchLimit,
            order: [['id', 'DESC']]
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

function seed() {
    return new Promise((resolve, reject) => {
        for (var i = 0; i < 500; i++) {
            const info = {
                id_piada: apiUtils.apiGenerateId(),
                id_usuario: 3443907009,
                titulo: faker.random.words(randRange(5, 15)),
                palavras_chave: faker.random.words(randRange(4, 10)),
                audio_file: 'audio-awodiahdiawgdwadanoiudnaiodawihda.mp3'
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
    listarPiadasUltimas: listarPiadasUltimas,
    listarPiadasSemana: listarPiadasSemana,
    listarPiadasMes: listarPiadasMes,
    listarPiadasPremiadas: listarPiadasPremiadas,
    seed: seed
}; 