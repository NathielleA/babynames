// Utilitário para habilitar/desabilitar Analytics em Produção
// Execute este código no console do navegador em produção

class AnalyticsToggle {
  
  // Habilitar analytics na sessão atual
  static enable() {
    localStorage.setItem('enable_analytics', 'true');
    location.reload();
    console.log('✅ Analytics habilitado! A página será recarregada.');
  }
  
  // Habilitar analytics permanentemente com cookie
  static enablePermanent() {
    const expiry = new Date();
    expiry.setTime(expiry.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 dias
    document.cookie = `admin_analytics=true; expires=${expiry.toUTCString()}; path=/`;
    localStorage.setItem('enable_analytics', 'true');
    location.reload();
    console.log('✅ Analytics habilitado permanentemente por 30 dias! A página será recarregada.');
  }
  
  // Desabilitar analytics
  static disable() {
    localStorage.removeItem('enable_analytics');
    document.cookie = 'admin_analytics=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    location.reload();
    console.log('❌ Analytics desabilitado! A página será recarregada.');
  }
  
  // Verificar status atual
  static status() {
    const isDev = process.env.NODE_ENV === 'development';
    const urlParam = new URLSearchParams(window.location.search).get('analytics') === 'true';
    const localStorage = window.localStorage.getItem('enable_analytics') === 'true';
    const cookie = document.cookie.includes('admin_analytics=true');
    const enabled = isDev || urlParam || localStorage || cookie;
    
    console.log('📊 Status do Analytics:');
    console.log(`Ambiente: ${isDev ? 'Desenvolvimento' : 'Produção'}`);
    console.log(`Parâmetro URL (?analytics=true): ${urlParam ? '✅' : '❌'}`);
    console.log(`localStorage: ${localStorage ? '✅' : '❌'}`);
    console.log(`Cookie permanente: ${cookie ? '✅' : '❌'}`);
    console.log(`Status geral: ${enabled ? '🟢 HABILITADO' : '🔴 DESABILITADO'}`);
    
    if (!enabled) {
      console.log('\nPara habilitar:');
      console.log('• AnalyticsToggle.enable() - habilitar nesta sessão');
      console.log('• AnalyticsToggle.enablePermanent() - habilitar por 30 dias');
      console.log('• Ou adicione ?analytics=true na URL');
    }
    
    return enabled;
  }
  
  // Mostrar ajuda
  static help() {
    console.log('🔧 Comandos disponíveis para Analytics:');
    console.log('');
    console.log('AnalyticsToggle.status()           - Ver status atual');
    console.log('AnalyticsToggle.enable()           - Habilitar nesta sessão');
    console.log('AnalyticsToggle.enablePermanent()  - Habilitar por 30 dias');
    console.log('AnalyticsToggle.disable()          - Desabilitar completamente');
    console.log('');
    console.log('Ou adicione ?analytics=true na URL para acesso temporário');
    console.log('');
    console.log('Quando habilitado, procure pelo ícone 📊 no canto da tela');
  }
}

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
  window.AnalyticsToggle = AnalyticsToggle;
  
  // Mostrar status se analytics já estiver disponível
  if (window.abReports) {
    console.log('📊 Analytics já está habilitado!');
    console.log('Execute AnalyticsToggle.help() para ver comandos disponíveis');
  } else {
    console.log('📊 Para habilitar analytics, execute: AnalyticsToggle.help()');
  }
}

export default AnalyticsToggle;
