import axios from 'axios'
const loginUrl = process.env.NUXT_ENV_LOGIN_URL

export default {
  paymentMasterLogin(data) {
    return axios.post(`${loginUrl}/user/paymentMasterLogin`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}