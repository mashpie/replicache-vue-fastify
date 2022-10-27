import { join } from '@rnvf/common-esm'
import envSchema from 'env-schema'

const schema = {
  type: 'object',
  properties: {
    httpPort: { default: 3000 },
    httpBind: { default: '127.0.0.1' },
    prefix: { default: '/api' },

    logLevel: { default: 'info' },
    logPretty: { default: false },

    mongoServer: { default: '127.0.0.1:27017' },
    mongoDb: { default: 'rnvf-dev' }
  }
}

const config = envSchema({
  schema: schema,
  dotenv: true
})

config.mongoUri = `mongodb://${config.mongoServer}/${config.mongoDb}`

config.autoloads = [
  join(import.meta.url, 'plugins'),
  join(import.meta.url, 'services')
]

config.health = {
  exposeStatusRoute: `${config.prefix}/health`
}

export default config
