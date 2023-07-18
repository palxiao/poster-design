
import axios from 'axios'

const httpRequest = axios.create({
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
})

httpRequest.interceptors.response.use((config) => {
  return config.data
})

export default httpRequest
