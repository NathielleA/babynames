import api from './api.js'

export default{
    getNames : (name) => {
        const url = `/getNames?name=${name}`;
        return api.get(url)
    }

}
