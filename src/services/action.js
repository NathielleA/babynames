import api from './api.js'
import { API_BASE_URL } from './config.js';

export default{
    postAction : (item, nameID,action,userId,lat,lon,page,relationalItemID,relationalName) =>{
        let data = {"name":item,
        "nameID" : nameID,
        "userId" : userId,
        "action" : action,
        "lat" :lat,
        "lon" : lon,
        "page" : page,
        "ralationalName" : relationalName,
        "relationalNameID" : relationalItemID
    }
        const url = `${API_BASE_URL}/postAction`;
        console.log(data)
        return api.post(url,data,);
    }
}
