/* ---------- tema chiaro / scuro ---------- */
let theme=store.get('nhkbn-theme');
if(theme!=='light'&&theme!=='dark')theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
document.documentElement.dataset.theme=theme;
function paintTheme(){const b=$('#btnTheme');b.textContent=theme==='dark'?'☀️':'🌙';b.setAttribute('aria-label',t(theme==='dark'?'themeToLight':'themeToDark'))}
$('#btnTheme').onclick=()=>{theme=theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;store.set('nhkbn-theme',theme);paintTheme()};
