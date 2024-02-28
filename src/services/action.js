import api from './api.js'


export default{
    postAction : (item,action,userId,lat,lon,page) =>{
        let data = {"item":item,
        "tokenId" : userId,
        "action" : action,
        "lat" :lat,
        "lon" : lon,
        "page" : page
    }
        const url = `/postAction`;
        return api.post(url,data);
    }
}
