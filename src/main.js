import 'bulma/css/bulma.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { analytics } from './services/analytics'
import ABTestingReports from './services/reports'
//import Buefy from 'buefy'
//import 'buefy/dist/buefy.css'

const app = createApp(App).use(store)

// app.use(router)
// //app.use(Buefy)
// app.mount('#app')

// Configuração do Google Analytics e Analytics personalizado
router.afterEach((to, from) => {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'G-1WSF5H7V0P', { page_path: to.path });
    }
    
    // Rastrear mudança de página no analytics personalizado
    analytics.trackPageView(to.name, to.path);
});

// Disponibilizar analytics e relatórios globalmente
app.config.globalProperties.$analytics = analytics;

// Disponibilizar relatórios globalmente (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  window.abReports = new ABTestingReports();
  console.log('📊 A/B Testing Analytics carregado!');
  console.log('Execute abReports.printSummary() no console para ver estatísticas');
}

// Usa o router 
app.use(router).mount('#app');