function buildLabels(){
  document.querySelectorAll('.cols').forEach(e=>e.innerHTML=Array.from({length:N},(_,i)=>`<span>${String.fromCharCode(65+i)}</span>`).join(''));
  document.querySelectorAll('.rows').forEach(e=>e.innerHTML=Array.from({length:N},(_,i)=>`<span>${i+1}</span>`).join(''));
}
buildLabels();
applyLang();
