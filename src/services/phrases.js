import api from './api.js'
import { API_BASE_URL } from './config.js';

export default{
    getNamesFromPhrase : (names) =>{
        const queryParams = names.map(name => `names=${encodeURIComponent(name)}`).join('&');
        let url = `${API_BASE_URL}/phraseNames?${queryParams}`;
        return api.get(url);
    },
    
    getActualPhrase : (userId) => {
        let url = `${API_BASE_URL}/getActualPhrase?userId=${userId}`;
        return api.get(url);
    },
    
    getUserPhrases : (userId) => {
        let url = `${API_BASE_URL}/getUser?userId=${userId}`;
        return api.get(url);
    }
}