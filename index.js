const { DateTime } = require("luxon")
const path = require('path')
const axios = require("axios")

const { ES_INDEX, ES_HOST } = require("./configs/env")
const { makeBody } = require("./utils/measureVelocityCrawl")
const { logToFile, createLogFolder } = require("./utils/logger")

createLogFolder('logs')

const main = async () => {
  const fromDate = '2023-04-01T00:00:00.000Z'
  const untilDate = '2023-04-01T00:00:00.000Z'

  let x = DateTime.fromISO(fromDate)
  let stringOfX = fromDate
  const y = DateTime.fromISO(untilDate)
  // $gte fromDate && $lte untilDate
  const duration = y.diff(x, ['days']).toObject().days + 1
  let totalRatio = 0

  const searchEndpoint = `${ES_HOST}/${ES_INDEX}/_search`
  try {

    while (x <= y) {
      console.log(`Start calculate ratio in ${stringOfX}`)
      console.time('calculating')
      const filePath1 = path.join(__dirname, 'logs', `queryES.json`)
      await logToFile(filePath1, JSON.stringify(makeBody(stringOfX)))

      const { data } = await axios.post(searchEndpoint, makeBody(stringOfX))
      const filePath = path.join(__dirname, 'logs', `result_${DateTime.now().toMillis()}.json`)
      await logToFile(filePath, JSON.stringify(data))

      const ratioPerDay = data?.aggregations?.result?.buckets[0]?.ratio.value
      totalRatio += ratioPerDay

      // Immutable object
      const temp = x.plus({ days: 1 })
      stringOfX = temp.toJSDate().toISOString()
      x = DateTime.fromISO(stringOfX)

      console.timeEnd('calculating')
    }

    const result = +totalRatio * 1.0 / (+duration)
    const filePathResult = path.join(__dirname, 'logs', `final_result.json`)
    await logToFile(filePathResult, JSON.stringify(result))
  } catch (err) {
    throw err
  }
}

main()
  .then(() => {

  })
  .catch(async err => {
    console.error(err)
    const filePath = path.join(__dirname, 'logs', `error.json`)
    await logToFile(filePath, JSON.stringify(err))
  })
