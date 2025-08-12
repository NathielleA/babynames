// Utilitário para migrar dados de analytics para usar o userID correto
class AnalyticsMigration {
  
  static migrateToCorrectUserId() {
    const correctUserId = localStorage.getItem("userID");
    
    if (!correctUserId) {
      console.warn("Não foi possível encontrar userID no sistema principal");
      return false;
    }
    
    // Migrar eventos armazenados
    try {
      const storedEvents = JSON.parse(localStorage.getItem('analytics_queue') || '[]');
      const migratedEvents = storedEvents.map(event => ({
        ...event,
        user_id: correctUserId
      }));
      
      localStorage.setItem('analytics_queue', JSON.stringify(migratedEvents));
      console.log(`✅ ${migratedEvents.length} eventos migrados para userID: ${correctUserId}`);
    } catch (error) {
      console.error("Erro ao migrar eventos:", error);
    }
    
    // Migrar atribuições de variantes  
    try {
      const variantAssignments = JSON.parse(localStorage.getItem('variant_assignments') || '[]');
      const migratedAssignments = variantAssignments.map(assignment => ({
        ...assignment,
        user_id: correctUserId
      }));
      
      localStorage.setItem('variant_assignments', JSON.stringify(migratedAssignments));
      console.log(`✅ ${migratedAssignments.length} atribuições migradas para userID: ${correctUserId}`);
    } catch (error) {
      console.error("Erro ao migrar atribuições:", error);
    }
    
    // Limpar cookie antigo se existir
    document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    console.log(`🎉 Migração concluída! Todos os dados agora usam userID: ${correctUserId}`);
    return true;
  }
  
  static clearInconsistentData() {
    const correctUserId = localStorage.getItem("userID");
    
    if (!correctUserId) {
      console.warn("Não foi possível encontrar userID no sistema principal");
      return false;
    }
    
    // Remover eventos com userID incorreto
    try {
      const storedEvents = JSON.parse(localStorage.getItem('analytics_queue') || '[]');
      const validEvents = storedEvents.filter(event => 
        event.user_id === correctUserId || !event.user_id
      );
      
      localStorage.setItem('analytics_queue', JSON.stringify(validEvents));
      console.log(`🧹 Removidos ${storedEvents.length - validEvents.length} eventos com userID incorreto`);
    } catch (error) {
      console.error("Erro ao limpar eventos:", error);
    }
    
    // Remover atribuições com userID incorreto
    try {
      const variantAssignments = JSON.parse(localStorage.getItem('variant_assignments') || '[]');
      const validAssignments = variantAssignments.filter(assignment => 
        assignment.user_id === correctUserId || !assignment.user_id
      );
      
      localStorage.setItem('variant_assignments', JSON.stringify(validAssignments));
      console.log(`🧹 Removidas ${variantAssignments.length - validAssignments.length} atribuições com userID incorreto`);
    } catch (error) {
      console.error("Erro ao limpar atribuições:", error);
    }
    
    return true;
  }
  
  static checkDataConsistency() {
    const correctUserId = localStorage.getItem("userID");
    
    if (!correctUserId) {
      console.warn("❌ UserID não encontrado no sistema principal");
      return false;
    }
    
    console.log(`🔍 Verificando consistência para userID: ${correctUserId}`);
    
    // Verificar eventos
    try {
      const storedEvents = JSON.parse(localStorage.getItem('analytics_queue') || '[]');
      const inconsistentEvents = storedEvents.filter(event => 
        event.user_id && event.user_id !== correctUserId
      );
      
      if (inconsistentEvents.length > 0) {
        console.warn(`⚠️ ${inconsistentEvents.length} eventos com userID inconsistente encontrados`);
        console.log("Execute AnalyticsMigration.migrateToCorrectUserId() para corrigir");
        return false;
      } else {
        console.log(`✅ ${storedEvents.length} eventos estão consistentes`);
      }
    } catch (error) {
      console.error("Erro ao verificar eventos:", error);
    }
    
    // Verificar atribuições
    try {
      const variantAssignments = JSON.parse(localStorage.getItem('variant_assignments') || '[]');
      const inconsistentAssignments = variantAssignments.filter(assignment => 
        assignment.user_id && assignment.user_id !== correctUserId
      );
      
      if (inconsistentAssignments.length > 0) {
        console.warn(`⚠️ ${inconsistentAssignments.length} atribuições com userID inconsistente encontradas`);
        console.log("Execute AnalyticsMigration.migrateToCorrectUserId() para corrigir");
        return false;
      } else {
        console.log(`✅ ${variantAssignments.length} atribuições estão consistentes`);
      }
    } catch (error) {
      console.error("Erro ao verificar atribuições:", error);
    }
    
    console.log("🎉 Todos os dados estão consistentes!");
    return true;
  }
  
  static getSystemInfo() {
    const correctUserId = localStorage.getItem("userID");
    const analyticsUserId = window.analytics ? window.analytics.userId : 'N/A';
    
    console.log("📋 Informações do Sistema:");
    console.log(`Sistema Principal userID: ${correctUserId || 'Não encontrado'}`);
    console.log(`Analytics userID: ${analyticsUserId}`);
    console.log(`IDs são consistentes: ${correctUserId === analyticsUserId ? '✅' : '❌'}`);
    
    return {
      systemUserId: correctUserId,
      analyticsUserId: analyticsUserId,
      consistent: correctUserId === analyticsUserId
    };
  }
  
  static help() {
    console.log("🔧 Comandos de Migração de Analytics:");
    console.log("");
    console.log("AnalyticsMigration.checkDataConsistency()    - Verificar se dados estão consistentes");
    console.log("AnalyticsMigration.getSystemInfo()           - Ver informações dos userIDs");
    console.log("AnalyticsMigration.migrateToCorrectUserId()  - Migrar dados para userID correto");
    console.log("AnalyticsMigration.clearInconsistentData()   - Remover dados inconsistentes");
    console.log("");
    console.log("💡 Recomendação: Execute checkDataConsistency() primeiro");
  }
}

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
  window.AnalyticsMigration = AnalyticsMigration;
}

export default AnalyticsMigration;
