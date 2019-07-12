import { expect } from 'chai'
import { spy } from 'sinon'
import * as MERGE_STRATEGIES from './merge-strategy'
import { JSONObject } from '../constants'

describe('merge strategies @unit', () => {
  let localData: JSONObject
  let localVersion: number
  describe('remote wins', () => {
    beforeEach(function () {
      this.mergeCallback = spy()
      localVersion = 1
      localData = { type: 'local' }

      MERGE_STRATEGIES.REMOTE_WINS(localData, localVersion, {
        type: 'remote'
      }, 5, this.mergeCallback)

    })

    it('returns the remote data', function () {
      expect(this.mergeCallback.calledOnce)
        .to.equal(true)

      expect(this.mergeCallback.calledWith(null, { type: 'remote' }))
        .to.equal(true)
    })

  })

  describe('local wins', () => {

    beforeEach(function () {
      this.mergeCallback = spy()
      this.record = {
        get () {
          return {
            type: 'local'
          }
        }
      }

      MERGE_STRATEGIES.LOCAL_WINS(localData, localVersion, {
        type: 'remote'
      }, 5, this.mergeCallback)
  })

    it('returns the remote data', function () {
      expect(this.mergeCallback.calledOnce)
        .to.equal(true)

      expect(this.mergeCallback.calledWith(null, { type: 'local' }))
        .to.equal(true)
    })
  })
})
