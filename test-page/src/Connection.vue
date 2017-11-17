<template>
    <div class="connection">
        <div class="wrapper">
            <b-card class="square-border text-center" header-tag="header" footer-tag="footer">
                <p class="mb-0 mt-0">
                    <strong>Connection</strong>
                </p>
                <br>

                <b-form inline>
                    <b-container>
                        <b-row>
                            <b-col lg="8" offset-lg="2">
                                <b-form-group description="Deepstream server address">
                                    <b-input-group>
                                        <b-form-input :block="true" disabled size="sm" v-model="serverAddress" type="text" placeholder="hostname"></b-form-input>

                                        <!-- Attach Right button Group via slot -->
                                        <b-input-group-button slot="right">
                                            <b-button :block="true" href="#" disabled size="sm" :variant="btnVariants[connectionState] || 'outline-success'" :state="connectionState">{{connectionState}}</b-button>
                                        </b-input-group-button>

                                    </b-input-group>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-container>
                    
                </b-form>
            </b-card>
        </div>
    </div>
</template>

<script>
import {Card} from 'bootstrap-vue/es/components'

export default {
  name: 'connection',
  props: ['client', 'serverAddress'],
  data: function() {
    return {
        btnVariants: {
            undefined: 'outline-primary'
        }
    }
    /* return {
    CLOSING: 'primary',
    CLOSED: 'outline-danger',
    AWAITING_CONNECTION: '',
    CHALLENGING,
    AWAITING_AUTHENTICATION,
    AUTHENTICATING,
    OPEN,
    ERROR,
    RECONNECTING,
    REDIRECTING,
    CHALLENGE_DENIED,
    TOO_MANY_AUTH_ATTEMPTS,
    AUTHENTICATION_TIMEOUT,
        btnVariants: {
            AUTHENTICATING: 'primary', 
            CHALLENGING: 'secondary', 
            OPEN: 'success', 
            ERROR: 'warning', 
            RECONNECTING:'danger',
            CHALLENGE_DENIFED: 'outline-primary', 
            A: 'outline-secondary',
            B: 'outline-success',
            C: 'outline-warning',
            CLOSED: 'outline-danger'
        }
    } */
  },
  computed: {
    connectionState: function () {
        return this.client.getConnectionState()
    }
  },
}
</script>

<style scoped>
</style>
