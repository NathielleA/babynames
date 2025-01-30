import axios from "axios";

export default axios.create({
    baseURL: "https://adam-serveless-babynames.vercel.app",
    timeout: 9000,
    withCredentials: true, // Permite cookies e credenciais
    headers: {
        'Accept': 'application/json',
    }

});

