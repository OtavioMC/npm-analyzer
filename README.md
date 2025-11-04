# NPM Security Analyzer - Extensão para GitHub

Extensão de navegador que analisa vulnerabilidades em pacotes NPM diretamente no GitHub usando a API OSV.dev.

## 📁 Estrutura de Arquivos

```
npm-security-extension/
├── manifest.json          ✅ Configuração da extensão
├── content.js            ✅ Injeta botão no GitHub
├── background.js         ✅ Processa análises
├── popup.html            ✅ Interface do popup
├── popup.js              ✅ Lógica do popup
├── styles.css            ✅ Estilos da extensão
└── icons/                ⚠️ CRIAR ESTA PASTA
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🚀 Instalação Passo a Passo

### 1. Criar a Estrutura

```bash
mkdir npm-security-extension
cd npm-security-extension
mkdir icons
```

### 2. Criar os Arquivos

Copie cada código fornecido para seu respectivo arquivo:

- `manifest.json` - Configuração principal
- `content.js` - Script que injeta o botão no GitHub
- `background.js` - Service worker que processa as análises
- `popup.html` - Interface do popup da extensão
- `popup.js` - Script do popup
- `styles.css` - Estilos CSS

### 3. Criar os Ícones

Você precisa criar 3 ícones (pode usar qualquer editor de imagens):

**Opção Rápida:** Use sites como:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/

**Dimensões necessárias:**
- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels  
- `icon128.png` - 128x128 pixels

**Sugestão de design:** Um escudo com as letras "NPM" ou símbolo de segurança

**Alternativa temporária:** Use um emoji shield como base:
```bash
# No Linux/Mac, pode converter emoji para PNG:
convert -size 128x128 -background none -fill blue \
  -font DejaVu-Sans -pointsize 100 -gravity center \
  label:"🛡️" icons/icon128.png

# Redimensione para outros tamanhos:
convert icons/icon128.png -resize 48x48 icons/icon48.png
convert icons/icon128.png -resize 16x16 icons/icon16.png
```

### 4. Instalar no Chrome/Edge

1. Abra o navegador
2. Acesse: `chrome://extensions/` (Chrome) ou `edge://extensions/` (Edge)
3. Ative o **"Modo do desenvolvedor"** (canto superior direito)
4. Clique em **"Carregar sem compactação"**
5. Selecione a pasta `npm-security-extension`
6. A extensão será instalada! 🎉

### 5. Instalar no Firefox

1. Abra o Firefox
2. Acesse: `about:debugging#/runtime/this-firefox`
3. Clique em **"Carregar extensão temporária"**
4. Selecione o arquivo `manifest.json` da pasta
5. A extensão será instalada! 🎉

## 📖 Como Usar

1. **Acesse um repositório no GitHub** que tenha `package.json`
2. **Clique no botão azul** "Analisar Segurança NPM" (aparece no header do repositório)
3. **Aguarde a análise** (busca automática do package.json)
4. **Visualize os resultados** em um modal elegante

## 🧪 Testar a Extensão

Use estes repositórios para testar:

### Repositórios com vulnerabilidades conhecidas:
- https://github.com/expressjs/express (versões antigas)
- https://github.com/lodash/lodash (versões antigas)
- https://github.com/axios/axios (versões antigas)

### Criar repositório de teste:

```bash
mkdir test-npm-security
cd test-npm-security
git init

# Criar package.json com vulnerabilidades conhecidas
cat > package.json << 'EOF'
{
  "name": "test-vulnerabilities",
  "version": "1.0.0",
  "dependencies": {
    "lodash": "4.17.19",
    "axios": "0.21.1",
    "express": "4.17.1"
  }
}
EOF

git add .
git commit -m "Initial commit"

# Subir para GitHub e testar!
```

## 🔧 Personalização

### Alterar cores do botão:
Edite `styles.css`, linha 7:
```css
background: #2563eb;  /* Azul padrão */
```

### Adicionar mais fontes de dados:
Edite `background.js` e adicione outras APIs de segurança

### Suportar outros gerenciadores:
- **PyPI (Python):** Mude `ecosystem: 'npm'` para `'PyPI'`
- **Maven (Java):** Mude para `'Maven'`
- **RubyGems:** Mude para `'RubyGems'`

## 🐛 Resolução de Problemas

### Botão não aparece:
1. Verifique se está em um repositório válido do GitHub
2. Atualize a página (F5)
3. Verifique o console: `F12 > Console`

### Erro "package.json não encontrado":
- Repositório não tem package.json na raiz
- Branch pode ser diferente de `main` ou `master`

### API não responde:
- Verifique sua conexão com internet
- OSV.dev pode estar fora do ar temporariamente
- Veja erros no console do background: `chrome://extensions/` > Detalhes > Inspecionar visualizações

### Permissões negadas:
- Reinstale a extensão
- Verifique se o `manifest.json` tem as permissões corretas

## 📊 Funcionalidades Implementadas

✅ Detecção automática de repositórios GitHub  
✅ Leitura automática de package.json  
✅ Integração com API OSV.dev  
✅ Interface visual com modal  
✅ Classificação por severidade  
✅ Links para documentação  
✅ Suporte a branches main/master  
✅ Animações e feedback visual  
✅ Tratamento de erros  

## 🎯 Próximas Melhorias

- [ ] Cache de resultados
- [ ] Suporte a monorepos (múltiplos package.json)
- [ ] Exportar relatório em PDF
- [ ] Integração com npm audit
- [ ] Notificações desktop
- [ ] Badge de status no ícone da extensão
- [ ] Análise de package-lock.json
- [ ] Suporte a outros ecossistemas (Python, Ruby, etc)

## 📚 Tecnologias Utilizadas

- **Manifest V3** - Última versão de extensões
- **Vanilla JavaScript** - Sem dependências
- **OSV.dev API** - Google Open Source Vulnerabilities
- **GitHub Raw Content** - Leitura de arquivos

## 📄 Licença

Projeto educacional - CEFET/NF  
Livre para uso e modificação

## 👥 Autores

- Saulo Klein Nery
- Otávio Mendonça da Costa
- Mychelle Satyn da Conceição

---

**🛡️ Mantenha seu código seguro!**
