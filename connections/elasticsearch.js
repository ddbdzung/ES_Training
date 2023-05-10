const { Client: Client8 } = require('@elastic/elasticsearch')
const { Client: Client6 } = require('es6')

const { ES_HOST } = require('../configs/env')

exports.pingElasticsearch = async client => {
  try {
    const response = await client.ping();
    console.log('Elasticsearch pinged successfully');
  } catch (err) {
    console.error('Failed to ping Elasticsearch:', err);
    throw err
  }
}

exports.createEsClient8 = () => new Client8({
  node: ES_HOST,
})

exports.createEsClient6 = () => new Client6({
  node: ES_HOST,
})
