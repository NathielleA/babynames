import api from './api.js'
import { API_BASE_URL } from './config.js';

export default{
    getNamesFromPhrase : (names) =>{
        let url = `${API_BASE_URL}/getUser`;
        for (let name in names){
            url.concat(`?names=${name}`)
        }

        return api.get(url)
    }
}