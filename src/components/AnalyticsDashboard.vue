<template>
  <div class="analytics-dashboard" v-if="showDashboard">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          📊 Analytics Dashboard - A/B Testing
        </p>
        <button class="card-header-icon" @click="toggleDashboard">
          <span class="icon">
            <i class="fas fa-times"></i>
          </span>
        </button>
      </header>
      <div class="card-content">
        <div class="content">
          <div class="columns">
            <div class="column">
              <h6 class="title is-6">Usuário Atual</h6>
              <p><strong>ID:</strong> {{ userStats.userId }}</p>
              <p><strong>Variante:</strong> 
                <span class="tag" :class="userStats.variant === 'A' ? 'is-success' : 'is-info'">
                  Interface {{ userStats.variant }}
                </span>
              </p>
              <p><strong>Tempo de Sessão:</strong> {{ userStats.sessionDurationFormatted }}</p>
              <p><strong>Páginas Visitadas:</strong> {{ userStats.pageViews }}</p>
            </div>
            <div class="column">
              <h6 class="title is-6">Estatísticas Gerais</h6>
              <p><strong>Total de Eventos:</strong> {{ totalEvents }}</p>
              <p><strong>Atribuições A:</strong> {{ variantStats.A }}</p>
              <p><strong>Atribuições B:</strong> {{ variantStats.B }}</p>
              <p><strong>Taxa A/B:</strong> {{ abRatio }}</p>
            </div>
          </div>
          
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-small is-primary" @click="exportData">
                📥 Exportar Dados
              </button>
            </div>
            <div class="control">
              <button class="button is-small is-warning" @click="clearData">
                🗑️ Limpar Dados
              </button>
            </div>
            <div class="control">
              <button class="button is-small is-info" @click="refreshStats">
                🔄 Atualizar
              </button>
            </div>
            <div class="control" v-if="!isDevelopment">
              <button class="button is-small is-danger" @click="disableAnalytics">
                🔒 Desabilitar
              </button>
            </div>
          </div>

          <div class="mt-4" v-if="recentEvents.length > 0">
            <h6 class="title is-6">Eventos Recentes</h6>
            <div class="table-container" style="max-height: 200px; overflow-y: auto;">
              <table class="table is-fullwidth is-striped is-narrow">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Evento</th>
                    <th>Variante</th>
                    <th>Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="event in recentEvents" :key="event.timestamp">
                    <td>{{ formatTime(event.timestamp) }}</td>
                    <td>{{ event.event_name }}</td>
                    <td>
                      <span class="tag is-small" :class="event.variant === 'A' ? 'is-success' : 'is-info'">
                        {{ event.variant }}
                      </span>
                    </td>
                    <td>{{ getEventDetails(event) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Botão flutuante para abrir o dashboard -->
  <button 
    v-if="!showDashboard && showAnalyticsButton" 
    class="floating-analytics-btn"
    @click="toggleDashboard"
    title="Abrir Analytics Dashboard"
  >
    📊
  </button>
</template>

<script>
import { analytics } from '@/services/analytics'

export default {
  name: 'AnalyticsDashboard',
  data() {
    return {
      showDashboard: false,
      userStats: {},
      totalEvents: 0,
      variantStats: { A: 0, B: 0 },
      recentEvents: [],
      refreshInterval: null,
      isDevelopment: process.env.NODE_ENV === 'development'
    }
  },
  computed: {
    abRatio() {
      const total = this.variantStats.A + this.variantStats.B;
      if (total === 0) return '0% / 0%';
      const aPercent = Math.round((this.variantStats.A / total) * 100);
      const bPercent = 100 - aPercent;
      return `${aPercent}% / ${bPercent}%`;
    },
    showAnalyticsButton() {
      // Mostrar em desenvolvimento sempre
      if (this.isDevelopment) return true;
      
      // Em produção, mostrar se:
      // 1. URL contém parâmetro ?analytics=true
      // 2. LocalStorage tem flag de analytics habilitado
      // 3. Cookie de admin está presente
      const urlParams = new URLSearchParams(window.location.search);
      const analyticsParam = urlParams.get('analytics') === 'true';
      const analyticsEnabled = localStorage.getItem('enable_analytics') === 'true';
      const adminCookie = document.cookie.includes('admin_analytics=true');
      
      return analyticsParam || analyticsEnabled || adminCookie;
    }
  },
  mounted() {
    this.refreshStats();
    // Atualizar estatísticas a cada 5 segundos quando o dashboard estiver aberto
    this.refreshInterval = setInterval(() => {
      if (this.showDashboard) {
        this.refreshStats();
      }
    }, 5000);
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    toggleDashboard() {
      this.showDashboard = !this.showDashboard;
      if (this.showDashboard) {
        this.refreshStats();
      }
    },
    
    refreshStats() {
      // Obter estatísticas do usuário atual
      this.userStats = analytics.getUserStats();
      
      // Obter dados armazenados
      const storedEvents = analytics.getStoredAnalytics();
      const variantAssignments = this.getVariantAssignments();
      
      this.totalEvents = storedEvents.length;
      
      // Calcular estatísticas de variantes
      this.variantStats = { A: 0, B: 0 };
      variantAssignments.forEach(assignment => {
        if (assignment.variant === 'A') this.variantStats.A++;
        if (assignment.variant === 'B') this.variantStats.B++;
      });
      
      // Obter eventos recentes (últimos 10)
      this.recentEvents = storedEvents
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
    },
    
    getVariantAssignments() {
      try {
        return JSON.parse(localStorage.getItem('variant_assignments') || '[]');
      } catch (error) {
        return [];
      }
    },
    
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    },
    
    getEventDetails(event) {
      switch (event.event_name) {
        case 'ab_test_page_view':
          return event.page_name || event.page_path;
        case 'ab_test_time_on_page':
          return `${event.time_spent_seconds}s`;
        case 'ab_test_click':
          return event.element_text?.substring(0, 30) || event.element_tag;
        case 'ab_test_search':
          return event.search_term;
        case 'ab_test_conversion':
          return event.conversion_type;
        default:
          return '-';
      }
    },
    
    exportData() {
      const allData = {
        userStats: this.userStats,
        storedEvents: analytics.getStoredAnalytics(),
        variantAssignments: this.getVariantAssignments(),
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    
    clearData() {
      if (confirm('Tem certeza que deseja limpar todos os dados de analytics? Esta ação não pode ser desfeita.')) {
        analytics.clearStoredAnalytics();
        localStorage.removeItem('variant_assignments');
        this.refreshStats();
      }
    },
    
    disableAnalytics() {
      if (confirm('Desabilitar dashboard de analytics? Você pode reativá-lo usando ?analytics=true na URL.')) {
        localStorage.removeItem('enable_analytics');
        document.cookie = 'admin_analytics=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        this.showDashboard = false;
      }
    }
  }
}
</script>

<style scoped>
.analytics-dashboard {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 600px;
  max-width: 90vw;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.floating-analytics-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #3273dc;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 999;
  transition: all 0.3s ease;
}

.floating-analytics-btn:hover {
  background: #2366d1;
  transform: scale(1.1);
}

.table-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.tag.is-small {
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .analytics-dashboard {
    width: 95vw;
    top: 10px;
    right: 2.5vw;
  }
  
  .columns {
    display: block;
  }
  
  .column {
    margin-bottom: 1rem;
  }
}
</style>
