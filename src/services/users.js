import api from './api.js'
import { API_BASE_URL } from './config.js';

export default{
    setUserId : (userId) =>{
        let data = {'userId' : userId};
        const url = `${API_BASE_URL}/user`;
        return api.post(url,data)
    },

    getUserId : (userId) =>{
        const url = `${API_BASE_URL}/getUser?userId=${userId}`;
        return api.get(url)
    }
}