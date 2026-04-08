import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((req) => {
  const profile = localStorage.getItem('Profile');
  if (profile) {
    const token = JSON.parse(profile)?.token;
    if (token) req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

async function post(path, payload) {
  const { data } = await api.post(path, payload);
  return data;
}

export async function improveQuestion({ title, body }) {
  return post('/ai/improve-question', { title, body });
}

export async function generateAnswer({ title, body }) {
  return post('/ai/generate-answer', { title, body });
}

export async function suggestTags({ title, body }) {
  return post('/ai/suggest-tags', { title, body });
}
