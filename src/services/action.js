import api from './api.js'
import { API_BASE_URL } from './config.js';

export default{
    postAction : (item,action,userId,lat,lon,page) =>{
        let data = {"item":item,
        "tokenId" : userId,
        "action" : action,
        "lat" :lat,
        "lon" : lon,
        "page" : page
    }
        const url = `${API_BASE_URL}/postAction`;
        return api.post(url,data,);
    }
}
