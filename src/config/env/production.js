module.exports = {
  env: 'production',
  host: 'localhost',
  ip: '127.0.0.1',
  port: process.env.PORT || 3000,
  baseurl: 'https://inventoree-212421.appspot.com',
  seed: false,
  mongo: {
    uri: process.env.MONGOLAB_URI || 'mongodb://localhost/slotip',
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
  cors_whitelist: process.env.CORS_WHITELIST

}