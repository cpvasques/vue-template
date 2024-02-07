import axios from "axios";
import { addBearer, addBearerError } from "./interceptors/addBearer";
import { unauthorized, unauthorizedError } from "./interceptors/unauthorized";

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

http.interceptors.request.use(addBearer, addBearerError);
http.interceptors.response.use(unauthorized, unauthorizedError);

export default http;
