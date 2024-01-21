import api from './api.js'
import auth from './auth.js';


export default{
    postAction : (item,action,userId,lat,lon,page) =>{
        let data = {"item":item,
        "tokenId" : userId,
        "action" : action,
        "lat" :lat,
        "lon" : lon,
        "page" : page
    }
        let code = import.meta.env.VITE_AZURE_POST_ACTION_CODE;
        const url = `/postAction?code=${code}`;
        return api.post(url,data,auth);
    }
}
