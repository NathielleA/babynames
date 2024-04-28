import 'bulma/css/bulma.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

const app = createApp(App).use(store)

app.use(router)
app.use(Buefy)
app.mount('#app')
