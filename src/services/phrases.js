import api from './api.js'
import { API_BASE_URL } from './config.js';

export default{
    // Busca nomes específicos por uma lista de nomes
    getPhraseNames : (names) => {
        let url = `${API_BASE_URL}/phraseNames`;
        const params = new URLSearchParams();
        names.forEach(name => params.append('names', name));
        return api.get(`${url}?${params.toString()}`);
    }
}