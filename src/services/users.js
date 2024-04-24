import api from './api.js'
import { API_BASE_URL } from './config.js';

export default{
    setUserId : (userId) =>{
        let data = {'userId' : userId};
        const url = `${API_BASE_URL}/postNewUser`;
        return api.post(url,data)
    }
}