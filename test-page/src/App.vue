<template>
  <div id="app">
    <div>
      <b-navbar toggleable="md" type="dark" variant="info">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand href="#">{{title}}</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav>
            <!-- <b-nav-item href="#">Add navbar link here </b-nav-item> -->
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">

            <b-nav-form>
              <b-form-input size="sm" v-on:input="vServerAddress" :state="server.isAddressValid" v-model="server.address" type="text" placeholder="Enter server address"></b-form-input>&nbsp;
               <b-button size="sm" class="my-2 my-sm-0" variant="*" style="background: white; color: #17a2b8;" :disabled="!server.isAddressValid" v-on:click="addClient">Add client</b-button>
            </b-nav-form>
          </b-navbar-nav>

        </b-collapse>
      </b-navbar>
    </div>
    <div class="clients">
      <div class="clients-container">
        <b-col lg="12">
            <b-row><br></b-row>
            <b-row>
                <b-col lg="12">
                    <b-card-group v-if="clients.length > 0">
                        <b-card class="no-borders mb-0 mt-0" v-for="c in clients" :key="c.id" header-tag="header" footer-tag="footer">
                            <Client :listener="listener" :client="c.client" :server-address="c.serverAddress"/>
                        </b-card>
                    </b-card-group>
                    <b-card-group v-if="clients.length === 0">
                        <b-card class="no-borders mb-0 mt-0">
                          <p>Please add a client or two</p>
                        </b-card>
                    </b-card-group>
                </b-col>
            </b-row>

        </b-col lg="12">
      </div>
    </div>
  </div>
</template>

<script>
import { Nav } from "bootstrap-vue/es/components"
import Client from "./Client.vue"
import * as ds from "../../dist/deepstream.js"

const URL_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{2,256}[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

let timerId = null

let listener = null

export default {
  name: "app",
  created: function() {
    /* this.clients = [
      Object.assign({ id: 1}, this.createClient('localhost:6020')),
      Object.assign({ id: 2}, this.createClient('localhost:6020'))
    ] */
  },
  data() {
    return {
      title: "deepstream.io test dashboard",
      clientsCount: 0,
      clients: [],
      server: {
        address: null,
        isAddressValid: false
      }
    }
  },
  watch: {
    clients: function() {
      this.clientsCount = this.clients.length
    }
  },
  computed: {
    listener: function () {
      if (!listener) {
        listener = ds.deepstream('localhost:6020')
        listener.login({username: 'listener'})
      }

      return listener
    }
  },
  components: { Client },
  methods: {
    createClient: function (address) {
      const serverAddress = address || this.server.address
      const client = ds.deepstream(serverAddress, { lazyConnect: true })

      return { client, serverAddress }  
    },

    resetServerData: function () {
      this.server = {
        address: null,
        isAddressValid: false
      }
    },
    
    addClient: function(e) {
      const client = Object.assign({
        id: ++this.clientsCount
      }, this.createClient())
      this.clients.push(client)
      this.resetServerData()
    },
    
    removeClient: function(e, cId) {
      // this.clients = this.clients.filter(c => !(c.id === cId))
    },
    
    getClient: function(cId) {
      const client = this.clients.reduce((acc, client) => {
        if (client.id === cId) {
          return client
        }

        return acc
      }, null)

      if (!client) {
        throw new Error(`Could not fetch client with id ${cId}`)
      }

      return client
    },
    
    vServerAddress: function(e) {
      const component = this
      timerId = timerId || setTimeout(() => {
        const address = component.server.address
        const matchResult = !address ? [] : (address.match(URL_REGEX) || [])
        component.server.isAddressValid = matchResult.length > 0
          ? true 
          : false
        timerId = null
      }, 100)
    }
  }
}
</script>

<style scoped>
div.clients-container {
  display: flex;
  flex-wrap: nowrap;
}
.wide-card {
  padding: 0px !important;
}
.no-borders {
    border: solid 0px white;
}
</style>
