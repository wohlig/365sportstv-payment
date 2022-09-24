import axios from 'axios'
const ApiUrl = process.env.NUXT_ENV_API_URL

export default {
  getAllPendingRequestsForAdmin(data) {
    return axios.post(
      `${ApiUrl}/transaction/getAllPendingRequestsForAdmin`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.accessToken,
        },
      }
    )
  },
  updateManualTransferStatus(id, data) {
    return axios.post(
      `${ApiUrl}/transaction/updateManualTransferStatus/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.accessToken,
        },
      }
    )
  },
}
