import Axios from 'axios';
import { APP_SERVER_URL } from '../config/env';

const axios = Axios.create({
	baseURL: APP_SERVER_URL,
	withCredentials: true
});

export default axios;