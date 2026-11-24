/* ---------- logica di gioco ---------- */
const N=10, LENS=[5,4,3,3,2], PREFIX='nhkbn-';
const rnd=n=>Math.random()*n|0;
let mode, peer, conn, isHost=false;
let my, enemyView, pc, fleet=[], sel=null, hov=null, horiz=true, phase, myTurn, meReady, oppReady, over, aiQ;

const newBoard=()=>({grid:Array.from({length:N},()=>Array(N).fill(-1)),ships:[],shots:Array.from({length:N},()=>Array(N).fill(0))});
function canPlace(g,r,c,len,h){for(let i=0;i<len;i++){const a=r+(h?0:i),b=c+(h?i:0);if(a>=N||b>=N||g[a][b]!==-1)return false}return true}
function putShip(bd,r,c,len,h){const cells=[];for(let i=0;i<len;i++){const a=r+(h?0:i),b=c+(h?i:0);cells.push([a,b]);bd.grid[a][b]=bd.ships.length}bd.ships.push({cells,hits:0})}
function randomBoard(){const bd=newBoard();for(const len of LENS){let r,c,h;do{h=Math.random()<.5;r=rnd(N);c=rnd(N)}while(!canPlace(bd.grid,r,c,len,h));putShip(bd,r,c,len,h)}return bd}
function fire(bd,r,c){bd.shots[r][c]=1;const id=bd.grid[r][c];if(id<0)return{hit:false};const s=bd.ships[id];s.hits++;return{hit:true,sunk:s.hits===s.cells.length?s.cells:null,lost:bd.ships.every(x=>x.hits===x.cells.length)}}

/* ---------- interfaccia ---------- */
function buildGrid(el,handler){el.innerHTML='';for(let r=0;r<N;r++)for(let c=0;c<N;c++){const b=document.createElement('button');b.className='cell';b.type='button';b.setAttribute('aria-label',`${String.fromCharCode(65+c)}${r+1}`);b.onclick=()=>handler(r,c);el.appendChild(b)}}
function render(){
  const mine=$('#mine').children, en=$('#enemy').children, hull=Array.from({length:N},()=>Array(N).fill(''));
  my.ships.forEach(s=>{const h=s.cells.length>1&&s.cells[0][0]===s.cells[1][0],L=s.cells.length-1,dn=s.hits===s.cells.length?' down':'';
    s.cells.forEach(([a,b],i)=>hull[a][b]=' ship '+(h?'sh':'sv')+(i===0?' s':'')+(i===L?' e':'')+dn)});
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const id=my.grid[r][c], sh=my.shots[r][c];
    mine[r*N+c].className='cell'+hull[r][c]+(sh?(id>=0?' hit':' miss'):'');
    const v=enemyView[r][c];
    en[r*N+c].className='cell'+(v===1?' miss':v===2?' hit':v===3?' sunk':' free');
  }
  const live=phase==='play'&&myTurn&&!over;
  $('#enemy').classList.toggle('live',live);
  $('#status').dataset.tone=live?'go':'wait';
  $('#mine').classList.toggle('placing',phase==='place');
  $('#btnReady').disabled=placedCount()<LENS.length||phase!=='place';
}
function resetState(){
  my=newBoard();enemyView=Array.from({length:N},()=>Array(N).fill(0));
  phase='place';myTurn=false;meReady=false;oppReady=false;over=false;aiQ=[];
  initFleet();showPlacementUI(true);
  $('#btnRotate').textContent=rotLabel();
  buildGrid($('#mine'),placeAt);buildGrid($('#enemy'),shootAt);
  placementStatus();renderDock();render();
}
function enterGame(m){
  mode=m;$('#menu').classList.add('hidden');$('#game').classList.remove('hidden');
  if(m==='pc'){pc=randomBoard();$('#roomInfo').classList.add('hidden')}
  resetState();
}

/* ---------- posizionamento ---------- */
const rotLabel=()=>t(horiz?'horiz':'vert')+' · R';
const placedCount=()=>fleet.filter(f=>f.placed).length;
const showPlacementUI=on=>{$('#tools').classList.toggle('hidden',!on);$('#dockWrap').classList.toggle('hidden',!on)};
function initFleet(){fleet=LENS.map(len=>({len,placed:false,r:0,c:0,h:true}));sel=0;hov=null;horiz=true}
function rebuild(){my=newBoard();fleet.forEach((f,i)=>{if(f.placed){putShip(my,f.r,f.c,f.len,f.h);my.ships[my.ships.length-1].slot=i}})}
function placementStatus(){
  if(placedCount()===LENS.length)return setStatus('fleetDone');
  const i=sel===null?fleet.findIndex(f=>!f.placed):sel;setStatus('place',fleet[i].len);
}
function renderDock(){
  const d=$('#dock');d.innerHTML='';
  fleet.forEach((f,i)=>{
    const b=document.createElement('button');b.type='button';
    b.className='dock-ship'+(sel===i?' sel':'')+(f.placed?' done':'');
    b.setAttribute('aria-pressed',sel===i);b.setAttribute('aria-label',String(f.len));
    b.innerHTML='<i></i>'.repeat(f.len);b.onclick=()=>pickShip(i);d.appendChild(b);
  });
}
const refresh=()=>hov?preview(hov[0],hov[1]):render();
function preview(r,c){
  render();
  if(phase!=='place'||sel===null||my.grid[r][c]>=0)return;
  const f=fleet[sel],ok=canPlace(my.grid,r,c,f.len,horiz),cells=$('#mine').children;
  for(let i=0;i<f.len;i++){const a=r+(horiz?0:i),b=c+(horiz?i:0);if(a<N&&b<N)cells[a*N+b].classList.add('ghost',ok?'ok':'bad')}
}
function pickShip(i){
  if(phase!=='place')return;
  const f=fleet[i];
  if(f.placed){f.placed=false;horiz=f.h;rebuild()}
  sel=i;$('#btnRotate').textContent=rotLabel();placementStatus();renderDock();refresh();
}
function placeAt(r,c){
  if(phase!=='place')return;
  const id=my.grid[r][c];
  if(id>=0){pickShip(my.ships[id].slot);return}
  if(sel===null)return;
  const f=fleet[sel];
  if(!canPlace(my.grid,r,c,f.len,horiz)){setStatus('invalid');return}
  Object.assign(f,{placed:true,r,c,h:horiz});rebuild();
  sel=fleet.findIndex(x=>!x.placed);if(sel<0)sel=null;
  placementStatus();renderDock();refresh();
}
function toggleRot(){horiz=!horiz;$('#btnRotate').textContent=rotLabel();refresh()}
const mineEl=$('#mine');
mineEl.addEventListener('mouseover',e=>{
  const b=e.target.closest('.cell');if(!b||phase!=='place')return;
  const i=[...mineEl.children].indexOf(b);hov=[i/N|0,i%N];preview(hov[0],hov[1]);
});
mineEl.addEventListener('mouseleave',()=>{hov=null;if(phase==='place')render()});
mineEl.addEventListener('contextmenu',e=>{if(phase==='place'){e.preventDefault();toggleRot()}});
document.addEventListener('keydown',e=>{
  if(phase!=='place'||e.ctrlKey||e.metaKey||e.altKey||e.target.tagName==='INPUT')return;
  if(e.key.toLowerCase()==='r'){e.preventDefault();toggleRot()}
});
$('#btnRotate').onclick=toggleRot;
$('#btnReset').onclick=()=>{if(phase!=='place')return;fleet.forEach(f=>f.placed=false);sel=0;rebuild();placementStatus();renderDock();refresh()};
$('#btnRandom').onclick=()=>{
  if(phase!=='place')return;
  const rb=randomBoard();
  rb.ships.forEach((s,i)=>Object.assign(fleet[i],{placed:true,r:s.cells[0][0],c:s.cells[0][1],h:s.cells[0][0]===s.cells[1][0]}));
  rebuild();sel=null;placementStatus();renderDock();refresh();
};
$('#btnReady').onclick=()=>{
  showPlacementUI(false);hov=null;
  if(mode==='pc'){phase='play';myTurn=true;setStatus('yourTurn');render();return}
  meReady=true;phase='wait';conn.send({t:'ready'});
  setStatus('waitOpp');checkStart();render();
};
$('#btnMenu').onclick=()=>{
  if(phase==='play'&&!over&&!confirm(t('confirmMenu')))return;
  try{if(conn)conn.close();if(peer)peer.destroy()}catch(e){}
  location.reload();
};
function checkStart(){if(meReady&&oppReady){phase='play';myTurn=isHost;setStatus(myTurn?'yourTurn':'oppTurn');render()}}

/* ---------- spari ---------- */
function shootAt(r,c){
  if(phase!=='play'||!myTurn||over||enemyView[r][c]!==0)return;
  myTurn=false;
  if(mode==='pc'){handleRes(r,c,fire(pc,r,c));if(!over){setStatus('pcAim');setTimeout(pcMove,700)}}
  else{conn.send({t:'shot',r,c});setStatus('fired')}
  render();
}
function handleRes(r,c,res){
  enemyView[r][c]=res.hit?2:1;
  if(res.sunk)res.sunk.forEach(([a,b])=>enemyView[a][b]=3);
  if(res.lost)return end(true);
  setStatus(res.sunk?'sunkOpp':res.hit?'hitOpp':'missOpp');
  render();
}
function handleShot(r,c){
  const res=fire(my,r,c);
  if(res.lost)end(false);
  else{myTurn=true;setStatus(res.sunk?'youSunk':res.hit?'youHit':'youMissed')}
  render();return res;
}
function pcMove(){
  if(over)return;
  let tg=null;
  while(aiQ.length){const [a,b]=aiQ.pop();if(!my.shots[a][b]){tg=[a,b];break}}
  if(!tg){const free=[];for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!my.shots[r][c])free.push([r,c]);
    const par=free.filter(([a,b])=>(a+b)%2===0);const pool=par.length?par:free;tg=pool[rnd(pool.length)]}
  const [r,c]=tg,res=handleShot(r,c);
  if(res.sunk)aiQ=[];
  else if(res.hit)[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>{const a=r+dr,b=c+dc;if(a>=0&&b>=0&&a<N&&b<N&&!my.shots[a][b])aiQ.push([a,b])});
}
function end(won){
  over=true;myTurn=false;setStatus(won?'won':'lost');
  $('#btnNew').classList.remove('hidden');render();
}
$('#btnNew').onclick=()=>location.reload();
