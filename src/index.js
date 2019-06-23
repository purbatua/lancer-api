import 'babel-polyfill'
import app from './app'
import config from './config'

const { PORT = config.port } = process.env
const SERVER = config.baseurl

app.listen(PORT, () => console.log(`Listening on port ${PORT}, server run at ${SERVER}`)) // eslint-disable-line no-console
