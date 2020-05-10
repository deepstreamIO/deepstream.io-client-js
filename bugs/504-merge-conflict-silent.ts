import { DeepstreamClient } from '../src/deepstream-client'
import { MergeStrategy } from '../src/record/merge-strategy'
const client = new DeepstreamClient('ws://localhost:6020')

const customMergeStrategy: MergeStrategy = (
  localValue,
  localVersion,
  remoteValue,
  remoteVersion,
  callback
) => {
  callback('No conflicts allowed', {})
}

client.login({}, async () => {
  const record = client.record.getRecord('hello-world')
  record.setMergeStrategy(customMergeStrategy)
  while (true) {
    try {
      await record.setWithAck({time: Date.now()})
      console.log('done')
    } catch (e) {
      console.log('error happened', e)
    }
  }
})