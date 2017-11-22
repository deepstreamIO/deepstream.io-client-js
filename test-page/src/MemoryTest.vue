<template>
    <div class="memory-test">
        <b-row>
            <b-col>
                <p class="card-desc">Press play and record memory for potential leaks</p>
            </b-col>
            <b-col lg="2" offset-lg="3">
                <b-button :checked="isPlaying" size="sm" :variant=" 'outline-' + (!isPlaying ? 'primary' : 'danger')" v-on:click="toggleScenario()">{{isPlaying ? 'Stop' : 'Play'}}</b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    name: "memory-test",
    props: ["play", "stop"],
    components: {},
    data() {
        return {
            isPlaying: false,
            stopped: 0
        }
    },
    methods: {
        toggleScenario: function() {
            this.$data.isPlaying = !this.$data.isPlaying

            if (this.$data.isPlaying) {
                this.play()
            } else {
                this.stop()
            }
        },
    }
}
</script>

<style scoped>
</style>
