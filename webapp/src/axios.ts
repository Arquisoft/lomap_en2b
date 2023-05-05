import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://172.162.240.176:8800"
});