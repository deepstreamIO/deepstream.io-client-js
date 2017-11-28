<template>
    <div class="rpcs-component">
        <b-card class="square-border" header-tag="header" footer-tag="footer">
            <p class="mb-0 mt-0"> <strong>RPCs</strong> </p>
            <br>

            <b-container>

                <b-row>
                    <b-col lg="12">
                        <table>
                            <tbody>
                                <tr v-for="rpc in rpcs" :key="rpc.id">
                                    <td>
                                        <strong class="esm-text"> {{ rpc.name }} </strong>
                                    </td>
                                    <td class="sm-text">
                                        <b-input-group>
                                            <b-form-input class="esm-text" :block="true" size="sm" v-model="rpc.model" type="text" placeholder="data"></b-form-input>
                                            <b-input-group-button slot="right">
                                                <b-button @click="make(rpc)" size="sm" class="sm-text" variant="link">make</b-button>
                                            </b-input-group-button>
                                        </b-input-group>
                                    </td>
                                    <td v-if="rpc.data.length >= 3">
                                        <b-button @click="rpc.data = []" size="sm" class="sm-text" variant="link">clear</b-button>
                                    </td>
                                    <td v-if="rpc.data.length" class="sm-text">
                                        <span class="light-font" v-for="d in rpc.data" :key="d.id">
                                            <pre> {{d.content}} </pre>
                                        </span>
                                    </td>
                                    <td>
                                        <br>
                                    </td>
                                    <td v-if="!rpc.data.length" class="sm-text">
                                        <span class="light-font"> <em>provide & make to see result</em> </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-col>
                </b-row>
                <b-row> <br> </b-row>
                <MemoryTest :play="play" :stop="stop"/>
            </b-container>
        </b-card>
    </div>
</template>

<script>
import MemoryTest from './MemoryTest.vue'

export default {
  name: "rpcs",
  props: ["client"],
  components: {
      MemoryTest,
  },
  created () {
    this.client.rpc.provide('echo', (data, response) => {
        response.send(data)
    })
  },
  data() {
    return {
        rpcs: [
            { id: 1, name: "echo", data: [], model: null, provided: false }
        ],
        scenario: { rpcs: [], nexts: [] }
    }
  },
  methods: {
    make: function(rpc) {
        const comp = this;
        comp.client.rpc.make(rpc.name, rpc.model, (err, response) => {
            rpc.data.push({ id: rpc.data.length, content: err || response });
        });
    },
    
    play: function () {
        const client = this.client
        const scenario = this.$data.scenario

        const getRandomNumber = function(min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        }

        const playNextRpc = function (nexts, rpcs) {
            if (rpcs.length > 25000) {
                return
            }

            const rpcName = `rpc-${client.getUid()}`

            client.rpc.provide(rpcName, (data, response) => {
                if (rpcs.length % 2 === 0) {
                    response.send(`${data.a * data.b}`)
                } else if (rpcs.length % 3 === 0) {
                    response.send(data.a * data.b)
                } else {
                    response.reject()
                }
            })

            const intervalId = setInterval(() => {
                const a = getRandomNumber(0, 10)
                const b = getRandomNumber(10, 20)

                client.rpc.make(rpcName, {a, b}, (err, result) => {
                    if (err) {
                        console.log(`Error making ${rpcName}(${a}, ${b}):`, err)
                    } else {
                        console.log(`${rpcName}(${a}, ${b}):`, result)
                    }
                })
            }, 1500)

            rpcs.push({
                rpcName,
                intervalId
            })

            const nextTimerId = setTimeout(() => {
                playNextRpc(nexts, rpcs)
            }, 100)

            nexts.push(nextTimerId)
        }
        playNextRpc(scenario.nexts, scenario.rpcs)
    },

    stop: function () {
        const client = this.client
        const scenario = this.$data.scenario
        
        scenario.nexts.forEach(timeoutId => clearTimeout(timeoutId))
        scenario.nexts = []

        scenario.rpcs.forEach(rpc => {
            clearInterval(rpc.intervalId)
            client.rpc.unprovide(rpc.rpcName)
        })
        scenario.rpcs = []

        console.log('<- done')
    }
  }
};
</script>

<style scoped>
.esm-text {
  padding-top: 5px;
  font-size: 12px;
  /* font-weight: bold; */
}
</style>
