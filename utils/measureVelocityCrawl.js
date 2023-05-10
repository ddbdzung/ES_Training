const { DateTime } = require('luxon')

/**
 * 
 * @param {String} fromDate ISOString: 2023-04-29T00:00:00.000Z
 * @returns request body
 */
exports.makeBody = fromDate => {
  const x = DateTime.fromISO(fromDate)
  const y = x.plus({ days: 1 })
  const nextDate = y.toJSDate().toISOString()

  return {
    "size": 0,
    "query": {
      "match_all": {}
    },
    "aggs": {
      "result": {
        "terms": {
          "script": "'Bucket script at top-level aggregation'"
        },
        "aggs": {
          "filtered_products_count": {
            "filter": {
              "bool": {
                "must": [
                  {
                    "range": {
                      "system_updated_time": {
                        "gte": fromDate,
                        "lte": nextDate
                      }
                    }
                  },
                  {
                    "range": {
                      "system_created_time": {
                        "lt": fromDate
                      }
                    }
                  }
                ]
              }
            },
            "aggs": {
              "count": {
                "cardinality": {
                  "field": "listing_id.keyword"
                }
              }
            }
          },
          "docs_before_date": {
            "filter": {
              "range": {
                "system_updated_time": {
                  "lt": fromDate
                }
              }
            },
            "aggs": {
              "docs_before_date_alive": {
                "filter": {
                  "match_phrase": {
                    "alive": true
                  }
                },
                "aggs": {
                  "count": {
                    "cardinality": {
                      "field": "listing_id.keyword"
                    }
                  }
                }
              }
            }
          },
          "ratio": {
            "bucket_script": {
              "buckets_path": {
                "filtered_count": "filtered_products_count>count",
                "total_count": "docs_before_date>docs_before_date_alive>count"
              },
              "script": "params.filtered_count * 1.0 / params.total_count"
            }
          }
        }
      }
    }
  }
}
