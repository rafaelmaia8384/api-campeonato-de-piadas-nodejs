const OPT_SEARCH_LIMIT = 15; //15 resultados por página
const OPT_MAX_SESSION_TIME = 30; //30 minutos de sessão

const OPT_JWT_SECRET = 'jwt-campeonato-de-piadas-secret';

const OPT_UPLOAD_BUCKET = 'webcontent';
const OPT_APP_NAME = 'campeonato-de-piadas';
const OPT_S3_END_POINT = 'sfo2.digitaloceanspaces.com'
const OPT_S3_ACCESS_KEY = 'MLMK6NTYYC5242Y3VAWU';
const OPT_S3_SECRET_KEY = '52OSbfaK1/4V6xPYyokT3AxrSym8sCEUvaG5rEX5IsI';

module.exports = {
    optJwtSecret: OPT_JWT_SECRET,
    optSearchLimit: OPT_SEARCH_LIMIT,
    optMaxSessionTime: OPT_MAX_SESSION_TIME,
    optUploadBucket: OPT_UPLOAD_BUCKET,
    optAppName: OPT_APP_NAME,
    optS3EndPoint: OPT_S3_END_POINT,
    optS3AccessKey: OPT_S3_ACCESS_KEY,
    optS3SecretKey: OPT_S3_SECRET_KEY
}