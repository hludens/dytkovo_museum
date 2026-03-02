
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const blockedKeys = [
    'F12', 'Escape', 'Alt+Tab', 'Win', 
    'Meta', 'Control+Shift+I', 'Control+R'
  ];
  const keyCombo = e.key + (e.ctrlKey ? '+Control' : '') + 
                   (e.altKey ? '+Alt' : '') + 
                   (e.shiftKey ? '+Shift' : '');

  if (blockedKeys.some(k => keyCombo.includes(k))) {
    e.preventDefault();
    return false;
  }
});
document.documentElement.requestFullscreen().catch(console.log);
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  }
});