// content.js - Injeta botão de análise no GitHub

(function() {
  'use strict';

  // Verifica se está em um repositório
  function isRepoPage() {
    const pathParts = window.location.pathname.split('/').filter(p => p);
    return pathParts.length >= 2 && !pathParts.includes('search');
  }

  // Cria o botão de análise
  function createAnalyzeButton() {
    const button = document.createElement('button');
    button.id = 'npm-security-analyzer-btn';
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      <span>Analisar Segurança NPM</span>
    `;
    button.className = 'npm-analyzer-button';

    button.addEventListener('click', analyzeRepository);

    return button;
  }

  // Insere o botão na página
  function insertButton() {
    // Remove botão anterior se existir
    const existingBtn = document.getElementById('npm-security-analyzer-btn');
    if (existingBtn) {
      existingBtn.remove();
    }

    // Procura o header do repositório
    const repoHeader = document.querySelector('.AppHeader-actions, .pagehead-actions, [data-target="react-app.embeddedData"]');

    if (repoHeader) {
      const button = createAnalyzeButton();
      repoHeader.insertBefore(button, repoHeader.firstChild);
    }
  }

  // Analisa o repositório
  async function analyzeRepository() {
    const button = document.getElementById('npm-security-analyzer-btn');
    const originalContent = button.innerHTML;

    button.innerHTML = `
      <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke-width="4" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-width="4"></path>
      </svg>
      <span>Analisando...</span>
    `;
    button.disabled = true;

    try {
      // Extrai informações do repositório
      const [owner, repo] = window.location.pathname.split('/').filter(p => p);

      // Busca o package.json
      const packageJsonUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/package.json`;
      let response = await fetch(packageJsonUrl);

      // Tenta branch master se main não existir
      if (!response.ok) {
        const masterUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/package.json`;
        response = await fetch(masterUrl);
      }

      if (!response.ok) {
        throw new Error('package.json não encontrado');
      }

      const packageJson = await response.json();

      // Envia para análise
      chrome.runtime.sendMessage({
        action: 'analyze',
        packageJson: packageJson
      }, (response) => {
        if (response.error) {
          showNotification('Erro: ' + response.error, 'error');
        } else {
          showResults(response.results);
        }

        button.innerHTML = originalContent;
        button.disabled = false;
      });

    } catch (error) {
      showNotification('Erro ao buscar package.json: ' + error.message, 'error');
      button.innerHTML = originalContent;
      button.disabled = false;
    }
  }

  // Mostra notificação
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `npm-analyzer-notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Mostra resultados em modal
  function showResults(results) {
    const modal = document.createElement('div');
    modal.className = 'npm-analyzer-modal';
    modal.innerHTML = `
      <div class="npm-analyzer-modal-content">
        <div class="npm-analyzer-modal-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Análise de Segurança NPM
          </h2>
          <button class="close-btn">&times;</button>
        </div>

        <div class="npm-analyzer-modal-body">
          <div class="summary-cards">
            <div class="summary-card">
              <div class="card-label">Total de Pacotes</div>
              <div class="card-value">${results.total}</div>
            </div>
            <div class="summary-card vulnerable">
              <div class="card-label">Vulneráveis</div>
              <div class="card-value">${results.vulnerable}</div>
            </div>
            <div class="summary-card safe">
              <div class="card-label">Seguros</div>
              <div class="card-value">${results.safe}</div>
            </div>
          </div>

          ${results.details.length > 0 ? `
            <div class="vulnerabilities-section">
              <h3>⚠️ Vulnerabilidades Encontradas</h3>
              ${results.details.map(item => `
                <div class="vulnerability-item">
                  <div class="vuln-header">
                    <strong>${item.package}</strong>
                    <span class="version-badge">v${item.version}</span>
                    <span class="vuln-count">${item.vulns.length} vulnerabilidade${item.vulns.length > 1 ? 's' : ''}</span>
                  </div>
                  ${item.vulns.map(vuln => `
                    <div class="vuln-detail ${(vuln.severity?.[0]?.type || 'unknown').toLowerCase()}">
                      <div class="vuln-info">
                        <span class="severity-badge">${vuln.severity?.[0]?.type || 'UNKNOWN'}</span>
                        <code>${vuln.id}</code>
                      </div>
                      <p>${vuln.summary || vuln.details || 'Descrição não disponível'}</p>
                      ${vuln.references && vuln.references.length > 0 ? `
                        <div class="references">
                          ${vuln.references.slice(0, 2).map(ref => `
                            <a href="${ref.url}" target="_blank">🔗 ${ref.url}</a>
                          `).join('')}
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="success-message">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h3>✅ Nenhuma vulnerabilidade encontrada!</h3>
              <p>Todos os pacotes estão seguros segundo o OSV.dev</p>
            </div>
          `}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Fecha modal
    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Inicializa quando a página carregar
  function init() {
    if (isRepoPage()) {
      insertButton();
    }
  }

  // Observa mudanças na página (GitHub usa SPA)
  const observer = new MutationObserver(() => {
    if (isRepoPage() && !document.getElementById('npm-security-analyzer-btn')) {
      insertButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Inicia
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();