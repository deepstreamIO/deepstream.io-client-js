<template>
    <div class="rpcs">
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
                                    <td v-if="!rpc.provided" class="sm-text">
                                        <b-button @click="provide(rpc)" size="sm" class="sm-text" variant="link">provide</b-button>
                                    </td>
                                    <td v-if="rpc.provided" class="sm-text">
                                        <b-button @click="unprovide(rpc)" size="sm" class="sm-text" variant="link">unprovide</b-button>
                                    </td>
                                    <td v-if="rpc.provided" class="sm-text">
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
                <b-row>
                    <b-col>
                        <p class="card-desc">Press play and record memory for potential leaks</p>
                    </b-col>
                    <b-col lg="2" offset-lg="3">
                        <b-button :disabled="isPlaying" :checked="isPlaying" size="sm" variant="outline-primary" v-on:click="toggleScenario()">{{isPlaying ? 'Playing...' : 'Play'}}</b-button>
                    </b-col>
                </b-row>

            </b-container>
        </b-card>
    </div>
</template>

<script>

const scenarioData = {
    isplaying: false,
    rpcs: [
        {
            name: 'double-up',
            provideHandler: function() {
                const result = 1 || data.a * 2 * 2 
                
                console.log({data, response})
                console.log('rpc provider received', data.a)
                console.log('sending result:', result)
                
                response.send(result)
            },
            makeHandler: function (err, result) {
                console.log('received result:', err ? `error: ${err}` : result)
            },
            name: 'triple-up',
            provideHandler: function (data, response) {
                const result = 1 || data.a * 3 * 3 
                
                console.log({data, response})
                console.log('rpc provider received', data.a)
                console.log('sending result:', result)

                response.send(result)
            },
            makeHandler: function (err, result) {
                console.log('received result:', err ? `error: ${err}` : result)
            }
        }
    ]
}

export default {
  name: "rpcs",
  props: ["client"],
  data() {
    return {
        rpcs: [
            { id: 1, name: "echo()", data: [], model: null, provided: false }
        ],
        scenarioData
    };
  },
  computed: {
    isPlaying: function() {
        return this.$data.scenarioData.isplaying;
    }
  },
  methods: {
    provide: function(rpc) {
        this.client.rpc.provide(rpc.name, (data, response) => {
        response.send(data);
        });
        rpc.provided = true;
    },
    unprovide: function(rpc) {
        this.client.rpc.unprovide(rpc.name);
        rpc.provided = false;
        rpc.data = [];
    },
    make: function(rpc) {
        const comp = this;
        comp.client.rpc.make(rpc.name, rpc.model, (err, response) => {
            rpc.data.push({ id: rpc.data.length, content: err || response });
        });
    },

    toggleScenario: function() {
        this.$data.scenarioData.isplaying = !this.$data.scenarioData.isplaying

        if (this.isPlaying) {
            this.playScenario()
        }
    },

    getScenario: function () {
        let scenario = {}
        
        scenario.intervalId = null

        scenario.provideRpcs = this.__provideRpcs.bind(this)
        scenario.makeRpcs = this.__makeRpcs.bind(this, scenario)
        scenario.unprovideRpcs = this.__unprovideRpcs.bind(this, scenario)

        return scenario
    },

    __provideRpcs: function () {
        for (let rpc of this.$data.scenarioData.rpcs) {
            this.client.rpc.provide(rpc.name, rpc.provideHandler)
        }
    },

    __makeRpcs: function (scenario) {
        const comp = this
        scenario.intervalId = setInterval(function () {
            for (let rpc of comp.$data.scenarioData.rpcs) {
                for (let i = 0; i < 20; i++) {
                    comp.client.rpc.make(rpc.name, { a: (i * 2) * 2 }, rpc.makeHandler)
                }
            }
        }, 10)
    },
    
    __unprovideRpcs: function (scenario) {
        for (let rpc of this.$data.scenarioData.rpcs) {
            console.log('-> unproviding', rpc.name)
            this.client.rpc.unprovide(rpc.name)
        }

        clearInterval(scenario.intervalId)
    },
    
    playScenario: function () {
        this.$data.scenarioData.isplaying = true

        console.log('Playing RPCs Scenario ...')

        const scenario = this.getScenario()

        scenario.provideRpcs()

        scenario.makeRpcs()

        setTimeout(() => {
            scenario.unprovideRpcs()
            
            this.$data.scenarioData.isplaying = false
            
            console.log('<- done')
        }, 2 * 1000)
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
