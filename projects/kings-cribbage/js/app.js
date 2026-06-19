(function(){
  const $ = s => document.querySelector(s);
  const RANKS = KC.RANKS;
  let templates=null, geom=null;
  const tiles = new Map();          // "r_c" -> {rank,color,score}
  let displayRows=[], displayCols=[];
  let imgW=0, imgH=0;               // resampled image dimensions (for overlay positioning)
  let viewMode = 'overlay';         // 'overlay' | 'board'

  // ---- load templates (base64 PNG -> grayscale vectors) ----
  function loadTemplates(){ templates = KC.buildTemplates(TEMPLATES); }

  // ---- image -> board ----
  function handleImage(srcImg){
    const maxSide=1600, nw=srcImg.naturalWidth||srcImg.width, nh=srcImg.naturalHeight||srcImg.height;
    const s=Math.min(1,maxSide/Math.max(nw,nh)), w0=Math.round(nw*s), h0=Math.round(nh*s);
    // First pass: resample to working size.
    const cv0=document.createElement('canvas'); cv0.width=w0; cv0.height=h0;
    cv0.getContext('2d').drawImage(srcImg,0,0,w0,h0);
    const id0=cv0.getContext('2d').getImageData(0,0,w0,h0);
    // Find the felt bounding box and crop to it. From here on, the cropped
    // canvas IS the board: detection, display, and overlay positioning all
    // share the same coordinate space, so alignment is automatic.
    const bb = KC.feltBBox({data:id0.data,width:w0,height:h0});
    const cw = bb.x1-bb.x0+1, ch = bb.y1-bb.y0+1;
    const cv=document.createElement('canvas'); cv.width=cw; cv.height=ch;
    cv.getContext('2d').drawImage(cv0, bb.x0, bb.y0, cw, ch, 0, 0, cw, ch);
    const id=cv.getContext('2d').getImageData(0,0,cw,ch);
    const res=KC.readBoard({data:id.data,width:cw,height:ch}, templates);
    geom=res; imgW=cw; imgH=ch;
    tiles.clear();
    res.cells.forEach(t=>tiles.set(t.r+'_'+t.c,{rank:t.rank,color:t.color,score:t.score}));
    // play area: drop fully-empty border rows/cols, keep interior
    const rs=res.cells.map(t=>t.r), cs=res.cells.map(t=>t.c);
    const r0=Math.min(...rs), r1=Math.max(...rs), c0=Math.min(...cs), c1=Math.max(...cs);
    displayRows=[]; for(let r=r0;r<=r1;r++) displayRows.push(r);
    displayCols=[]; for(let c=c0;c<=c1;c++) displayCols.push(c);
    $('#kc-overlay-img').src = cv.toDataURL('image/png');
    $('#kc-drop').hidden=true; $('#kc-boardbox').hidden=false; $('#kc-panel').hidden=false;
    applyViewMode();
    renderBoard(); renderOverlay(); renderGrid(); recompute();
  }

  function tileEl(rank,color){
    const t=document.createElement('div');
    t.className='kc-tile'+(color==='R'?' kc-red':'')+(rank==='10'?' kc-ten':'');
    t.textContent=rank; return t;
  }
  function renderBoard(){
    const b=$('#kc-board'); b.innerHTML='';
    b.style.gridTemplateColumns='repeat('+displayCols.length+',auto)';
    for(const r of displayRows) for(const c of displayCols){
      const key=r+'_'+c, t=tiles.get(key);
      const cell=document.createElement('button');
      cell.className='kc-cell'+(t?'':' kc-empty')+((t&&(t.rank==='?'||t.margin<0.10))?' kc-flag':'');
      cell.dataset.key=key;
      if(t) cell.appendChild(tileEl(t.rank,t.color));
      cell.addEventListener('click',e=>{e.stopPropagation(); openEditor(cell,key);});
      b.appendChild(cell);
    }
  }

  function renderOverlay(){
    const layer=$('#kc-overlay-tiles'); if(!layer) return;
    layer.innerHTML='';
    if(!geom||!geom.rb||!geom.cb||!imgW||!imgH) return;
    const rb=geom.rb, cb=geom.cb;
    for(const r of displayRows) for(const c of displayCols){
      const key=r+'_'+c, t=tiles.get(key);
      const y0=rb[r], y1=rb[r+1], x0=cb[c], x1=cb[c+1];
      if(y0==null||y1==null||x0==null||x1==null) continue;
      // Skip degenerate cells (would render as huge boxes when indices are off).
      const cellW=x1-x0, cellH=y1-y0;
      if(cellW<=0||cellH<=0||cellW>imgW*0.5||cellH>imgH*0.5) continue;
      const cell=document.createElement('button');
      let cls='kc-ocell';
      if(!t) cls+=' kc-empty';
      if(t && t.color==='R') cls+=' kc-red';
      if(t && (t.rank==='?'||t.margin<0.10)) cls+=' kc-flag';
      cell.className=cls;
      cell.dataset.key=key;
      cell.style.left   = (x0/imgW*100)+'%';
      cell.style.top    = (y0/imgH*100)+'%';
      cell.style.width  = ((x1-x0)/imgW*100)+'%';
      cell.style.height = ((y1-y0)/imgH*100)+'%';
      if(t){
        cell.textContent = t.rank;
        // Scale font to ~55% of cell width, smaller for two-char "10"
        const cellPx=(x1-x0);
        const factor = (t.rank==='10') ? 0.40 : 0.55;
        cell.style.fontSize = Math.max(10, cellPx*factor)+'px';
      }
      cell.addEventListener('click',e=>{e.stopPropagation(); openEditor(cell,key);});
      layer.appendChild(cell);
    }
  }

  function applyViewMode(){
    const isOverlay = viewMode==='overlay';
    $('#kc-overlay').hidden = !isOverlay;
    $('#kc-board').hidden   = isOverlay;
    $('#kc-viewopts').hidden = !isOverlay;
    document.querySelectorAll('.kc-mode').forEach(b=>{
      const on = b.dataset.mode===viewMode;
      b.classList.toggle('kc-mode-on', on);
      b.setAttribute('aria-selected', on?'true':'false');
    });
  }

  function renderGrid(){
    const svg=$('#kc-overlay-grid'); if(!svg) return;
    svg.innerHTML='';
    if(!geom||!geom.rb||!geom.cb||!imgW||!imgH) return;
    svg.setAttribute('viewBox', '0 0 '+imgW+' '+imgH);
    const ns='http://www.w3.org/2000/svg';
    // Cell gridlines (cyan) across the cropped board image.
    for(const y of geom.rb){
      const ln=document.createElementNS(ns,'line');
      ln.setAttribute('x1', 0); ln.setAttribute('x2', imgW);
      ln.setAttribute('y1', y); ln.setAttribute('y2', y);
      svg.appendChild(ln);
    }
    for(const x of geom.cb){
      const ln=document.createElementNS(ns,'line');
      ln.setAttribute('y1', 0); ln.setAttribute('y2', imgH);
      ln.setAttribute('x1', x); ln.setAttribute('x2', x);
      svg.appendChild(ln);
    }
  }

  // ---- editor popover ----
  let pop=null, popKeyHandler=null;
  function closeEditor(){
    if(pop){ pop.remove(); pop=null; document.removeEventListener('click',closeEditor); }
    if(popKeyHandler){ document.removeEventListener('keydown',popKeyHandler); popKeyHandler=null; }
  }
  // Keyboard shortcut → rank. a/1=A, 2-9 digits, 0/t=10, j=J, q=Q, k=K.
  const RANK_KEYS = {
    'a':'A','A':'A','1':'A',
    '2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
    '0':'10','t':'10','T':'10',
    'j':'J','J':'J',
    'q':'Q','Q':'Q',
    'k':'K','K':'K'
  };
  function openEditor(cell,key){
    closeEditor();
    const cur=tiles.get(key)||{rank:null,color:'B'};
    let color=cur.color||'B';
    pop=document.createElement('div'); pop.className='kc-pop';
    const seg=document.createElement('div'); seg.className='kc-seg';
    ['R','B'].forEach(c=>{ const bn=document.createElement('button'); bn.dataset.c=c;
      bn.textContent=c==='R'?'Red':'Black'; if(c===color)bn.classList.add('kc-on');
      bn.onclick=ev=>{ev.stopPropagation(); color=c;
        seg.querySelectorAll('button').forEach(x=>x.classList.toggle('kc-on',x.dataset.c===c));
        repaintRanks();};
      seg.appendChild(bn); });
    pop.appendChild(seg);
    const ranks=document.createElement('div'); ranks.className='kc-ranks';
    function repaintRanks(){ ranks.querySelectorAll('button').forEach(x=>x.classList.toggle('kc-red',color==='R')); }
    RANKS.forEach(rk=>{ const bn=document.createElement('button'); bn.textContent=rk;
      bn.onclick=ev=>{ev.stopPropagation(); tiles.set(key,{rank:rk,color,score:1}); refresh();};
      ranks.appendChild(bn); });
    pop.appendChild(ranks); repaintRanks();
    const hint=document.createElement('div'); hint.className='kc-pop-hint';
    hint.textContent='1/A · 2–9 · 0/T=10 · J/Q/K · R/B color · Del clear';
    pop.appendChild(hint);
    const clr=document.createElement('button'); clr.className='kc-clear'; clr.textContent='Clear square';
    clr.onclick=ev=>{ev.stopPropagation(); tiles.delete(key); refresh();};
    pop.appendChild(clr);
    document.body.appendChild(pop);
    const r=cell.getBoundingClientRect(); const pw=218, ph=pop.offsetHeight;
    let x=r.left+window.scrollX+r.width/2-pw/2;
    x=Math.max(10+window.scrollX, Math.min(x, window.scrollX+document.documentElement.clientWidth-pw-10));
    let y=r.bottom+window.scrollY+8;
    if(r.bottom+ph+12>window.innerHeight) y=r.top+window.scrollY-ph-8;
    pop.style.left=x+'px'; pop.style.top=y+'px';
    popKeyHandler = (e)=>{
      if(e.key==='Escape'){ e.preventDefault(); closeEditor(); return; }
      if(e.key==='Backspace'||e.key==='Delete'){
        e.preventDefault(); tiles.delete(key); refresh(); return;
      }
      if(e.key==='r'||e.key==='R'){
        e.preventDefault(); color='R';
        seg.querySelectorAll('button').forEach(x=>x.classList.toggle('kc-on',x.dataset.c==='R'));
        repaintRanks(); return;
      }
      if(e.key==='b'||e.key==='B'){
        e.preventDefault(); color='B';
        seg.querySelectorAll('button').forEach(x=>x.classList.toggle('kc-on',x.dataset.c==='B'));
        repaintRanks(); return;
      }
      const rk = RANK_KEYS[e.key];
      if(rk){
        e.preventDefault();
        tiles.set(key,{rank:rk,color,score:1});
        refresh();
      }
    };
    setTimeout(()=>{
      document.addEventListener('click',closeEditor);
      document.addEventListener('keydown',popKeyHandler);
    },0);
  }
  function refresh(){ closeEditor(); renderBoard(); renderOverlay(); recompute(); }

  // ---- remaining ----
  function recompute(){
    const shared=$('#kc-pool69').checked;
    const cells=[...tiles.values()];
    const out=KC.remaining(cells, shared);
    $('#kc-placed').textContent=out.placedCount;
    $('#kc-fill').style.width=(out.placedCount/104*100).toFixed(1)+'%';

    const wrap=$('#kc-remtiles'); wrap.innerHTML='';
    const note=$('#kc-emptynote');
    const items=[];
    for(const rk of RANKS){
      if(shared && (rk==='6'||rk==='9')) continue;
      for(const col of ['R','B']){ const n=out.rem[rk+col]; if(n>0) items.push({rk,col,n}); }
    }
    if(shared && out.pool){
      if(out.pool.redLeft>0)   items.push({rk:'6',col:'R',n:out.pool.redLeft, pool:true});
      if(out.pool.blackLeft>0) items.push({rk:'6',col:'B',n:out.pool.blackLeft, pool:true});
    }
    if(items.length===0){
      note.hidden=false;
      note.textContent = out.placedCount>=104 ? 'Every tile is on the board.' : 'No tiles left to draw.';
    } else {
      note.hidden=true;
      for(const it of items){
        const m=document.createElement('div'); m.className='kc-mini'+(it.pool?' kc-pool':'');
        m.appendChild(tileEl(it.rk,it.col));
        if(it.pool){ m.title='Reversible 6-or-9 tile'; }
        if(it.n>1){ const n=document.createElement('span'); n.className='kc-n'; n.textContent='×'+it.n; m.appendChild(n); }
        wrap.appendChild(m);
      }
    }

    const warn=$('#kc-warn'); warn.innerHTML='';
    if(out.over.length){
      const d=document.createElement('div'); d.className='kc-warn';
      const parts=out.over.map(o=>o.n+' extra '+(o.color==='R'?'red':'black')+' '+o.rank);
      d.innerHTML='<b>Check the board —</b> more tiles placed than exist ('+parts.join(', ')+
                  '). A rank was probably mis-read; tap those squares to fix.';
      warn.appendChild(d);
    }
  }

  // ---- input wiring ----
  function fileToImage(file){
    if(!file||!file.type.startsWith('image/')) return;
    const url=URL.createObjectURL(file), im=new Image();
    im.onload=()=>{handleImage(im); URL.revokeObjectURL(url);};
    im.src=url;
  }
  const drop=$('#kc-drop');
  drop.onclick=()=>$('#kc-file').click();
  drop.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault(); $('#kc-file').click();}};
  $('#kc-file').onchange=e=>fileToImage(e.target.files[0]);
  ['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault(); drop.classList.add('kc-over');}));
  ['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault(); drop.classList.remove('kc-over');}));
  drop.addEventListener('drop',e=>fileToImage(e.dataTransfer.files[0]));
  window.addEventListener('paste',e=>{ for(const it of e.clipboardData.items) if(it.type.startsWith('image/')) fileToImage(it.getAsFile()); });
  $('#kc-pool69').onchange=recompute;
  $('#kc-another').onclick=()=>{ $('#kc-boardbox').hidden=true; $('#kc-panel').hidden=true; $('#kc-drop').hidden=false; $('#kc-file').value=''; };

  // ---- view mode + opacity ----
  document.querySelectorAll('.kc-mode').forEach(b=>{
    b.addEventListener('click', ()=>{ viewMode = b.dataset.mode; applyViewMode(); });
  });
  const opacityEl = $('#kc-opacity'), tilesLayer = $('#kc-overlay-tiles');
  function applyOpacity(){ tilesLayer.style.opacity = (opacityEl.value/100).toFixed(2); }
  opacityEl.addEventListener('input', applyOpacity);
  applyOpacity();
  $('#kc-show-grid').addEventListener('change', e=>{
    $('#kc-overlay').classList.toggle('kc-show-grid', e.target.checked);
  });

  loadTemplates();
})();
