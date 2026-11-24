/* ---------- logica di gioco ---------- */
const N=10, LENS=[5,4,3,3,2], PREFIX='nhkbn-';
const rnd=n=>Math.random()*n|0;
let mode, peer, conn, isHost=false;
let my, enemyView, pc, idx, horiz=true, phase, myTurn, meReady, oppReady, over, aiQ;

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
  $('#btnReady').disabled=idx<LENS.length||phase!=='place';
}
function resetState(){
  my=newBoard();enemyView=Array.from({length:N},()=>Array(N).fill(0));
  idx=0;horiz=true;phase='place';myTurn=false;meReady=false;oppReady=false;over=false;aiQ=[];
  $('#btnRotate').textContent=t('horiz');
  $('#tools').classList.remove('hidden');
  buildGrid($('#mine'),placeAt);buildGrid($('#enemy'),shootAt);
  setStatus('place',LENS[0]);render();
}
function enterGame(m){
  mode=m;$('#menu').classList.add('hidden');$('#game').classList.remove('hidden');
  if(m==='pc'){pc=randomBoard();$('#roomInfo').classList.add('hidden')}
  resetState();
}

/* ---------- posizionamento ---------- */
function placeAt(r,c){
  if(phase!=='place'||idx>=LENS.length)return;
  if(!canPlace(my.grid,r,c,LENS[idx],horiz)){setStatus('invalid');return}
  putShip(my,r,c,LENS[idx],horiz);idx++;
  idx<LENS.length?setStatus('place',LENS[idx]):setStatus('fleetDone');
  render();
}
$('#btnRotate').onclick=()=>{horiz=!horiz;$('#btnRotate').textContent=t(horiz?'horiz':'vert')};
$('#btnReset').onclick=()=>{if(phase!=='place')return;my=newBoard();idx=0;setStatus('place',LENS[0]);render()};
$('#btnRandom').onclick=()=>{if(phase!=='place')return;my=randomBoard();idx=LENS.length;setStatus('fleetDone');render()};
$('#btnReady').onclick=()=>{
  $('#tools').classList.add('hidden');
  if(mode==='pc'){phase='play';myTurn=true;setStatus('yourTurn');render();return}
  meReady=true;phase='wait';conn.send({t:'ready'});
  setStatus('waitOpp');checkStart();render();
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
