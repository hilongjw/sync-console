const NODE_ENV = process.env.NODE_ENV || 'production'

const SERVER_CONFIG = {
    development: {
        DB_CONFIG: 'mongodb://awe:umcover@localhost/umoon',
        PORT: 8666,
        SSL_PORT: 443
    },
    development_backend: {
        DB_CONFIG: 'mongodb://awe:umcover@localhost/umoon',
        PORT: 8666,
        SSL_PORT: 443
    },
    production: {
        DB_CONFIG: 'mongodb://awe:umcover@123.207.146.101:27017/umoon',
        PORT: 8666,
        SSL_PORT: 443
    }
}

const config = SERVER_CONFIG[NODE_ENV] || SERVER_CONFIG.production

module.exports = config