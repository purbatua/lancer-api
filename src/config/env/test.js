module.exports = {
	env: 'test',
  host: 'localhost',
  ip: '127.0.0.1',
  port: process.env.PORT || 3000,
  seed: false,
  mongo: {
    // uri: 'mongodb://localhost/inventoree-dev',
    uri: 'mongodb://localhost/slotip-dev',
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
  }
}