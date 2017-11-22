<template>
    <div class="events">
        <b-card class="square-border" header-tag="header" footer-tag="footer">
            <p class="mb-0 mt-0">
                <strong>Events</strong>
            </p>
            <br>

            <Listening :members="listening.members" :listen="listen" :unlisten="unlisten" />

            <b-row>
                <br>
            </b-row>
            <b-row>
                <b-form>
                    <b-form-group>
                        <b-container>
                            <b-row>
                                <b-col lg="2">
                                    <label class="esm-text"> <em>Emit an event</em></label>
                                </b-col>
                                <b-col lg="4">
                                    <b-form-group>
                                        <b-form-input size="sm" v-model="emitEventName" type="text" placeholder="event name"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col lg="4">
                                    <b-form-group>
                                        <b-form-input size="sm" v-model="emitEventData" type="text" placeholder="event data"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col lg="2">
                                    <b-form-group>
                                        <b-button size="sm" variant="outline-primary" @click="emit()"> emit </b-button>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-form-group>
                    
                    <b-form-group>
                        <b-container>
                            <b-row>
                                <b-col lg="2">
                                    <label class="esm-text"> <em>Subscribe to an event</em> </label>
                                </b-col>
                                <b-col lg="8">
                                    <b-form-group>
                                        <b-form-input size="sm" v-model="subscribeEventName" type="text" placeholder="Event name"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col lg="2">
                                    <b-button size="sm" variant="outline-primary" @click="subscribe()"> subscribe </b-button>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-form-group>

                    <b-form-group>
                        <b-container>
                            <b-row>
                                <b-col lg="3">
                                    <label class="esm-text">
                                        <em> Subscribed events </em>
                                    </label>
                                </b-col>
                                    
                                <b-col lg="9">
                                    <p class="esm-text" v-if="subscribedEvents.length === 0">
                                        <em>No events</em>
                                    </p>
                                    <table v-if="subscribedEvents.length" class="events-table">
                                        <tbody>
                                            <tr v-for="e in subscribedEvents" :key="e.id">
                                                <td>{{ e.name }}</td>
                                                <td>
                                                    <b-button @click="unsubscribe(e)" size="sm" variant="link"> unsubscribe </b-button>
                                                </td>
                                                <td>
                                                    <span class="light-font" v-for="d in e.data" :key="d.id">
                                                        {{d.content}},
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-form-group>
                </b-form>
            </b-row>
            
            <b-row> <br> </b-row>
            <b-row>
                <b-col>
                    <p class="card-desc">Press play and record memory for potential leaks</p>
                </b-col>
                <b-col lg="2" offset-lg="3">
                    <b-button :disabled="isPlaying" :checked="isPlaying" size="sm" variant="outline-primary" v-on:click="toggleScenario()">{{isPlaying ? 'Playing...' : 'Play'}}</b-button>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
import { Card } from "bootstrap-vue/es/components"
import Listening from "./Listening.vue"
import ComponentListens from "./ComponentListens"

const handler = function (emitMessage) {
    console.log('received at', this.evt, ':', emitMessage)
}

const scenarioData = {
    isplaying: false,
    events: [{
        name: 'a',
        handler
    },
    {
        name: 'b',
        handler
    },
    {
        name: 'c',
        handler
    },
    {
        name: 'd',
        handler
    },
    {
        name: 'e',
        handler
    }]
}

export default {
    name: "events",
    props: ["listener", "client"],
    components: {
        Listening,
    },
    data() {
        return Object.assign({
            emitEventName: "",
            emitEventData: "",

            subscribeEventName: "",
            subscribedEvents: [],
            scenarioData
        }, ComponentListens.data)
    },
    computed: {
        isPlaying: function () {
            return this.$data.scenarioData.isplaying
        }
    },
    methods: Object.assign({
        emit: function () {
            this.client.event.emit(this.emitEventName, this.emitEventData)
        },

        subscribe: function () {
            const component = this
            const data = this.$data

            const event = {
                id: data.subscribedEvents.length + 1,
                name: data.subscribeEventName,
                data: []
            }

            const isDuplicate = data.subscribedEvents.reduce((acc, ev) => {
                if (ev.name === event.name) {
                    acc = true
                }
                return acc
            }, false)

            if (!isDuplicate) {
                console.log('Event is not duplicate')
                data.subscribedEvents.push(event)
                console.log(data.subscribedEvents)
            } else {
                console.log('Event is duplicate')
            }

            component.client.event.subscribe(event.name, content => {
                console.log(event.name, 'event received emit:', content)
                event.data.push({
                    id: event.data.length + 1,
                    content
                })
            })

            console.log('Suscribed')
        },

        unsubscribe: function (event) {
            const component = this
            const data = this.$data
            
            data.subscribedEvents = data.subscribedEvents.filter(e => {
                if (e.name === event.name) {
                    return false
                }
                return true
            })

            this.client.event.unsubscribe(event.name)

            this.removeListeningMember(event.name)
        },

        listen() {
            const component = this
            const listener = this.listener
            const listening = this.$data.listening

            listener.event.listen('.*', (name, response) => {
                response.accept()

                if (name) {
                    const isNew = component.saveListeningMember(name)

                    if (isNew) {
                        const intervalId = setInterval(() => {
                            component.listener.event.emit(name, 'from provider')
                        }, 1000)

                        listening.intervalsIds.push(intervalId)
                    }
                }
            })
        },

        unlisten() {
            this.listener.event.unlisten('.*')
            this.$data.listening.intervalsIds.forEach(i => clearInterval(i))
            this.$data.listening.intervalsIds = []
        },

        toggleScenario: function () {
            this.$data.scenarioData.isplaying = !this.$data.scenarioData.isplaying

            if (this.isPlaying) {
                this.playScenario()
            }
        },

        playScenario: function () {
            this.$data.scenarioData.isplaying = true

            console.log('Playing Events Scenario ...')

            const scenario = this.getScenario()

            scenario.subscribeToEvents()
            scenario.emitEvents()

            setTimeout(() => {
                scenario.unsubFromEvents()

                this.$data.scenarioData.isplaying = false

                console.log('<- done')

            }, 2 * 60 * 1000)

        },

        getScenario: function () {
            let scenario = {}

            scenario.intervalId = null

            scenario.subscribeToEvents = this.__subscribeToEvents.bind(this)
            scenario.emitEvents = this.__emitEvents.bind(this, scenario)
            scenario.unsubFromEvents = this.__unsubFromEvents.bind(this, scenario)

            return scenario
        },

        __subscribeToEvents: function () {
            for (let evt of this.$data.scenarioData.events) {
                evt.handler = evt.handler.bind(evt)
                this.client.event.subscribe(evt.name, evt.handler)
            }
        },

        __emitEvents: function (scenario) {
            const comp = this
            scenario.intervalId = setInterval(() => {
                for (let evt of comp.$data.scenarioData.events) {
                    comp.client.event.emit(evt.name, 'message sent from', evt.name)
                }
            }, 50)
        },

        __unsubFromEvents: function (scenario) {
            for (let evt of this.$data.scenarioData.events) {
                this.client.event.unsubscribe(evt.name, evt.handler)
            }

            clearInterval(scenario.intervalId)
        }
    }, ComponentListens.methods)
}
</script>

<style scoped>
.wrapper {
  padding: 5px;
}
#events {
  list-style-type: none;
  display: block;
  float: left;
}
.esm-text {
  padding-top: 5px;
  font-size: 12px;
  /* font-weight: bold; */
}

table.events-table {
  font-size: 12px;
}

table.events-table > tbody > tr > td {
  padding-right: 20px;
  font-weight: bold;
}

table.events-table > tbody > tr {
  margin: 0px;
  padding: 0px;
}

.light-font {
  font-weight: lighter;
}

/* some bad practices */
.btn-sm {
  font-size: 12px;
}
</style>
