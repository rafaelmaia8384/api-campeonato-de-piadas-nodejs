const fs = require('fs');
const aws = require('aws-sdk');
const options = require('../../config/options');
const router = require('../../config/server').server;
const apiResponse = require('../utils/apiUtils').apiResponse;

const spacesEndpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com');

const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'TIZQV434FJEY2XQWRHAL',
    secretAccessKey: '/+dqZkgaM5g2LHPdrR4A8M+EfVxxbORtUGPMqAt78aU',
});

router.post('/api/v1/upload', (request, response, next) => {
    if (request.files) {
        for (var key in request.files) {
            if (request.files[key].size / 1024 > options.optMaxUploadFileSizeKb) {
                return response.send(401, apiResponse(1, `O arquivo anexado excedeu o limite de ${options.optMaxUploadFileSizeKb} Kb.`));
            }
            if (!request.files[key].type.startsWith('image/')) {
                return response.send(401, apiResponse(1, 'O arquivo anexado não é uma imagem.'));
            }
        }

        //Upload to DigitalOcean spaces

        fs.readFile(request.files['imagem'].path, (error, data) => {
            if (error) {
                return response.send(500, apiResponse(1, `Erro no envio: ${error}`));
            }
            else {
                let params = {
                    Body: new Buffer(data, 'binary'),
                    Bucket: options.optUploadBucket,
                    Key: 'folder1/filename.jpg',
                    ACL: 'public-read',
                    ContentType: request.files['imagem'].type
                };
        
                s3.putObject(params, (error, data) => {
                    fs.unlink(request.files['imagem'].path, () => {});
                    if (error) {
                        return response.send(500, apiResponse(1, `Erro no envio: ${error}`));
                    }
                    else {
                        return response.send(202, apiResponse(0, 'Arquivo enviado.'));
                    }
                });
            }
        });
    }
    else {
        return response.send(401, apiResponse(0, 'Nenhum arquivo anexado.'));
    }
});

module.exports = router;