# Sistema de Analytics para A/B Testing

Este sistema permite rastrear e analisar o comportamento dos usuários nas duas interfaces (A e B) do seu site de nomes de bebês.

## 📊 Funcionalidades

### Rastreamento Automático
- **Atribuição de Variantes**: Rastreia qual interface cada usuário recebe (A ou B)
- **Tempo de Sessão**: Mede quanto tempo os usuários passam em cada página
- **Navegação**: Rastreia as páginas visitadas por cada usuário
- **Interações**: Monitora cliques em botões e links importantes
- **Buscas**: Registra termos pesquisados e número de resultados
- **Conversões**: Rastreia ações importantes como cliques em nomes

### Identificação de Usuários
- Cada usuário recebe um ID único armazenado em cookie
- Usuários retornantes são identificados automaticamente
- Sessões são rastreadas individualmente

## 🚀 Como Usar

### 1. Visualização em Tempo Real (Desenvolvimento)

Durante o desenvolvimento, você pode ver estatísticas em tempo real:

1. Abra o site em modo de desenvolvimento
2. Procure pelo ícone flutuante 📊 no canto inferior direito
3. Clique para abrir o dashboard de analytics

### 2. Relatórios via Console

No console do navegador (F12), você pode executar:

```javascript
// Ver resumo das estatísticas
abReports.printSummary()

// Obter relatório completo
const report = abReports.getCompleteReport()
console.log(report)

// Exportar dados como arquivo JSON
abReports.exportReport()

// Exportar eventos como CSV
abReports.exportCSV()
```

### 3. Google Analytics

Os eventos também são enviados para o Google Analytics configurado (ID: G-1WSF5H7V0P) com parâmetros customizados para distinguir as variantes.

## 📈 Tipos de Dados Coletados

### Eventos Principais

1. **Session Start** (`ab_test_session_start`)
   - ID do usuário e sessão
   - Variante atribuída (A ou B)
   - Informações do navegador
   - Resolução de tela

2. **Page View** (`ab_test_page_view`)
   - Página visitada
   - Variante do usuário
   - Timestamp

3. **Time on Page** (`ab_test_time_on_page`)
   - Tempo gasto em cada página
   - Enviado quando o usuário sai da página

4. **Search** (`ab_test_search`)
   - Termo pesquisado
   - Número de resultados
   - Variante do usuário

5. **Click** (`ab_test_click`)
   - Elemento clicado
   - Localização na página
   - Texto do elemento

6. **Conversion** (`ab_test_conversion`)
   - Tipo de conversão (ex: "name_click")
   - Valor da conversão
   - Contexto

### Atribuição de Variantes

```javascript
{
  "event_name": "variant_assignment",
  "variant": "A", // ou "B"
  "user_type": "new_user", // ou "returning_user"
  "timestamp": "2025-08-08T10:30:00.000Z",
  "user_agent": "Mozilla/5.0..."
}
```

## 📊 Relatórios Disponíveis

### 1. Distribuição de Usuários
- Total de usuários por variante
- Percentual A vs B
- Usuários novos vs retornantes

### 2. Tempo de Sessão
- Tempo médio por variante
- Tempo mediano
- Tempo mínimo e máximo
- Total de sessões

### 3. Conversões
- Número de conversões por tipo
- Taxa de conversão por variante

### 4. Buscas
- Número total de buscas
- Termos únicos pesquisados
- Resultados médios por busca

### 5. Cliques
- Elementos mais clicados
- Distribuição por variante

### 6. Páginas
- Páginas mais visitadas
- Tempo gasto por página

## 🔧 Configuração Técnica

### Arquivos Principais

- `/src/services/analytics.js` - Serviço principal de analytics
- `/src/services/reports.js` - Gerador de relatórios
- `/src/components/AnalyticsDashboard.vue` - Interface visual
- `/src/router/index.js` - Rastreamento de navegação

### Integração

O sistema está integrado automaticamente:
- `main.js` inicializa o analytics
- Router rastreia mudanças de página automaticamente
- Views de busca rastreiam pesquisas e conversões

### Armazenamento

Os dados são armazenados:
- **LocalStorage**: Para dados offline e backup
- **Google Analytics**: Para análise avançada
- **Cookies**: Para identificação de usuários

## 🔒 Privacidade

- IDs de usuário são gerados aleatoriamente (não contêm informações pessoais)
- Apenas comportamento de navegação é rastreado
- Dados ficam armazenados localmente no navegador
- Você pode limpar os dados a qualquer momento via dashboard

## 📱 Exemplo de Uso

Para ver estatísticas durante o desenvolvimento:

1. Navegue pelo site
2. Realize algumas buscas
3. Clique em nomes de bebês
4. Abra o console (F12)
5. Execute: `abReports.printSummary()`

Exemplo de saída:
```
=== RELATÓRIO DE A/B TESTING ===
Período: 2025-08-08T10:00:00.000Z a 2025-08-08T11:30:00.000Z
Total de eventos: 156
Total de usuários: 23

--- DISTRIBUIÇÃO DE USUÁRIOS ---
Interface A: 12 usuários (52.17%)
Interface B: 11 usuários (47.83%)

--- TEMPO DE SESSÃO MÉDIO ---
variant_A: 45.6s (28 sessões)
variant_B: 52.3s (31 sessões)

--- CONVERSÕES ---
variant_A: { name_click: 15 }
variant_B: { name_click: 18 }
```

## 🎯 Métricas Recomendadas

Para avaliar qual interface é melhor, compare:

1. **Tempo de Engajamento**: Interface com maior tempo médio na página
2. **Taxa de Conversão**: Interface com mais cliques em nomes
3. **Comportamento de Busca**: Interface com mais buscas por usuário
4. **Retenção**: Interface com mais retornos de usuários

## 🛠️ Manutenção

### Limpeza de Dados
```javascript
// Limpar dados locais
localStorage.removeItem('analytics_queue')
localStorage.removeItem('variant_assignments')

// Ou via dashboard
abReports.clearStoredAnalytics()
```

### Exportação Regular
Recomenda-se exportar dados regularmente para análise:
```javascript
abReports.exportReport(`analytics-${new Date().toISOString().split('T')[0]}.json`)
```

## 🚨 Notas Importantes

- O dashboard só aparece em modo de desenvolvimento
- Dados são armazenados localmente (podem ser perdidos ao limpar o navegador)
- Para análise estatística robusta, use os dados do Google Analytics
- Em produção, considere implementar um backend para armazenar dados permanentemente
