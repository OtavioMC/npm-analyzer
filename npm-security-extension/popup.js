// popup.js - Script do popup da extensão

document.getElementById('openGithub').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://github.com' });
});