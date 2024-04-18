import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:8081/api/circle',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  setBaseUrl(baseUrl) {
    apiClient.defaults.baseURL = baseUrl;
  },

  submitCircle(circleData,requestData) {
    return apiClient.post('', circleData, requestData);
  },

  getCirclesBySetId(setId) {
    const url = setId ? `/${setId}` : '';
    return apiClient.get(url);
  },

  get(url, config) {
    return apiClient.get(url, config);
  },

};