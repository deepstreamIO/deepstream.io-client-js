"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const MERGE_STRATEGIES = require("../../src/record/merge-strategy");
describe('merge strategies @unit', () => {
    let localData;
    let localVersion;
    describe('remote wins', () => {
        beforeEach(function () {
            this.mergeCallback = sinon_1.spy();
            localVersion = 1;
            localData = { type: 'local' };
            MERGE_STRATEGIES.REMOTE_WINS(localData, localVersion, {
                type: 'remote'
            }, 5, this.mergeCallback);
        });
        it('returns the remote data', function () {
            chai_1.expect(this.mergeCallback.calledOnce)
                .to.equal(true);
            chai_1.expect(this.mergeCallback.calledWith(null, { type: 'remote' }))
                .to.equal(true);
        });
    });
    describe('local wins', () => {
        beforeEach(function () {
            this.mergeCallback = sinon_1.spy();
            this.record = {
                get() {
                    return {
                        type: 'local'
                    };
                }
            };
            MERGE_STRATEGIES.LOCAL_WINS(localData, localVersion, {
                type: 'remote'
            }, 5, this.mergeCallback);
        });
        it('returns the remote data', function () {
            chai_1.expect(this.mergeCallback.calledOnce)
                .to.equal(true);
            chai_1.expect(this.mergeCallback.calledWith(null, { type: 'local' }))
                .to.equal(true);
        });
    });
});
//# sourceMappingURL=merge-strategiesSpec.js.map