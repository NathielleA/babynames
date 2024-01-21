import axios from "axios";

export default axios.create({
    baseURL : import.meta.env.VITE_API,
    timeout : 5000,
    headers : {
    'Accept': 'application/json', // Exemplo de cabeçalho, ajuste conforme necessário
    'Acess-Control-Origin' : ''
    }

});

