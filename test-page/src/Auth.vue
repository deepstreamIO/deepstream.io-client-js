<template>
    <div class="authentication-component">
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
                                <b-form-input class="auth-username-field" :disabled="isLogged" size="sm" v-model="username" type="text" placeholder="username"></b-form-input>
                            </b-form-group>
                        </b-col>

                        <b-col lg="4">
                            <b-form-group>
                                <b-form-input class="auth-password-field" :disabled="isLogged" size="sm" v-model="password" type="text" placeholder="password"></b-form-input>
                            </b-form-group>
                        </b-col>

                        <b-col lg="4">
                            <b-form-group>
                                <b-button class="auth-login-btn" :block="true" size="sm" :variant="loginActionClass" @click="isLogged ? logout() : login()">
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

        this.client.login(credentials, (logged) => {
            this.client.emit('logged', logged)
        })
      },
      logout: function () {
        this.client.close()
      }
  }
}
</script>

<style scoped>
</style>
