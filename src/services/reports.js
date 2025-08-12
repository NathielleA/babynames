// Script para gerar relatórios de A/B Testing
// Execute este script no console do navegador para obter relatórios detalhados

class ABTestingReports {
  constructor() {
    this.events = this.getStoredEvents();
    this.variantAssignments = this.getVariantAssignments();
  }

  getStoredEvents() {
    try {
      return JSON.parse(localStorage.getItem('analytics_queue') || '[]');
    } catch (error) {
      return [];
    }
  }

  getVariantAssignments() {
    try {
      return JSON.parse(localStorage.getItem('variant_assignments') || '[]');
    } catch (error) {
      return [];
    }
  }

  // Relatório geral de distribuição de usuários
  getUserDistributionReport() {
    const report = {
      total_users: this.variantAssignments.length,
      variant_a: this.variantAssignments.filter(a => a.variant === 'A').length,
      variant_b: this.variantAssignments.filter(a => a.variant === 'B').length,
      new_users: this.variantAssignments.filter(a => a.user_type === 'new_user').length,
      returning_users: this.variantAssignments.filter(a => a.user_type === 'returning_user').length
    };

    report.variant_a_percentage = report.total_users > 0 ? (report.variant_a / report.total_users * 100).toFixed(2) : 0;
    report.variant_b_percentage = report.total_users > 0 ? (report.variant_b / report.total_users * 100).toFixed(2) : 0;

    return report;
  }

  // Relatório de tempo de sessão por variante
  getSessionTimeReport() {
    const sessionTimes = {};
    
    this.events
      .filter(e => e.event_name === 'ab_test_time_on_page')
      .forEach(event => {
        const variant = event.variant;
        if (!sessionTimes[variant]) {
          sessionTimes[variant] = [];
        }
        sessionTimes[variant].push(event.time_spent_seconds);
      });

    const report = {};
    Object.keys(sessionTimes).forEach(variant => {
      const times = sessionTimes[variant];
      if (times.length > 0) {
        const sum = times.reduce((a, b) => a + b, 0);
        const avg = sum / times.length;
        const sorted = times.sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        
        report[`variant_${variant}`] = {
          average_time_seconds: avg.toFixed(2),
          median_time_seconds: median,
          total_sessions: times.length,
          min_time_seconds: Math.min(...times),
          max_time_seconds: Math.max(...times),
          total_time_minutes: (sum / 60).toFixed(2)
        };
      }
    });

    return report;
  }

  // Relatório de conversões por variante
  getConversionReport() {
    const conversions = {};
    
    this.events
      .filter(e => e.event_name === 'ab_test_conversion')
      .forEach(event => {
        const variant = event.variant;
        const type = event.conversion_type;
        
        if (!conversions[variant]) {
          conversions[variant] = {};
        }
        if (!conversions[variant][type]) {
          conversions[variant][type] = 0;
        }
        conversions[variant][type]++;
      });

    return conversions;
  }

  // Relatório de buscas por variante
  getSearchReport() {
    const searches = {};
    
    this.events
      .filter(e => e.event_name === 'ab_test_search')
      .forEach(event => {
        const variant = event.variant;
        
        if (!searches[variant]) {
          searches[variant] = {
            total_searches: 0,
            unique_terms: new Set(),
            average_results: 0,
            total_results: 0
          };
        }
        
        searches[variant].total_searches++;
        searches[variant].unique_terms.add(event.search_term);
        searches[variant].total_results += event.results_count || 0;
      });

    // Calcular médias
    Object.keys(searches).forEach(variant => {
      const data = searches[variant];
      data.average_results = data.total_searches > 0 ? 
        (data.total_results / data.total_searches).toFixed(2) : 0;
      data.unique_terms_count = data.unique_terms.size;
      data.unique_terms = Array.from(data.unique_terms);
    });

    return searches;
  }

  // Relatório de cliques por variante
  getClickReport() {
    const clicks = {};
    
    this.events
      .filter(e => e.event_name === 'ab_test_click')
      .forEach(event => {
        const variant = event.variant;
        const element = event.element_tag;
        
        if (!clicks[variant]) {
          clicks[variant] = {};
        }
        if (!clicks[variant][element]) {
          clicks[variant][element] = 0;
        }
        clicks[variant][element]++;
      });

    return clicks;
  }

  // Relatório de páginas mais visitadas por variante
  getPageViewReport() {
    const pageViews = {};
    
    this.events
      .filter(e => e.event_name === 'ab_test_page_view')
      .forEach(event => {
        const variant = event.variant;
        const page = event.page_path || event.page_name;
        
        if (!pageViews[variant]) {
          pageViews[variant] = {};
        }
        if (!pageViews[variant][page]) {
          pageViews[variant][page] = 0;
        }
        pageViews[variant][page]++;
      });

    return pageViews;
  }

  // Relatório comparativo completo
  getCompleteReport() {
    const startDate = this.variantAssignments.length > 0 ? 
      new Date(Math.min(...this.variantAssignments.map(a => new Date(a.timestamp)))).toISOString() : 
      'N/A';
    
    const endDate = this.events.length > 0 ? 
      new Date(Math.max(...this.events.map(e => new Date(e.timestamp)))).toISOString() : 
      'N/A';

    return {
      report_metadata: {
        generated_at: new Date().toISOString(),
        data_period: {
          start: startDate,
          end: endDate
        },
        total_events: this.events.length,
        total_assignments: this.variantAssignments.length
      },
      user_distribution: this.getUserDistributionReport(),
      session_times: this.getSessionTimeReport(),
      conversions: this.getConversionReport(),
      searches: this.getSearchReport(),
      clicks: this.getClickReport(),
      page_views: this.getPageViewReport()
    };
  }

  // Exportar relatório como JSON
  exportReport(fileName = null) {
    const report = this.getCompleteReport();
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `ab-testing-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return report;
  }

  // Exportar relatório como CSV
  exportCSV(fileName = null) {
    const events = this.events;
    
    if (events.length === 0) {
      console.warn('Nenhum evento encontrado para exportar');
      return;
    }

    // Obter todas as chaves únicas
    const allKeys = new Set();
    events.forEach(event => {
      Object.keys(event).forEach(key => allKeys.add(key));
    });

    const headers = Array.from(allKeys);
    const csvContent = [
      headers.join(','),
      ...events.map(event => 
        headers.map(header => {
          const value = event[header] || '';
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `ab-testing-events-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Mostrar relatório resumido no console
  printSummary() {
    const report = this.getCompleteReport();
    
    console.log('=== RELATÓRIO DE A/B TESTING ===');
    console.log(`Período: ${report.report_metadata.data_period.start} a ${report.report_metadata.data_period.end}`);
    console.log(`Total de eventos: ${report.report_metadata.total_events}`);
    console.log(`Total de usuários: ${report.user_distribution.total_users}`);
    
    console.log('\n--- DISTRIBUIÇÃO DE USUÁRIOS ---');
    console.log(`Interface A: ${report.user_distribution.variant_a} usuários (${report.user_distribution.variant_a_percentage}%)`);
    console.log(`Interface B: ${report.user_distribution.variant_b} usuários (${report.user_distribution.variant_b_percentage}%)`);
    
    console.log('\n--- TEMPO DE SESSÃO MÉDIO ---');
    Object.keys(report.session_times).forEach(variant => {
      const data = report.session_times[variant];
      console.log(`${variant}: ${data.average_time_seconds}s (${data.total_sessions} sessões)`);
    });
    
    console.log('\n--- CONVERSÕES ---');
    Object.keys(report.conversions).forEach(variant => {
      console.log(`${variant}:`, report.conversions[variant]);
    });

    console.log('\nPara ver o relatório completo, execute: abReports.getCompleteReport()');
    console.log('Para exportar: abReports.exportReport()');
    
    return report;
  }
}

// Instanciar e disponibilizar globalmente
if (typeof window !== 'undefined') {
  window.abReports = new ABTestingReports();
  console.log('📊 Relatórios de A/B Testing carregados!');
  console.log('Execute abReports.printSummary() para ver um resumo');
  console.log('Execute abReports.exportReport() para baixar relatório completo');
}

export default ABTestingReports;
