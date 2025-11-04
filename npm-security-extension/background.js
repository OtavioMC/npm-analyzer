// background.js - Service Worker para processar análises

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyze') {
    analyzePackages(request.packageJson)
      .then(results => sendResponse({ results }))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Mantém o canal aberto para resposta assíncrona
  }
});

async function analyzePackages(packageJson) {
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  if (!dependencies || Object.keys(dependencies).length === 0) {
    throw new Error('Nenhuma dependência encontrada');
  }

  const vulnerabilities = [];
  const total = Object.keys(dependencies).length;

  // Analisa cada pacote
  for (const [pkg, version] of Object.entries(dependencies)) {
    try {
      const cleanVersion = version.replace(/[\^~>=<]/g, '');

      const response = await fetch('https://api.osv.dev/v1/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: { name: pkg, ecosystem: 'npm' },
          version: cleanVersion
        })
      });

      if (!response.ok) {
        console.error(`Erro ao verificar ${pkg}: ${response.status}`);
        continue;
      }

      const data = await response.json();

      if (data.vulns && data.vulns.length > 0) {
        vulnerabilities.push({
          package: pkg,
          version: cleanVersion,
          vulns: data.vulns
        });
      }
    } catch (err) {
      console.error(`Erro ao verificar ${pkg}:`, err);
    }
  }

  return {
    total,
    vulnerable: vulnerabilities.length,
    safe: total - vulnerabilities.length,
    details: vulnerabilities
  };
}