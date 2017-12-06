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
                                            <b-form-input v-if="rpc.provided" class="rpc-data-field esm-text" :id="'data-field-rpc-' + rpc.name" :block="true" size="sm" v-model="rpc.model" type="text" :placeholder="rpc.inputPlaceholder || 'data'"></b-form-input>
                                            <b-input-group-button v-if="rpc.provided" slot="right">
                                                <b-button @click="make(rpc)" size="sm" class="rpc-make-btn sm-text" :id="'make-btn-rpc-' + rpc.name" variant="link">make</b-button>
                                            </b-input-group-button>
                                            <b-input-group-button v-if="!rpc.provided" slot="right">
                                                <b-button @click="provide(rpc)" size="sm" class="rpc-make-btn sm-text" :id="'make-btn-rpc-' + rpc.name" variant="link">provide</b-button>
                                                console.log('rpc:', rpc)
                                            </b-input-group-button>
                                        </b-input-group>
                                    </td>
                                    <td v-if="rpc.data.length >= 3">
                                        <b-button @click="rpc.data = []" size="sm" class="sm-text" variant="link">clear</b-button>
                                    </td>
                                    <td v-if="rpc.data.length" class="sm-text">
                                        <span :data-rpc-name="rpc.name" class="rpc-response light-font" v-for="d in rpc.data" :key="d.id">
                                            {{d.content}} 
                                        </span>
                                    </td>
                                    <td>
                                        <br>
                                    </td>
                                    <td v-if="!rpc.data.length" class="sm-text">
                                        <span class="light-font"> <em>make to see result</em> </span>
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

const additionRpc = (data, response) => {
    const result = parseInt(data.a) + parseInt(data.b)
    console.log(data, {result})
    response.send(result)
}

const multiplicationRpc = (data, response) => {
    const result = parseInt(data.a) * parseInt(data.b)
    console.log(data, {result})
    response.send(result)
}

export default {
  name: "rpcs",
  props: ["client"],
  components: {
      MemoryTest,
  },
  created () {
    this.client.rpc.provide('echo', (data, response) => {
        console.log('echo:', data)
        let exception = null
        try {
            response.send(data)
        } catch (e) {
            exception = e
        } finally {
            if (exception) {
                console.log(exception)
            } else {
                console.log('rpc echo made without throwing')
            }
        }
    })
  },
  data() {
    return {
        rpcs: [
            { id: 1, name: "echo", data: [], model: null, provided: true },
            { 
                id: 2, name: "addition", data: [], model: null, provided: false,
                args: {a: 0, b: 0}, handler: additionRpc, 
                inputPlaceholder: 'enter 2 numbers separated with a comma' 
            },
            { 
                id: 3, name: "multiplication", data: [], model: null, provided: false,
                args: {a: 0, b: 0}, handler: multiplicationRpc,
                inputPlaceholder: 'enter 2 numbers separated with a comma' 
            }
        ],
        scenario: { rpcs: [], nexts: [] }
    }
  },
  methods: {
    make: function(rpc) {
        const comp = this
        const rpcArgs = typeof rpc.args === 'undefined'
            ? rpc.model
            : rpc.model
                .split(',')
                .reduce((acc, arg, i) => {
                    if (i < 2) {
                        const key = i%2 === 0 ? 'a':'b'
                        return Object.assign(
                            acc, {
                                [key]: arg.trim(" ") 
                            }
                        )
                    }
                    return acc
                }, {})

        console.log({rpcArgs})
        comp.client.rpc.make(rpc.name, rpcArgs, (err, response) => {
            console.log('made', rpcArgs, 'received', response)
            rpc.data.push({ id: rpc.data.length, content: err || response })
            rpc.model = ''
        })
    },
    provide: function(rpc) {
        console.log('provided rpc:', rpc.name, rpc)
        this.client.rpc.provide(rpc.name, rpc.handler)
        setTimeout(() => {
            rpc.provided = true   
        })
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
