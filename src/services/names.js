import api from './api.js'
import { API_BASE_URL } from './config.js';

export default{
    getNames : (name) => {
        const url = `${API_BASE_URL}/getNames?name=${name}`;
        return api.get(url)
    }

}
