// Serviço de Analytics para A/B Testing
export class AnalyticsService {
  constructor() {
    this.sessionStartTime = Date.now();
    this.pageStartTime = Date.now();
    this.userId = this.generateUserId();
    this.variant = this.getCookie('variant');
    this.sessionId = this.generateSessionId();
    
    // Inicializar eventos de rastreamento
    this.initializeTracking();
    
    // Enviar evento inicial de sessão
    this.trackSession();
  }

  generateUserId() {
    let userId = this.getCookie('user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      this.setCookie('user_id', userId, 365); // Cookie expira em 1 ano
    }
    return userId;
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  initializeTracking() {
    // Rastrear tempo na página quando sair
    window.addEventListener('beforeunload', () => {
      this.trackPageTime();
    });

    // Rastrear mudanças de visibilidade da aba
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackPageTime();
      } else {
        this.pageStartTime = Date.now();
      }
    });

    // Rastrear eventos de clique importantes
    document.addEventListener('click', (event) => {
      this.trackClick(event);
    });
  }

  trackSession() {
    const sessionData = {
      event_name: 'ab_test_session_start',
      user_id: this.userId,
      session_id: this.sessionId,
      variant: this.variant,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`
    };

    this.sendToAnalytics('ab_test_session_start', sessionData);
    
    // Também enviar para Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test_session_start', {
        custom_parameter_1: this.variant,
        custom_parameter_2: this.userId,
        custom_parameter_3: this.sessionId
      });
    }
  }

  trackPageView(routeName, path) {
    const pageData = {
      event_name: 'ab_test_page_view',
      user_id: this.userId,
      session_id: this.sessionId,
      variant: this.variant,
      page_name: routeName,
      page_path: path,
      timestamp: new Date().toISOString()
    };

    this.sendToAnalytics('ab_test_page_view', pageData);
    
    // Reset timer da página
    this.pageStartTime = Date.now();

    // Enviar para Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: routeName,
        page_location: window.location.href,
        custom_parameter_1: this.variant,
        custom_parameter_2: this.userId
      });
    }
  }

  trackPageTime() {
    const timeSpent = Date.now() - this.pageStartTime;
    
    if (timeSpent > 1000) { // Só rastrear se ficou mais de 1 segundo
      const timeData = {
        event_name: 'ab_test_time_on_page',
        user_id: this.userId,
        session_id: this.sessionId,
        variant: this.variant,
        page_path: window.location.pathname,
        time_spent_ms: timeSpent,
        time_spent_seconds: Math.round(timeSpent / 1000),
        timestamp: new Date().toISOString()
      };

      this.sendToAnalytics('ab_test_time_on_page', timeData);

      // Enviar para Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          name: 'page_time',
          value: Math.round(timeSpent / 1000),
          custom_parameter_1: this.variant,
          custom_parameter_2: this.userId
        });
      }
    }
  }

  trackClick(event) {
    // Rastrear cliques em elementos importantes
    const target = event.target;
    const tagName = target.tagName.toLowerCase();
    const className = target.className;
    const id = target.id;

    if (tagName === 'button' || tagName === 'a' || className.includes('btn') || className.includes('button')) {
      const clickData = {
        event_name: 'ab_test_click',
        user_id: this.userId,
        session_id: this.sessionId,
        variant: this.variant,
        element_tag: tagName,
        element_class: className,
        element_id: id,
        element_text: target.textContent?.substring(0, 100) || '',
        page_path: window.location.pathname,
        timestamp: new Date().toISOString()
      };

      this.sendToAnalytics('ab_test_click', clickData);

      // Enviar para Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'engagement',
          event_label: `${this.variant}_${tagName}`,
          custom_parameter_1: this.variant,
          custom_parameter_2: this.userId
        });
      }
    }
  }

  trackSearch(searchTerm, resultsCount) {
    const searchData = {
      event_name: 'ab_test_search',
      user_id: this.userId,
      session_id: this.sessionId,
      variant: this.variant,
      search_term: searchTerm,
      results_count: resultsCount,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    this.sendToAnalytics('ab_test_search', searchData);

    // Enviar para Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'search', {
        search_term: searchTerm,
        custom_parameter_1: this.variant,
        custom_parameter_2: this.userId
      });
    }
  }

  trackConversion(conversionType, value = null) {
    const conversionData = {
      event_name: 'ab_test_conversion',
      user_id: this.userId,
      session_id: this.sessionId,
      variant: this.variant,
      conversion_type: conversionType,
      conversion_value: value,
      page_path: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    this.sendToAnalytics('ab_test_conversion', conversionData);

    // Enviar para Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        event_category: 'ab_test',
        event_label: `${this.variant}_${conversionType}`,
        value: value,
        custom_parameter_1: this.variant,
        custom_parameter_2: this.userId
      });
    }
  }

  async sendToAnalytics(eventName, data) {
    try {
      // Tentar enviar para seu próprio endpoint de analytics (opcional)
      const analyticsEndpoint = '/api/analytics'; // Configure seu endpoint
      
      await fetch(analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).catch(() => {
        // Se falhar, armazenar localmente para envio posterior
        this.storeLocallyForLater(data);
      });
    } catch (error) {
      // Armazenar localmente se não conseguir enviar
      this.storeLocallyForLater(data);
    }
  }

  storeLocallyForLater(data) {
    try {
      const stored = JSON.parse(localStorage.getItem('analytics_queue') || '[]');
      stored.push(data);
      
      // Manter apenas os últimos 100 eventos
      if (stored.length > 100) {
        stored.splice(0, stored.length - 100);
      }
      
      localStorage.setItem('analytics_queue', JSON.stringify(stored));
    } catch (error) {
      console.warn('Não foi possível armazenar dados de analytics localmente:', error);
    }
  }

  getStoredAnalytics() {
    try {
      return JSON.parse(localStorage.getItem('analytics_queue') || '[]');
    } catch (error) {
      return [];
    }
  }

  clearStoredAnalytics() {
    localStorage.removeItem('analytics_queue');
  }

  // Método para obter estatísticas do usuário atual
  getUserStats() {
    const sessionTime = Date.now() - this.sessionStartTime;
    
    return {
      userId: this.userId,
      sessionId: this.sessionId,
      variant: this.variant,
      sessionDuration: sessionTime,
      sessionDurationFormatted: this.formatTime(sessionTime),
      pageViews: this.getStoredAnalytics().filter(item => item.event_name === 'ab_test_page_view').length
    };
  }

  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

// Instância global do serviço de analytics
export const analytics = new AnalyticsService();
