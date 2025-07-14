import api from './api.js'
import { API_BASE_URL } from './config.js';

export default{
    // Busca nomes específicos por uma lista de nomes
    getPhraseNames : (names) => {
        let url = `${API_BASE_URL}/phraseNames`;
        const params = new URLSearchParams();
        names.forEach(name => params.append('names', name));
        return api.get(`${url}?${params.toString()}`);
    },
    
    // Busca dados do usuário incluindo frases
    getUser : (userId) => {
        let url = `${API_BASE_URL}/getUser?userId=${userId}`;
        return api.get(url);
    },
    
    // Obtém frase atual do usuário
    getActualPhrase : (userId) => {
        let url = `${API_BASE_URL}/getActualPhrase?userId=${userId}`;
        return api.get(url);
    }
}