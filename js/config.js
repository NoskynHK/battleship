/* ---------- Server ICE (STUN / TURN) ----------
   Il STUN basta solo se i giocatori hanno reti "facili" (es. stesso Wi-Fi).
   Tra reti diverse (altri Paesi, reti mobili, router restrittivi) serve spesso
   un server TURN che faccia da ponte. PeerJS non offre più TURN gratuito:
   crea un account gratuito su https://www.metered.ca (Open Relay), crea una
   credenziale TURN e incolla qui i dati (vedi README).
*/
const TURN_CONFIG={
  urls:[
    "turn:global.relay.metered.ca:80",
    "turn:global.relay.metered.ca:80?transport=tcp",
    "turn:global.relay.metered.ca:443",
    "turns:global.relay.metered.ca:443?transport=tcp"
  ],
  username:"2bfd1b89af41ccd9e89c336d",
  credential:"dlMjLXbd7C2er6IV"
};
// Alternativa: indirizzo che restituisce le credenziali, es.
// "https://TUOAPP.metered.live/api/v1/turn/credentials?apiKey=LA_TUA_CHIAVE"
const TURN_API_URL="";

const STUN_SERVERS=[
  {urls:"stun:stun.l.google.com:19302"},
  {urls:"stun:stun1.l.google.com:3478"},
  {urls:"stun:stun.cloudflare.com:3478"},
  {urls:"stun:stun.relay.metered.ca:80"}
];
const hasTurn=()=>!!(TURN_API_URL||(TURN_CONFIG.urls.length&&TURN_CONFIG.username));
async function getIceServers(){
  const list=[...STUN_SERVERS];
  if(TURN_API_URL){
    try{
      const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),5000);
      const r=await fetch(TURN_API_URL,{signal:ctl.signal});clearTimeout(tm);
      const j=await r.json();if(Array.isArray(j))list.push(...j);
    }catch(e){console.warn('Credenziali TURN non raggiungibili',e)}
  }
  if(TURN_CONFIG.urls.length&&TURN_CONFIG.username)
    list.push({urls:TURN_CONFIG.urls,username:TURN_CONFIG.username,credential:TURN_CONFIG.credential});
  if(!hasTurn())console.warn('Nessun server TURN configurato (js/config.js): il multiplayer tra reti diverse può non funzionare.');
  return list;
}
