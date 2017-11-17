<template>
    <div class="presence">
        <b-card class="square-border" header-tag="header" footer-tag="footer">
            <p class="mb-0 mt-0">
                <strong>Presence</strong>
            </p>
            <br>

            <b-row>
                <b-col>
                    <p class="card-desc">description</p>
                </b-col>
            </b-row>
            
            <b-form>
                <b-form-group>
                    <b-container>
                        <b-row>
                            <b-col lg="2">
                                <label class="esm-text"> Users </label>
                            </b-col>
                            <b-col>
                                <b-row>
                                    <b-col v-for="u in users.list" :key="u.id">
                                        <b-button :block="true" @click="toggleUserStatus(u)" size="sm" :variant="u.status ? 'outline-success' : 'outline-primary'">
                                            {{ u.name }}
                                        </b-button>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row>
                            <br>
                        </b-row>
                        <b-row>
                            <b-container>
                                <b-row>
                                    <b-col lg="2">
                                        <label class="esm-text"> Query</label>
                                    </b-col>

                                    <b-col lg="2">
                                        <b-button @click="queryAll()" size="sm" variant="primary"> all users </b-button>
                                    </b-col>

                                    <b-col lg="6">
                                        <b-input-group>
                                            <b-form-input :block="true" v-model="query.vm" size="sm" type="text"></b-form-input>
                                            <b-input-group-button slot="left">
                                                <b-button :block="true" @click="querySpecific" size="sm" variant="primary"> specific users </b-button>
                                            </b-input-group-button>
                                        </b-input-group>
                                    </b-col>

                                </b-row>
                                
                                <b-row>
                                    <b-col lg="2"> </b-col>                                    
                                    <b-col>
                                        <pre>
                                            <table width="100%">
                                                <tbody>
                                                    <tr v-for="r in query.result" :key="r.id">
                                                        <td> {{ r.content }} </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </pre>
                                    </b-col>
                                </b-row>
                            </b-container>
                        </b-row>

                        <b-row>
                            
                        </b-row>
                    </b-container>
                </b-form-group>
                
                <b-form-group>
                    <b-container>
                        <b-row>
                            <b-col lg="2">
                                <label class="esm-text"> Subscribe</label>
                            </b-col>
                            <b-col lg="7">
                                <b-form-group>
                                    <b-form-input size="sm" v-model="subscribe.vm" type="text" placeholder="Username"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col lg="2">
                                <b-button size="sm" variant="outline-primary" @click="subscribeToUser"> subscribe </b-button>
                            </b-col>
                        </b-row>
                        <!-- <b-row>
                            <b-col>
                                <b-col v-for="u in subscribe.users" :key="u.id" :style="'color:' + u.status ? 'green' : 'red'">
                                    <p>{{ u.name }},&nbps;</p>
                                    <b-button variant="link"> unsubscribe</b-button>
                                </b-col>
                            </b-col>
                        </b-row> -->
                    </b-container>
                </b-form-group>

                <b-form-group>
                    <b-container>
                        <b-row>
                            <b-col lg="3">
                                <label class="esm-text">Subscribed users:</label>
                            </b-col>
                                
                            <b-col lg="9">
                                <table class="events-table">
                                    <tbody>
                                        <tr v-for="u in subscribe.users" :key="u.id">
                                            <td>{{ u.name }}</td>
                                            <td>{{ u.status ? 'on' : 'off'}}</td>
                                            <td>
                                                <b-button @click="unsubscribeFromUser(u)" size="sm" variant="link"> unsubscribe </b-button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-form-group>
            </b-form>

            <b-row>
                <b-col>
                    <p class="card-desc">Press play and record memory for potential leaks</p>
                </b-col>
                <b-col lg="2" offset-lg="3">
                    <b-button size="sm" variant="outline-primary" >Play</b-button>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>

<script>
import { Card } from "bootstrap-vue/es/components"
import * as ds from '../../dist/deepstream.js'

const getDsClient = address => ds.deepstream(address, { lazyConnect: true })

const createUser = function (address, id, name) {
    return {
        id,
        name,
        client: getDsClient(address),
        status: false
    }
}

export default {
  name: "presence",
  props: ["serverAddress", "client"],
  created () {
      const address = this.serverAddress
      this.$data.users.list = this.$data.users.list.map((name, i) => createUser(address, i, name))
  },
  data () {
    return {
        users: {
            list: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6']
        },
        query: {
            vm: null,
            result: [{
                id: 1,
                content: '--'
            }]
        },
        subscribe: {
            vm: null,
            users: []
        }
    }
  },
  methods: {
        toggleUserStatus: function(u) {
            u.status = !u.status
            
            if (u.status) {
                u.client.login({username: u.name}, (logged) => {
                    console.log(u.name, 'is logged', logged ? 'on' : 'off')
                })
            } else {
                u.client.close()
                u.client = getDsClient(this.serverAddress)
            }
        },

        queryAll: function () {
            const comp = this
            comp.client.presence.getAll((err, usernames) => {
                console.log(err, usernames)
                comp.$data.query.result.push({ id: comp.$data.query.result.length + 1, content: JSON.stringify(usernames) })
            })
        },

        querySpecific: function () {
            const comp = this
            const users = comp.$data.query.vm.split(',').map(x => x.trim())
            comp.client.presence.getAll(users, (err, usernames) => {
                comp.$data.query.result.push({ id: comp.$data.query.result.length + 1, content: JSON.stringify(usernames) })
            })
        },

        subscribeToUser: function () {
            const comp = this

            const user = {
                id: comp.$data.subscribe.users.length + 1,
                name: comp.$data.subscribe.vm,
                status: false
            }


            console.log('subscribing to user', user.name, user.name === 'user-4')
            comp.client.presence.subscribe(`${user.name}`, (username, status) => {
              console.log(username, 'has went', status ? 'on' : 'off')
              user.status = status  
            })

            const isDuplicate = comp.$data.subscribe.users.reduce((acc, _user) => {
                if (_user.name === user.name) {
                    acc = true
                }
                return acc
            }, false)
            
            if (!isDuplicate) {
                comp.$data.subscribe.users.push(user)
            }
        },

        unsubscribeFromUser: function (user) {
            const comp = this
            comp.client.presence.unsubscribe(user.name)
            comp.$data.subscribe.users = comp.$data.subscribe.users.filter(u => !(u.id === user.id))
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
