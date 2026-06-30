/**
 * services/api.js
 * Base API service – configure your axios/fetch instance here.
 * Placeholder – to be implemented when backend is connected.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = {
  baseUrl: BASE_URL,
}

export default api
