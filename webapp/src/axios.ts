import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://172.162.240.176:8800"
});