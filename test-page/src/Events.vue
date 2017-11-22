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
            <MemoryTest :play="play" :stop="stop"/>
        </b-card>
    </div>
</template>

<script>
import { Card } from "bootstrap-vue/es/components"
import Listening from "./Listening.vue"
import ComponentListens from "./ComponentListens"
import MemoryTest from "./MemoryTest.vue"
export default {
    name: "events",
    props: ["listener", "client"],
    components: {
        Listening, MemoryTest
    },
    data() {
        const data = Object.assign({
            emitEventName: "",
            emitEventData: "",
            subscribeEventName: "",
            subscribedEvents: [],
            scenario: { events: [] }
        }, ComponentListens.data)

        return data
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

        play: function () {
            const client = this.client
            const scenario = this.$data.scenario
            
            const playNextEvent = function(events) {
                if (events.length > 25000) {
                    return
                }

                const eventName = `event-${client.getUid()}`
                
                client.event.subscribe(eventName, update => {
                    console.log(eventName, 'update:', update)
                })

                const intervalId = setInterval(() => {
                    client.event.emit(eventName, 'new update')
                }, 1000)
                
                events.push({ eventName, intervalId })

                setTimeout(() => {
                    playNextEvent(events)
                }, 100)
            }

            playNextEvent(scenario.events)
        },

        stop: function () {
            const client = this.client
            const scenario = this.$data.scenario

            const stopNextEvent = function (events, i) {
                if (i >= events.length) {
                    return
                }

                const event = events[i]

                client.event.unsubscribe(event.eventName)
                clearInterval(event.intervalId)

                setTimeout(() => {
                    stopNextEvent(events, ++i)
                })
            }

            stopNextEvent(scenario.events, 0)
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
