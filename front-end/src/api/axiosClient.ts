import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: attach token dynamically
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token') // or get from context
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default axiosClient
