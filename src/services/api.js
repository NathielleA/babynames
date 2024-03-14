import axios from "axios";

export default axios.create({
    timeout : 9000,
    headers : {
    'Accept': 'application/json', // Exemplo de cabeçalho, ajuste conforme necessário
    }

});

