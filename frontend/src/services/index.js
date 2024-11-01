import axios from 'axios';
const ORIGIN = 'https://todai.decentralbros.dev';

const API_URL = `${ORIGIN}/app`;
export const token = localStorage.getItem('token') ?? '';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'content-type': 'application/json',
    authorization: `Bearer ${token}`,
  },
});
