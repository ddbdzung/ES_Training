require('dotenv').config()

const DEVELOPMENT = 'development'
const PRODUCTION = 'production'

const nodeEnv = process.env.NODE_ENV ?? DEVELOPMENT

module.exports = {
  NODE_ENV: nodeEnv,
  ES_HOST: nodeEnv === PRODUCTION ? process.env.ES_HOST : 'http://localhost:9200',
  ES_INDEX: nodeEnv === PRODUCTION ? process.env.ES_INDEX : 'product',
  ES_TYPE: nodeEnv === PRODUCTION ? process.env.ES_TYPE : '_doc',
}
