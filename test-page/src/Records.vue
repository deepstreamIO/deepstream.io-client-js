<template>
    <div class="presence">
        <b-card class="square-border" header-tag="header" footer-tag="footer">
            <p class="mb-0 mt-0">
                <strong>Records</strong>
            </p>
            <br>

            <b-row>
                <b-col>
                    <p class="card-desc">description</p>
                </b-col>
            </b-row>

            <b-row>
                <b-col lg="2">
                    <p class="card-desc">Create record</p>
                </b-col>
                <b-col lg="4">
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
                <b-col lg="3">
                    <p class="card-desc">Check if record exists</p>
                </b-col>
                <b-col lg="3">
                    <b-input-group>
                        <b-form-input class="sm-text" :block="true" size="sm" v-model="has.name" type="text" placeholder="The name of the record"></b-form-input>

                        <!-- Attach Right button Group via slot -->
                        <b-input-group-button v-if="has.done" slot="left">
                            <b-button
                                class="sm-text"
                                size="sm"
                                :variant="has.exists ? 'outline-success' : 'outline-danger'"
                                disabled> {{ has.exists ? 'OK' : 'X' }} </b-button>
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
            
            <b-row>
                <b-col>
                    <table class="sm-text">
                        <tbody>
                            <div v-for="r in records" :key="r.id">
                                <tr>
                                    <td> {{r.name}} </td>
                                    <td v-if="r.subscribed">
                                        <b-button
                                            class="sm-text"
                                            size="sm"
                                            variant="link"
                                            v-on:click="unsubscribe(r)"
                                            > unsubscribe </b-button>
                                    </td>
                                    <td v-if="!r.subscribed">
                                        <b-input-group>
                                            <b-form-input
                                                class="sm-text"
                                                :block="true"
                                                size="sm"
                                                v-model="r.subscribePath"
                                                type="text"
                                                placeholder="path"></b-form-input>

                                            <!-- Attach Right button Group via slot -->
                                            <b-input-group-button v-if="has.done" slot="left">
                                                <b-button
                                                    class="sm-text"
                                                    size="sm"
                                                    variant="outline-primary"
                                                    v-on:click="subscribe(r)"
                                                    > subscribe </b-button>
                                            </b-input-group-button>
                                        </b-input-group>
                                    </td>
                                    <td>&nbsp;&nbsp;&nbsp;</td>
                                    <td>
                                        <b-input-group>
                                            <b-form-input
                                                class="sm-text"
                                                :block="true"
                                                size="sm"
                                                v-model="r.set.path"
                                                type="text"
                                                placeholder="path"></b-form-input>

                                            <!-- Attach Right button Group via slot -->
                                            <b-input-group-button v-if="has.done" slot="left">
                                                <b-button
                                                    class="sm-text"
                                                    size="sm"
                                                    variant="outline-primary"
                                                    @click="setRecord(r)"
                                                    :disabled="record.set.loading"> set </b-button>
                                            </b-input-group-button>
                                            <b-input-group-button slot="right">
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
                                <tr v-for="s in r.subscriptions" :key="s.id">
                                    <span>
                                        path[{{ s.path}}] <strong>:</strong>
                                        <span v-for="u in r.updates" :key="u.id">
                                            {{ u.update }},
                                        </span>
                                    </span>
                                </tr>
                            </div>
                        </tbody>
                    </table>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
import { Card } from "bootstrap-vue/es/components"
import * as ds from '../../dist/deepstream.js'

const isDuplicate = (arr, obj, key) => arr.reduce((acc, o) => {
    if (obj[key] === o[key]) {
        acc = true
    }

    return acc
}, false)

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
            subscribed: false,
            instance: null,
            set: {
                path: '',
                data: '',
                loading: false
            },
            updates: [],
            subscriptions: []
        },
        has: {
            name: '',
            exists: false,
            loading: false,
            done: true
        },
        records: []
    }
  },
  methods: {
    resetRecordVm: function () {
        this.$data.record = {
            name: '',
            ready: false,
            created: false,
            loading: false,
            subscribed: false,
            instance: null,
            set: {
                path: '',
                data: '',
                loading: false
            },
            updates: []
        }
    },
    createRecord: function() {
        const comp = this
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

    },
    hasRecord: function() {
        const comp = this

        comp.$data.has.loading = true
        comp.$data.has.done = false
        comp.client.record.has(comp.$data.has.name, (err, exists) => {
            comp.$data.has.exists = exists
            comp.$data.has.loading = false
            comp.$data.has.done = true
        })
    },
    subscribe: function (record) {
        record.instance.subscribe(record.subscribePath, update => {
            record.updates.push({id: record.updates.length + 1, update})
        })

        record.subscribed = true

        let isdup = isDuplicate(record.subscriptions, {path: record.subscribePath}, 'path')

        if (!isdup) {
            record.subscriptions.push({
                id: record.subscriptions.length + 1,
                path: record.subscribePath
            })
            console.log(record.subscriptions)
        }
    },
    unsubscribe: function (record) {
        record.instance.unsubscribe(record.subscribePath)
        record.subscribed = false
        record.subscribePath = '',
        record.updates = []
    },
    setRecord: function(record) {
        record.set.loading = true
        record.set.done = false

        console.log(record)
        record.instance.set(record.set.path, record.set.data, () => {
            record.set.loading = false
            record.set.done = true
        })
    }
  }
};
</script>

<style scoped>
.wrapper {
  padding: 5px;
}
</style>
