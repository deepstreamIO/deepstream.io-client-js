<template>
    <div class="presence">
        <b-card class="square-border" header-tag="header" footer-tag="footer">
            <p class="mb-0 mt-0">
                <strong>Records</strong>
            </p>
            <br>

            <b-row>
                <b-col>
                    <p class="card-desc">...</p>
                </b-col>
            </b-row>
            
            <b-row>
                <b-col>
                    <pre>
                        {{ snapshot }}
                    </pre>
                </b-col>
            </b-row>
            <b-row>
                <b-col lg="6">
                    <b-row>
                        <b-col>
                            <p class="card-desc">Create record</p>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-input-group>
                                <b-form-input class="sm-text" :block="true" size="sm" v-model="record.name" type="text" placeholder="The name of the record"></b-form-input>

                                <!-- Attach Right button Group via slot -->
                                <b-input-group-button slot="right">
                                    <b-button
                                        class="sm-text"
                                        size="sm"
                                        variant="outline-primary"
                                        v-on:click="createRecord" :disabled="record.created">
                                        {{ record.loading ? 'Creating...' : 'Create'}}
                                    </b-button>
                                </b-input-group-button>

                            </b-input-group>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col lg="6">
                    <b-row>
                        <b-col>
                            <p class="card-desc">Check if record exists</p>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-input-group>
                                <b-form-input class="sm-text" :block="true" size="sm" v-model="has.name" type="text" placeholder="The name of the record"></b-form-input>

                                <!-- Attach Right button Group via slot -->
                                <b-input-group-button v-if="has.done" slot="left">
                                    <b-button
                                        class="sm-text"
                                        size="sm"
                                        :variant="has.exists ? 'outline-success' : 'outline-danger'"
                                        disabled> {{ has.exists ? 'YES' : 'NO' }} </b-button>
                                </b-input-group-button>
                                <b-input-group-button slot="right">
                                    <b-button
                                        class="sm-text"
                                        size="sm"
                                        variant="outline-primary"
                                        v-on:click="hasRecord"
                                        :disabled="has.loading"> {{ has.loading ? 'checking...' : 'has' }} </b-button>
                                </b-input-group-button>

                            </b-input-group>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            
            <b-row>
                <b-col>
                    <table class="sm-text">
                        <tbody>
                            <div v-for="r in records">
                                <br>
                                <tr>
                                    <td>
                                        <b-button disabled class="sm-text" size="sm" variant="primary">
                                            <strong>
                                                {{ r.name }}
                                            </strong>
                                        </b-button>
                                    </td>
                                    </td>
                                    <td>
                                        <b-input-group>
                                            <b-form-input
                                                class="sm-text"
                                                :block="true"
                                                size="sm"
                                                v-model="r.subscribePath"
                                                type="text"
                                                placeholder="path"></b-form-input>

                                            <!-- Attach Right button Group via slot -->
                                            <b-input-group-button slot="left">
                                                <b-button
                                                    class="sm-text"
                                                    size="sm"
                                                    variant="outline-primary"
                                                    v-on:click="subscribe(r)"
                                                    > subscribe </b-button>
                                            </b-input-group-button>
                                        </b-input-group>
                                    </td>
                                    <td>
                                        <b-input-group>
                                            <b-input-group-button slot="left">
                                                <b-form-input
                                                    class="sm-text"
                                                    :block="true"
                                                    size="sm"
                                                    v-model="r.set.path"
                                                    type="text"
                                                    placeholder="path"></b-form-input>
                                            </b-input-group-button>

                                            <!-- Attach Right button Group via slot -->
                                            <b-input-group-button slot="right">
                                                <b-button
                                                    class="sm-text"
                                                    size="sm"
                                                    variant="outline-primary"
                                                    @click="setRecord(r)"
                                                    :disabled="r.set.loading"> set </b-button>
                                            </b-input-group-button>
                                            <b-input-group-button slot="left">
                                                <b-form-input
                                                    class="sm-text"
                                                    :block="true"
                                                    size="sm"
                                                    v-model="r.set.data"
                                                    type="text"
                                                    placeholder="data"></b-form-input>
                                            </b-input-group-button>

                                        </b-input-group>
                                    </td>
                                    <td>
                                        <b-button
                                                    class="sm-text"
                                                    size="sm"
                                                    variant="outline-success"
                                                    @click="snapshotRecord(r)"> snapshot </b-button>
                                    </td>
                                </tr>
                                <tr v-for="s in r.subscriptions" :key="s.id">
                                    <td>
                                        <b-button disabled class="sm-text" size="sm" variant="success">
                                            <strong>
                                                {{ r.name }}:{{ s.path }}
                                            </strong>
                                        </b-button>
                                    </td>
                                    <td>
                                        <b-form-input
                                                class="sm-text"
                                                :block="true"
                                                size="sm"
                                                :value="r.updates[s.path].map(x => x.update).join(',')"
                                                type="text"
                                                placeholder="path">
                                        </b-form-input>
                                    </td>
                                    <td>
                                        <b-button
                                            class="sm-text"
                                            size="sm"
                                            variant="link"
                                            v-on:click="unsubscribe(r)"
                                            > unsubscribe </b-button>
                                    </td>
                                </tr>
                            </div>
                        </tbody>
                    </table>
                </b-col>
            </b-row>
            <b-row> <br> </b-row>
            <b-row>
                <b-col>
                    <p class="card-desc">Press play and record memory for potential leaks</p>
                </b-col>
                <b-col lg="2" offset-lg="3">
                    <b-button class="sm-text" :disabled="isPlaying" :checked="isPlaying" size="sm" variant="outline-primary" v-on:click="toggleScenario()">{{isPlaying ? 'Playing...' : 'Play'}}</b-button>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
import { Card } from "bootstrap-vue/es/components"
import * as ds from '../../dist/deepstream.js'

const carRecordScheme = {
    id: null,
    brand: null,
    model: null,
    version: null
}

const recordSubscriptionHandler = function (path, update) {
    console.log(path, ': value has been updated to:', update)
}

const Record = {
    name: '',
    scheme: carRecordScheme,
    subscriptionHandler: recordSubscriptionHandler,
    instance: null,
    latestSnapshot: null
}

const scenarioData = {
    isplaying: false,
    records: [
        Object.assign(Record, {
            name: 'cars/123'
        }),
        Object.assign(Record, {
            name: 'cars/456'
        }),
        Object.assign(Record, {
            name: 'cars/789'
        }),
        Object.assign(Record, {
            name: 'cars/741'
        }),
        Object.assign(Record, {
            name: 'cars/852'
        }),
        Object.assign(Record, {
            name: 'cars/852'
        }),
        Object.assign(Record, {
            name: 'cars/963'
        }),
        Object.assign(Record, {
            name: 'cars/537'
        }),
        Object.assign(Record, {
            name: 'cars/159'
        })
    ]
}

const isDuplicate = (arr, obj, key) => {
    return arr.reduce((acc, o) => {
           if (obj[key] === o[key]) {
               acc = true
           }
       
           return acc
       }, false)
}

export default {
  name: "presence",
  props: ["listener", "client"],
  created () {},
  data () {
    return {
        record: {
            name: '',
            ready: false,
            created: false,
            loading: false,
            instance: null,
            subscribePath: '',
            updates: {},
            subscriptions: [],
            set: {
                path: '',
                data: '',
                loading: false,
                done: false
            },
        },
        has: {
            name: '',
            exists: false,
            loading: false,
            done: true
        },
        records: [],
        snapshot: null,
        scenarioData
    }
  },
  computed: {
      isPlaying: function() {
          return this.$data.scenarioData.isplaying
      }
  },
  methods: {
    resetRecordVm: function () {
        this.$data.record = {
            name: '',
            ready: false,
            created: false,
            loading: false,
            instance: null,
            subscribePath: '',
            updates: {},
            subscriptions: [],
            set: {
                path: '',
                data: '',
                loading: false,
                done: false
            },
        }
    },
    createRecord: function() {
        const comp = this
        if (comp.$data.record.name.length) {
            comp.$data.record.loading = true
            comp.$data.record.instance = comp.client.record.getRecord(comp.$data.record.name)
    
            let isdup = isDuplicate(comp.$data.records, comp.$data.record, 'name')
            
            comp.$data.record.instance.whenReady(() => {
                comp.$data.record.ready = true
                comp.$data.record.created = true
                if (!isdup) {
                    comp.$data.records.push(Object.assign({
                        id: comp.$data.record.length + 1
                    }, comp.$data.record))
                }
                comp.resetRecordVm()
            })
        }
    },
    hasRecord: function() {
        const comp = this
        if (comp.$data.has.name) {
            comp.$data.has.loading = true
            comp.$data.has.done = false
            comp.client.record.has(comp.$data.has.name, (err, exists) => {
                comp.$data.has.exists = exists
                comp.$data.has.loading = false
                comp.$data.has.done = true
            })
        }
    },
    
    subscribe: function (record) {
        const path = record.subscribePath

        if (path) {
            if (!(path in record.updates)) {
                record.updates[path] = []

                record.instance.subscribe(path, update => {
                    record.updates[path].push({id: record.updates[path].length + 1, update})
                })
    
                let isdup = isDuplicate(record.subscriptions, { path }, 'path')
    
                if (!isdup) {
                    record.subscriptions.push({ id: record.subscriptions.length + 1, path })
                }
            }
        }
    },
    
    unsubscribe: function (record) {
        record.instance.unsubscribe(record.subscribePath)
        record.subscribePath = '',
        record.updates = {  }
    },
    
    setRecord: function(record) {
        if (record.set.path.length && record.set.data.length) {
            record.set.loading = true
            record.set.done = false

            record.instance.set(record.set.path, record.set.data, () => {
                record.set.loading = false
                record.set.done = true
                record.set.data = ''
            })
        }
    },

    snapshotRecord: function(record) {
        const comp = this
        comp.client.record.snapshot(record.name, (err, data) => {
            comp.$data.snapshot = JSON.stringify(data)
        })
    },

    toggleScenario: function() {
        this.$data.scenarioData.isplaying = !this.$data.scenarioData.isplaying

        if (this.isPlaying) {
            this.playScenario()
        }
    },

    playScenario: function () {
        this.$data.scenarioData.isplaying = true

        console.log('Playing Events Scenario ...')
    
        const scenario = this.getScenario()

        scenario.createRecords()
        scenario.subscribeToRecords()
        scenario.setDataForRecords()
        scenario.snapshotRecords()
        
        setTimeout(() => {
            scenario.discardRecords()

            this.$data.scenarioData.isplaying = false
            
            console.log('<- done')

        }, 2 * 1000)
        
    },

    getScenario: function () {
        let scenario = {}

        scenario.intervalId = null

        scenario.createRecords = this.__createRecords.bind(this)
        scenario.subscribeToRecords = this.__subscribeToRecords.bind(this)
        scenario.setDataForRecords = this.__setDataForRecords.bind(this, scenario)
        scenario.snapshotRecords = this.__snapshotRecords.bind(this)
        scenario.discardRecords = this.__discardRecords.bind(this, scenario)

        return scenario
    },
    __createRecords: function () {
        for (let record of this.$data.scenarioData.records) {
            record.instance = this.client.record.getRecord(record.name)
        }
    },
    __subscribeToRecords: function () {
        for (let record of this.$data.scenarioData.records) {
            for (let path in record.scheme) {
                record.instance.whenReady(() => {
                    record.instance.subscribe(path, record.subscriptionHandler.bind(null, path))
                })
            }
        }
    },
    __setDataForRecords: function (scenario) {
        const comp = this
        scenario.intervalId = setInterval(() => {
            let i = 0
            for (let record of comp.$data.scenarioData.records) {
                for (let path in record.scheme) {
                    record.instance.whenReady(() => {
                        record.instance.set(path, `${path} ${i}th value`, err => {
                            if (err) {
                                console.log('Error setting value for path', path, err)
                            } else {
                                console.log('Successfully sat value for', path)
                            }
                        })
                    })
                    i++
                }
            }
        }, 50)
    },
    __snapshotRecords: function () {
        for (let record of this.$data.scenarioData.records) {
            this.client.record.snapshot(record.name, (err, data) => {
                record.latestSnapshot = data
            })
        }
    },
    __discardRecords: function (scenario) {
        for (let record of this.$data.scenarioData.records) {
            record.instance.discard()
        }
        
        clearInterval(scenario.intervalId)
    }
  }
};
</script>

<style scoped>
.wrapper {
  padding: 5px;
}
</style>
