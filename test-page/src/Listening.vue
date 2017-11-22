<template>
    <div class="listening">
        <b-row>
            <b-col>
                <p class="card-desc">
                    <strong>Enable listening: </strong>
                </p>
            </b-col>
            <b-col lg="2" class="pull-right">
                <p class="card-desc">
                    <strong v-if="isListening"> {{ status }} </strong>
                </p>
            </b-col>
            <b-col lg="2" class="pull-right">
                <b-button :checked="isListening" size="sm" variant="outline-danger" v-on:click="toggleListening()">{{isListening ? 'Stop' : 'Listen'}}</b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    name: "listening",
    props: ["members", "listen", "unlisten"],
    data() {
        return {
            isActive: false
        }
    },
    computed: {
        isListening: function () {
            return this.isActive
        },
        status: function () {
            return this.members.length === 0 ? 'No interested clients so far' : `${this.members.length} clients are interseted`
        }
    },
    methods: {
        toggleListening() {
            this.$data.isActive = !this.$data.isActive

            if (this.isListening) {
                this.listen()
            } else {
                this.unlisten()
            }
        }
    }
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
