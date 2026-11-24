/* ---------- online (PeerJS) ---------- */
function onData(m){
  if(m.t==='ready'){oppReady=true;if(meReady)checkStart();else if(phase==='place')setStatus('oppReadyPlace',placedCount(),LENS.length)}
  else if(m.t==='shot'){const res=handleShot(m.r,m.c);conn.send({t:'res',r:m.r,c:m.c,...res})}
  else if(m.t==='res')handleRes(m.r,m.c,m);
}
function bind(){
  conn.on('open',()=>enterGame('online'));
  conn.on('data',onData);
  conn.on('close',()=>{if(!over){over=true;setStatus('disc');$('#btnNew').classList.remove('hidden');render()}});
}
const mkPeer=async id=>{const config={iceServers:await getIceServers()};return id?new Peer(id,{config}):new Peer({config})};
async function createRoom(){
  isHost=true;
  const code=Array.from({length:5},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[rnd(32)]).join('');
  peer=await mkPeer(PREFIX+code);
  peer.on('open',()=>{$('#menu').classList.add('hidden');$('#game').classList.remove('hidden');
    $('#roomInfo').classList.remove('hidden');$('#code').textContent=code;showPlacementUI(false);
    setStatus('share')});
  peer.on('connection',c=>{conn=c;bind();$('#roomInfo').classList.add('hidden')});
  peer.on('error',e=>{if(e.type==='unavailable-id')createRoom();else setMenuMsg('connErr',e.type)});
}
async function joinRoom(){
  const code=$('#joinCode').value.trim().toUpperCase();
  if(code.length!==5){setMenuMsg('enterCode');return}
  isHost=false;setMenuMsg('connecting');
  if(peer)try{peer.destroy()}catch(e){}
  peer=await mkPeer();
  let timer=null;
  peer.on('open',()=>{
    conn=peer.connect(PREFIX+code,{reliable:true});bind();
    conn.on('error',e=>setMenuMsg('connErr',e.type||e));
    timer=setTimeout(()=>{
      if(conn&&conn.open)return;
      setMenuMsg('timeout',hasTurn());
      try{conn.close();peer.destroy()}catch(e){}
    },25000);
    conn.on('open',()=>clearTimeout(timer));
  });
  peer.on('error',e=>{clearTimeout(timer);e.type==='peer-unavailable'?setMenuMsg('notFound'):setMenuMsg('connErr',e.type)});
}
$('#btnPc').onclick=()=>enterGame('pc');
$('#btnCreate').onclick=createRoom;
$('#btnJoin').onclick=joinRoom;
