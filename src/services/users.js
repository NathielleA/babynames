import api from './api.js'


export default{
    setUserId : (userId) =>{
        let data = {'userId' : userId};
        let code = import.meta.env.VITE_AZURE_POST_NEW_USER_CODE;
        const url = `/postNewUser?code=${code}`;
        return api.post(url,data)
    }
}