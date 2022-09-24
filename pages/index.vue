<template>
  <div class="text-center bg">
    <v-card class="card-section">
      <div class="mt-10">
        <b>
          <p class="font-20 headsignup orange-txt">Payment Master Login</p></b
        >
      </div>
      <form @submit.prevent="callLoginApi">
        <div class="input-field mx-6 mt-6">
          <div class="mt-3 d-flex">
            <v-text-field
              v-model="username"
              dense
              label="Username *"
              type="text"
            >
            </v-text-field>
          </div>

          <div class="mt-3 password">
            <v-text-field
              dense
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              label="Password *"
            >
            </v-text-field>
          </div>
          <div class="pt-7 text-center">
            <v-btn type="submit" class="font-14 orange-btn py-5 mb-5"
              >LOGIN</v-btn
            >
          </div>
        </div>
      </form>
    </v-card>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import loginService from '../service/loginService.js'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      show1: false,
    }
  },
  mixins: [validationMixin],

  methods: {
    async callLoginApi() {
      try {
        const data = {}
        data.username = this.username
        data.password = this.password
        const result = await loginService.paymentMasterLogin(data)
        if (result.status === 200) {
          localStorage.accessToken = result.data.accessToken
          this.$notifier.showMessage({
            content: 'Login Successful',
            color: '#4CAF50',
          })
          this.$router.push({
            path: `pendingRequests`,
          })
        }
      } catch (error) {
        console.log(error)
        this.$notifier.showMessage({
          content: 'Incorrect Username or password',
          color: '#D50000',
        })
      }
    },
  },
}
</script>

<style lang="scss">
.card-section {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #20221f !important;
  border: 5px solid #f26d25 !important;
  opacity: 0.9;
  width: 85vw;
  max-width: 600px !important;
}
.input-field {
  .theme--light.v-text-field > .v-input__control > .v-input__slot:before {
    border-color: white !important;
  }
  .theme--light.v-label {
    color: white !important;
  }
  .theme--light.v-input input,
  .theme--light.v-input textarea {
    color: white !important;
  }
  .v-application .primary--text {
    color: white !important;
    caret-color: white !important;
  }
  .v-label {
    font-size: 14px !important;
  }
}
.bg {
  width: 100%;
  height: 100%;
  background: url('https://wallpapercave.com/wp/wp3049846.jpg') no-repeat center
    center;
  background-size: cover;
}
.password .mdi:before {
  color: white;
}
</style>
