import axios from "axios";

export default axios.create({
    baseURL : "https://adam-serveless-babynames.vercel.app/",
    timeout : 5000,
    headers : {
    'Accept': 'application/json', // Exemplo de cabeçalho, ajuste conforme necessário
    'Acess-Control-Origin' : ''
    }

});

