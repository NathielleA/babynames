import api from './api.js'
import { API_BASE_URL } from './config.js';

export default {
    postActionName : (iten_name,userToken,userID,action,lat,lon,page,relationalItemID,relationalName=iten_name) =>{
        let data = {
        "itenName":iten_name,
        "userToken" : userToken,
        "userID" : userID,
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