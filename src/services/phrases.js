import api from './api.js'
import { API_BASE_URL } from './config.js';

export default{
    getNamesFromPhrase : (phrase) =>{
        let url = `${API_BASE_URL}/searchByPhrase?phrase=${encodeURIComponent(phrase)}`;
        return api.get(url)
    },
    
    searchNamesByPhrase : (phraseText) => {
        let url = `${API_BASE_URL}/getNamesByPhrase?phrase=${encodeURIComponent(phraseText)}`;
        return api.get(url)
    }
}