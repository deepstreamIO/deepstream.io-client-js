<template>
    <div class="events">
        <b-card class="square-border" header-tag="header" footer-tag="footer">
            <p class="mb-0 mt-0">
                <strong>Events</strong>
            </p>
            <br>

            <b-row>
                <b-col>
                    <p class="card-desc">
                        <strong>Enable event listening: </strong>
                    </p>
                </b-col>
                <b-col lg="2" class="pull-right">
                    <b-button :checked="isListening" size="sm" variant="outline-danger" v-on:click="toggleListening()">{{isListening ? 'Listening...' : 'Listen'}}</b-button>
                </b-col>
            </b-row>
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
                                                    <span class="light-font" v-for="d in e.data" :key="d.id">
                                                        {{d.content}},
                                                    </span>
                                                </td>
                                                <td>
                                                    <b-button @click="unsubscribe(e)" size="sm" variant="link"> unsubscribe </b-button>
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
import { Card } from "bootstrap-vue/es/components";

const handler = function (emitMessage) {
    console.log('received at', this.evt, ':', emitMessage)
}

const scenarioData = {
    isplaying: false,
    events: [
        { name: 'a', handler },
        { name: 'b', handler },
        { name: 'c', handler },
        { name: 'd', handler },
        { name: 'e', handler }
    ]
}

let intervals = []

export default {
  name: "events",
  props: ["listener", "client"],
  data() {
    return {
        emitEventName: "",
        emitEventData: "",
    
        subscribeEventName: "",
        subscribedEvents: [],
    
        isListening: false,
    
        scenarioData
    };
  },
  computed: {
      isPlaying: function () {
          return this.$data.scenarioData.isplaying
      }
  },
  methods: {
    emit: function () {
        this.client.event.emit(this.emitEventName, this.emitEventData)
    },

    subscribe: function () {
        const comp = this

        const event = {
            id: comp.subscribedEvents.length + 1,
            name: comp.subscribeEventName,
            data: []
        }

        const isDuplicate = comp.subscribedEvents.reduce((acc, ev) => {
            if (ev.name === event.name) {
                acc = true
            }
            return acc
        }, false)

        if (!isDuplicate) {
            comp.subscribedEvents.push(event)
        }

        comp.client.event.subscribe(comp.subscribeEventName, content => {
            console.log(comp.subscribeEventName, content)
            event.data.push({ id: event.data.length + 1, content })
        })
    },

    unsubscribe: function (event) {
        this.subscribedEvents = this.subscribedEvents.filter(e => {
            if (e.name === event.name) {
                return false
            }
            return true
        })

        this.client.event.unsubscribe(event.name)
    },

    toggleListening () {
        this.isListening = !this.isListening

        if (this.isListening) {
            this.listen()
        } else {
            this.unlisten()
        }
    },

    listen () {
        let comp = this
        comp.listener.event.listen('.*', (name, response) => {
            response.accept()

            intervals.push(
                setInterval(() => {
                    console.log('listener emitting?')
                    comp.listener.event.emit(name, 'from provider')
                }, 40)
            )
        })
    },

    unlisten () {
        this.listener.event.unlisten('.*')
        if (intervals.length) {
            intervals.forEach(i => clearInterval(i))
            intervals = []
        }
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
    
        const scenario = this.scenario()

        scenario.subscribeToEvents()
        scenario.emitEvents()
        
        setTimeout(() => {
            scenario.unsubFromEvents()

            this.$data.scenarioData.isplaying = false
            
            console.log('<- done')

        }, 2 * 1000)
        
    },

    scenario: function () {
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
        }, 10)
    },

    __unsubFromEvents: function (scenario) {
        for (let evt of this.$data.scenarioData.events) {
            this.client.event.unsubscribe(evt.name, evt.handler)
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
