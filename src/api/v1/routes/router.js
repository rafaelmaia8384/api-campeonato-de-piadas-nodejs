const sistema = require('./sistema');
const usuarios = require('./usuarios');
const piadas = require('./piadas');
const uploads = require('./uploads');

const router = [ 
    sistema,
    usuarios,
    piadas,
    uploads
];

module.exports = router;