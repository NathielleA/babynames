import 'bulma/css/bulma.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { analytics } from './services/analytics'
import ABTestingReports from './services/reports'
import AnalyticsToggle from './services/analytics-toggle'
import AnalyticsMigration from './services/analytics-migration'
//import Buefy from 'buefy'
//import 'buefy/dist/buefy.css'

const app = createApp(App).use(store)

// Sincronizar analytics com o sistema de usuários após montar a aplicação
app.mixin({
  mounted() {
    // Sincronizar na primeira montagem de qualquer componente
    if (this.$store && this.$store.state.userToken) {
      analytics.syncWithUserSystem(this.$store);
    }
  }
});

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

// Sincronizar analytics com o sistema de usuários após o store ser inicializado
router.beforeEach((to, from, next) => {
  // Sincronizar userID do analytics com o sistema principal
  if (app.config.globalProperties.$store) {
    analytics.syncWithUserSystem(app.config.globalProperties.$store);
  }
  next();
});

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

// Disponibilizar utilitário de migração
window.AnalyticsMigration = AnalyticsMigration;

// Verificar automaticamente consistência dos dados em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    const info = AnalyticsMigration.getSystemInfo();
    if (!info.consistent) {
      console.warn("⚠️ UserIDs inconsistentes detectados!");
      console.log("Execute AnalyticsMigration.help() para ver opções de correção");
    }
  }, 2000); // Aguardar 2 segundos para o sistema carregar
}

// Usa o router 
app.use(router).mount('#app');