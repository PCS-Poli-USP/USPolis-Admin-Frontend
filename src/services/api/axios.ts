import axios from 'axios';

const BASE_URL = import.meta.env.VITE_USPOLIS_API_ENDPOINT;

export default axios.create({ baseURL: BASE_URL });

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
