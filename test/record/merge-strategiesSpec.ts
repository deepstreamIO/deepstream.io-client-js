import { expect } from 'chai'
import { spy } from 'sinon'
import * as MERGE_STRATEGIES from '../../src/record/merge-strategy'

describe('merge strategies @unit', () => {
  describe('remote wins', () => {
    beforeEach(function () {
      this.mergeCallback = spy()
      this.record = {
        get () {
          return {
            type: 'remote'
          }
        }
      }

      MERGE_STRATEGIES.REMOTE_WINS(this.record, {
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

      MERGE_STRATEGIES.LOCAL_WINS(this.record, {
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
