<template>
    <div class="presence">
        <b-card class="square-border" header-tag="header" footer-tag="footer">
            <p class="mb-0 mt-0">
                <strong>Records</strong>
            </p>
            <br>

            <Listening :members="listening.members" :listen="listen" :unlisten="unlisten" />

            <b-row>
                <b-col lg="3">
                    <p class="card-desc" v-if="snapshot.value ? snapshot.value.length : false" > snapshot of {{ snapshotRecordName }}: </p>
                </b-col>
                <b-col lg="5">
                    <pre class="sm-text">{{snapshot.value}}</pre>
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
                    <b-row> <br> </b-row>
                    <b-row>
                        <b-col>
                            <b-input-group>
                                <b-form-input class="sm-text" :block="true" size="sm" v-model="snapshot.name" type="text" placeholder="The name of the record"></b-form-input>

                                <b-input-group-button slot="right">
                                    <b-button
                                        class="sm-text"
                                        size="sm"
                                        variant="outline-primary"
                                        v-on:click="snapshotRecord"> snapshot </b-button>
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
                                    <td v-if="!r.subscription.isSubscribed">
                                        <b-button
                                            class="sm-text"
                                            size="sm"
                                            variant="outline-primary"
                                            v-on:click="subscribe(r)"> subscribe </b-button>
                                    </td>
                                    
                                    <td v-if="r.subscription.isSubscribed">
                                        <b-button
                                            class="sm-text"
                                            size="sm"
                                            variant="outline-primary"
                                            v-on:click="unsubscribe(r)"> unsubscribe </b-button>
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
                                </tr>
                                <tr><br></tr>
                                <b-row>
                                    <b-col lg="8">
                                        <pre class="sm-text">{{r.subscription.latestUpdate}}</pre>
                                    </b-col>
                                </b-row>
                            </div>
                        </tbody>
                    </table>
                </b-col>
            </b-row>
            <b-row> <br> </b-row>
            <MemoryTest :play="play" :stop="stop"/>
        </b-card>
    </div>
</template>

<script>
import { Card } from "bootstrap-vue/es/components"
import * as ds from '../../dist/deepstream.js'
import Listening from './Listening.vue'
import ComponentListens from './ComponentListens'
import MemoryTest from './MemoryTest.vue'

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
    components: {
        Listening, MemoryTest
    },
    created() {
        const comp = this
        comp.client.on('logged', logged => {
            console.log('received loggin status:', logged)
            comp.$data.isLogged = logged
        })
    },
    data() {
        return Object.assign(ComponentListens.data, {
            isLogged: false,
            snapshot: { name: '', value: '' },
            snapshotRecordName: '',
            record: {
                name: '',
                ready: false,
                created: false,
                loading: false,
                instance: null,
                subscription: {
                    isSubscribed: false,
                    latestUpdate: ''
                },
                set: {
                    path: '',
                    data: '',
                    loading: false,
                    done: false
                }
            },
            has: {
                name: '',
                exists: false,
                loading: false,
                done: true
            },
            records: [],
            scenario: { records: [], nexts: [] }
        })
    },
    methods: Object.assign({
        resetRecordVm: function () {
            this.$data.record = {
                name: '',
                ready: false,
                created: false,
                loading: false,
                instance: null,
                subscription: {
                    isSubscribed: false,
                    latestUpdate: ''
                },
                set: {
                    path: '',
                    data: '',
                    loading: false,
                    done: false
                }
            }
        },
        createRecord: function () {
            const comp = this

            if (comp.$data.isLogged) {
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
            } else {
                alert('You have to login first')
            }
        },
        hasRecord: function () {
            const comp = this
            if (comp.$data.isLogged) {
                if (comp.$data.has.name) {
                    comp.$data.has.loading = true
                    comp.$data.has.done = false
                    comp.client.record.has(comp.$data.has.name, (err, exists) => {
                        comp.$data.has.exists = exists
                        comp.$data.has.loading = false
                        comp.$data.has.done = true
                    })
                }
            } else {
                alert('You have to login first')
            }
        },

        subscribe: function (record) {
            if (!record.subscription.isSubscribed) {
                record.instance.subscribe(update => {
                    record.subscription.latestUpdate = JSON.stringify(update)
                })
                record.subscription.isSubscribed = true
                this.saveListeningMember(record.name)
            }
        },

        unsubscribe: function (record) {
            record.instance.unsubscribe()
            record.subscription.latestUpdate = ''
            record.subscription.isSubscribed = false
            this.removeListeningMember(record.name)
        },

        setRecord: function (record) {
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

        snapshotRecord: function () {
            const comp = this
            comp.client.record.snapshot(comp.$data.snapshot.name, (err, data) => {
                comp.$data.snapshot.value = JSON.stringify(data)
                comp.$data.snapshotRecordName = comp.$data.snapshot.name
            })
        },

        play: function () {
            const client = this.client
            const scenario = this.$data.scenario
            
            const playNextRecord = function(nexts, records) {
                if (records.length > 25000) {
                    return
                }

                const recordName = `record-${client.getUid()}`
                
                const record = client.record.getRecord(recordName, update => {
                    console.log(recordName, 'update:', update)
                })

                record.whenReady(() => {
                    const setDataIntervalId = setInterval(() => {
                        client.record.setData(recordName, {
                            name: 'awesome record',
                            options: {
                                new: false,
                                old: true,
                                date: Date.now()
                            }
                        }, err => {
                            if (err) {
                                console.log('Error setting data for', recordName, 'error:', err)
                            } else {
                                console.log('Successfully set data for record', recordName)
                            }
                        })
                    }, 1000)
    
                    const setIntervalId = setInterval(() => {
                        record.set('options.new', 'true', err => {
                            if (err) {
                                console.log('Error setting options.new for', recordName, 'error:', err)
                            } else {
                                console.log('Successfully set options.new for record', recordName)
                            }
                        })
                    }, 1500)
                    
                    const snapshotIntervalId = setInterval(() => {
                        client.record.snapshot(recordName, (err, data) => {
                            if (err) {
                                console.log('Error snapshotting', recordName, 'error:', err)
                            } else {
                                console.log('Successfully snapshotted  record', recordName, 'snapshot:', data)
                            }
                        })
                    }, 2000)

                    records.push({
                        instance: record,
                        recordName,
                        intervalsIds:[ setDataIntervalId, setIntervalId, snapshotIntervalId ]
                    })
                })
                

                const nextTimerId = setTimeout(() => {
                    playNextRecord(nexts, records)
                }, 100)

                nexts.push(nextTimerId)
            }

            playNextRecord(scenario.nexts, scenario.records)
        },

        stop: function () {
            const client = this.client
            const scenario = this.$data.scenario
            
            scenario.nexts.forEach(i => {
                clearTimeout(i)
            })
            scenario.nexts = []

            scenario.records.forEach(record => {
                record.intervalsIds.forEach(intervalId => clearInterval(intervalId))
                record.instance.discard()
            })

            scenario.records = []

            console.log('<- done')
        },

        listen: function () {
            const component = this
            const listener = this.listener
            const listening = this.$data.listening

            listener.record.listen('.*', (name, response) => {
                response.accept()
                console.log('Listening for redeepstream.js?b891:7775 Warning: RECORD (LISTEN): ACK_TIMEOUTcord', name)
                if (name) {
                    const isNew = component.saveListeningMember(name)

                    if (isNew) {
                        let i = 0
                        const intervalId = setInterval(() => {
                            listener.record.setData(name, 'provider', `[${++i}]: data sat from provider`, err => {
                                if (err) {
                                    console.log('Caught error while settign data for record', name, 'error:', err)
                                } else {
                                    console.log('Successfully sat data for record', name)
                                }
                            })
                        }, 1000)
                        listening.intervalsIds.push(intervalId)
                    }
                }
            })
        },

        unlisten: function () {
            this.listener.record.unlisten('.*')
            this.$data.listening.intervalsIds.forEach(timerId => clearInterval(timerId))
            this.$data.listening.intervalsIds = []
        }
    }, ComponentListens.methods)
}
</script>

<style scoped>
.wrapper {
  padding: 5px;
}
</style>
