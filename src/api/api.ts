import axios from 'axios';

const api = {
  get: (url: string) => {
    return axios.get(url);
  },
  post: (url: string, payload: string) => {
    return axios.post(url, payload, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
  },
  put: (url: string, payload: string) => {
    return axios.put(url, payload, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
  }
}

export default api;