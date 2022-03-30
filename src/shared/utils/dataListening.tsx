import {runQuery} from 'src/shared/apis/query'
import {LoadingState} from 'src/homepageExperience/components/ConnectionInformation'

export const TIMEOUT_MILLISECONDS = 60000
export const TIMER_WAIT = 1000

export const continuouslyCheckForData = (orgID, bucket, updateResponse) => {
  const startTime = Date.now()

  const intervalId = setInterval(() => {
    try {
      const status = checkForData(orgID, bucket)
      status.then(value => {
        if (value === LoadingState.Done) {
          updateResponse(LoadingState.Done)
          clearInterval(intervalId)
          return
        }
        const timePassed = Date.now() - startTime

        if (timePassed > TIMEOUT_MILLISECONDS) {
          updateResponse(LoadingState.NotFound)
          clearInterval(intervalId)
        }
      })
    } catch {
      updateResponse(LoadingState.Error)
      clearInterval(intervalId)
    }
  }, TIMER_WAIT)

  return intervalId
}

export const checkForData = async (orgID, bucket): Promise<LoadingState> => {
  const script = `from(bucket: "${bucket}")
      |> range(start: -1h)`

  const result = await runQuery(orgID, script).promise

  if (result.type !== 'SUCCESS') {
    throw new Error(result.message)
  }

  // if the bucket is empty, the CSV returned is '\r\n' which has a length of 2
  // so instead,  we check for the trimmed version.
  const responseLength = result.csv.trim().length

  if (responseLength > 1) {
    return LoadingState.Done
  }

  return LoadingState.NotFound
}
