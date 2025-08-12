import 'bulma/css/bulma.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { analytics } from './services/analytics'
import ABTestingReports from './services/reports'
import AnalyticsToggle from './services/analytics-toggle'
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

// Disponibilizar relatórios globalmente
// Em desenvolvimento: sempre disponível
// Em produção: disponível se analytics estiver habilitado
const shouldEnableReports = process.env.NODE_ENV === 'development' || 
  new URLSearchParams(window.location.search).get('analytics') === 'true' ||
  localStorage.getItem('enable_analytics') === 'true' ||
  document.cookie.includes('admin_analytics=true');

if (shouldEnableReports) {
  window.abReports = new ABTestingReports();
  console.log('📊 A/B Testing Analytics carregado!');
  console.log('Execute abReports.printSummary() no console para ver estatísticas');
  
  // Se não for desenvolvimento, habilitar analytics localmente
  if (process.env.NODE_ENV !== 'development') {
    localStorage.setItem('enable_analytics', 'true');
    console.log('Analytics habilitado para esta sessão. Para desabilitar, use o botão no dashboard.');
  }
}

// Sempre disponibilizar o toggle para habilitar/desabilitar
window.AnalyticsToggle = AnalyticsToggle;

// Usa o router 
app.use(router).mount('#app');