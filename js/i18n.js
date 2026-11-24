/* ---------- traduzioni ---------- */
const T={
it:{title:"Battaglia Navale",tagline:"Affonda la flotta nemica prima che affondi la tua.",hub:"Torna alla ProjectHub",backMenu:"Menu",confirmMenu:"Vuoi tornare al menu? La partita in corso andrà persa.",dockTitle:"Le tue navi: selezionane una e posizionala",playPc:"Gioca contro il computer",create:"Crea una stanza online",codePh:"CODICE",join:"Unisciti",roomCode:"Codice stanza:",
 horiz:"Orizzontale",vert:"Verticale",random:"Casuale",reset:"Azzera",ready:"Pronto",yourFleet:"La tua flotta",enemySea:"Mare nemico",newGame:"Nuova partita",
 themeToLight:"Passa al tema chiaro",themeToDark:"Passa al tema scuro",
 place:n=>`Posiziona la nave da ${n} caselle: R per ruotarla, clic sulla griglia`,invalid:"Posizione non valida: la nave esce dalla griglia o si sovrappone",fleetDone:"Flotta completa: premi Pronto",
 waitOpp:"In attesa che l’avversario sia pronto…",oppReadyPlace:(a,b)=>`L’avversario è pronto. Posiziona la flotta (${a}/${b})`,
 yourTurn:"Tocca a te: scegli dove sparare",oppTurn:"Turno dell’avversario…",fired:"Colpo sparato…",pcAim:"Il computer sta mirando…",
 sunkOpp:"Affondata! Turno dell’avversario…",hitOpp:"Colpito! Turno dell’avversario…",missOpp:"Acqua! Turno dell’avversario…",
 youSunk:"Ti hanno affondato una nave. Tocca a te!",youHit:"Ti hanno colpito. Tocca a te!",youMissed:"Hanno mancato. Tocca a te!",
 won:"🎉 Hai vinto! Flotta nemica affondata.",lost:"💥 Hai perso: la tua flotta è affondata.",disc:"L’avversario si è disconnesso.",
 share:"Condividi il codice: in attesa di un avversario…",enterCode:"Inserisci il codice di 5 caratteri.",connecting:"Connessione in corso…",
 notFound:"Stanza non trovata. Controlla il codice.",timeout:turn=>turn?"Connessione non riuscita. Riprova, oppure controlla le credenziali TURN in js/config.js.":"Connessione non riuscita: le due reti non riescono a collegarsi direttamente. Serve un server TURN (vedi README, file js/config.js).",connErr:e=>`Errore di connessione: ${e}`},
en:{title:"Battleship",tagline:"Sink the enemy fleet before they sink yours.",hub:"Back to ProjectHub",backMenu:"Menu",confirmMenu:"Go back to the menu? The current game will be lost.",dockTitle:"Your ships: select one and place it",playPc:"Play against the computer",create:"Create an online room",codePh:"CODE",join:"Join",roomCode:"Room code:",
 horiz:"Horizontal",vert:"Vertical",random:"Random",reset:"Clear",ready:"Ready",yourFleet:"Your fleet",enemySea:"Enemy waters",newGame:"New game",
 themeToLight:"Switch to light theme",themeToDark:"Switch to dark theme",
 place:n=>`Place the ${n}-cell ship: R to rotate, click on the grid`,invalid:"Invalid position: the ship goes off the grid or overlaps another",fleetDone:"Fleet complete: press Ready",
 waitOpp:"Waiting for your opponent to be ready…",oppReadyPlace:(a,b)=>`Your opponent is ready. Place your fleet (${a}/${b})`,
 yourTurn:"Your turn: pick where to fire",oppTurn:"Opponent’s turn…",fired:"Shot fired…",pcAim:"The computer is aiming…",
 sunkOpp:"Sunk! Opponent’s turn…",hitOpp:"Hit! Opponent’s turn…",missOpp:"Miss! Opponent’s turn…",
 youSunk:"They sank one of your ships. Your turn!",youHit:"You were hit. Your turn!",youMissed:"They missed. Your turn!",
 won:"🎉 You won! Enemy fleet sunk.",lost:"💥 You lost: your fleet is sunk.",disc:"Your opponent disconnected.",
 share:"Share the code: waiting for an opponent…",enterCode:"Enter the 5-character code.",connecting:"Connecting…",
 notFound:"Room not found. Check the code.",timeout:turn=>turn?"Connection failed. Try again, or check the TURN credentials in js/config.js.":"Connection failed: the two networks cannot connect directly. A TURN server is needed (see README, file js/config.js).",connErr:e=>`Connection error: ${e}`},
de:{title:"Schiffe versenken",tagline:"Versenke die feindliche Flotte, bevor sie deine versenkt.",hub:"Zurück zum ProjectHub",backMenu:"Menü",confirmMenu:"Zurück zum Menü? Das laufende Spiel geht verloren.",dockTitle:"Deine Schiffe: Wähle eines aus und platziere es",playPc:"Gegen den Computer spielen",create:"Online-Raum erstellen",codePh:"CODE",join:"Beitreten",roomCode:"Raumcode:",
 horiz:"Waagerecht",vert:"Senkrecht",random:"Zufällig",reset:"Zurücksetzen",ready:"Bereit",yourFleet:"Deine Flotte",enemySea:"Gegnerisches Meer",newGame:"Neues Spiel",
 themeToLight:"Zum hellen Design wechseln",themeToDark:"Zum dunklen Design wechseln",
 place:n=>`Platziere das Schiff mit ${n} Feldern: R zum Drehen, Klick aufs Raster`,invalid:"Ungültige Position: Das Schiff ragt über das Raster oder überlappt ein anderes",fleetDone:"Flotte komplett: Drücke Bereit",
 waitOpp:"Warte, bis der Gegner bereit ist…",oppReadyPlace:(a,b)=>`Der Gegner ist bereit. Platziere deine Flotte (${a}/${b})`,
 yourTurn:"Du bist dran: Wähle ein Ziel",oppTurn:"Der Gegner ist dran…",fired:"Schuss abgegeben…",pcAim:"Der Computer zielt…",
 sunkOpp:"Versenkt! Der Gegner ist dran…",hitOpp:"Treffer! Der Gegner ist dran…",missOpp:"Wasser! Der Gegner ist dran…",
 youSunk:"Dein Schiff wurde versenkt. Du bist dran!",youHit:"Du wurdest getroffen. Du bist dran!",youMissed:"Daneben. Du bist dran!",
 won:"🎉 Du hast gewonnen! Gegnerische Flotte versenkt.",lost:"💥 Du hast verloren: Deine Flotte ist versenkt.",disc:"Der Gegner hat die Verbindung getrennt.",
 share:"Teile den Code: Warte auf einen Gegner…",enterCode:"Gib den 5-stelligen Code ein.",connecting:"Verbindung wird hergestellt…",
 notFound:"Raum nicht gefunden. Prüfe den Code.",timeout:turn=>turn?"Verbindung fehlgeschlagen. Versuche es erneut oder prüfe die TURN-Zugangsdaten in js/config.js.":"Verbindung fehlgeschlagen: Die beiden Netzwerke können sich nicht direkt verbinden. Ein TURN-Server ist nötig (siehe README, Datei js/config.js).",connErr:e=>`Verbindungsfehler: ${e}`}
};
const $=s=>document.querySelector(s);
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
let lang=store.get('nhkbn-lang');
if(!T[lang])lang=(navigator.language||'it').slice(0,2).toLowerCase();
if(!T[lang])lang='en';
const t=(k,...a)=>{const v=T[lang][k];return typeof v==='function'?v(...a):v};
let st=null, mm=null;
function paintMsgs(){ $('#status').textContent=st?t(st[0],...st[1]):''; $('#menuMsg').textContent=mm?t(mm[0],...mm[1]):'' }
const setStatus=(k,...a)=>{st=[k,a];paintMsgs()};
const setMenuMsg=(k,...a)=>{mm=[k,a];paintMsgs()};
function applyLang(){
  document.documentElement.lang=lang;document.title=t('title');
  document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(e=>e.placeholder=t(e.dataset.i18nPh));
  document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===lang));
  if(typeof rotLabel==='function')$('#btnRotate').textContent=rotLabel();
  paintTheme();paintMsgs();
}
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;store.set('nhkbn-lang',lang);applyLang()});
