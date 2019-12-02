module.exports = {
  env: 'development',
  host: 'localhost',
  ip: '127.0.0.1',
  port: process.env.PORT || 3000,
  baseurl: 'http://localhost:3000',
  seed: false,
  mongo: {
    // uri: 'mongodb://localhost/inventoree-dev',
    // uri: 'mongodb://localhost/slotip-dev',
    uri: 'mongodb://localhost/lancer-dev',
    // uri: 'mongodb://localhost/inventoree-seed',
    options: {
      // useMongoClient: true
    }
  },
  token: {
    secret: 'Slot1p',
    expired: '24h'
  },
  hashid: {
    question: {
      salt: 'Myk',
      length: 5
    }
  },
  cors_whitelist: 'http://localhost:8080'
}
