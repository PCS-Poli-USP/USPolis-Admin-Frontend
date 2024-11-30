import axios from 'axios';

const BASE_URL = process.env.REACT_APP_USPOLIS_API_ENDPOINT;

export default axios.create({ baseURL: BASE_URL });

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
