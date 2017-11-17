<template>
    <div class="auth">
        <b-card class="square-border" header-tag="header" footer-tag="footer">
            <p class="mb-0 mt-0">
                <strong>Authentication</strong>
                <b-button disabled size="sm" variant="outline-success" :status="status">
                    {{status}}
                </b-button>
            </p>
            <br>
            <p class="card-desc">Enter login credentials:</p>

            <b-form>
                <b-container fluid>
                    <b-row>
                        <b-col lg="4">
                            <b-form-group>
                                <b-form-input :disabled="isLogged" size="sm" v-model="username" type="text" placeholder="username"></b-form-input>
                            </b-form-group>
                        </b-col>

                        <b-col lg="4">
                            <b-form-group>
                                <b-form-input :disabled="isLogged" size="sm" v-model="password" type="text" placeholder="password"></b-form-input>
                            </b-form-group>
                        </b-col>

                        <b-col lg="4">
                            <b-form-group>
                                <b-button :block="true" size="sm" :variant="loginActionClass" @click="isLogged ? logout() : login()">
                                    {{ isLogged ? 'Logout' : 'Login' }} 
                                </b-button>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-container>
            </b-form>
        </b-card>
    </div>
</template>

<script>
export default {
  name: 'auth',
  props: ['client'],
  data () {
    return { username: '', password: '' }
  },
  computed: {
    isLogged: function() {
        return this.client.getConnectionState() === 'OPEN'
    },
    status: function () {
        return this.isLogged ? `user: ${this.username}` : 'off'
    },
    loginActionClass: function () {
        return this.isLogged ? 'danger' : 'success'
    }
  },
  methods: {
      login: function () {
        const credentials = Object.assign({
            username: this.username
        }, this.password.length ? { password: this.password } : {})

        this.client.login(credentials, (logged) => {})
      },
      logout: function () {
         
      }
  }
}
</script>

<style scoped>
</style>
