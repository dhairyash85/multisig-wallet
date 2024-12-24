import axios from "axios";

const DEV_URL = "http://localhost:5000/api/txn";
axios.defaults.baseURL =DEV_URL
axios.defaults.headers.post["Content-Type"] = "application/json";
export default axios;