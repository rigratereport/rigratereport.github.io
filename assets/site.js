(function(){
  // Facility type filter on city pages
  var fb=[].slice.call(document.querySelectorAll('.filters button'));
  if(fb.length){var items=[].slice.call(document.querySelectorAll('[data-types]')),st=document.getElementById('fac-count');
    fb.forEach(function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-f');fb.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
      var n=0;items.forEach(function(it){var ok=k==='all'||(' '+it.getAttribute('data-types')+' ').indexOf(' '+k+' ')>-1;it.hidden=!ok;if(ok&&it.tagName==='ARTICLE')n++;});
      if(st)st.textContent='Showing '+n+' facilities';});});}
})();
/* Shared progressive-enhancement helpers (no framework). Works without JS: forms jump to the list, links are plain links. */
(function(){
  [].forEach.call(document.querySelectorAll('form[data-finder]'),function(f){
    var id=f.getAttribute('data-finder'),q=f.querySelector('input[type=search]'),list=document.getElementById(id),out=f.querySelector('[data-count]'),empty=document.getElementById(id+'-empty');
    if(!q||!list)return;
    var items=[].slice.call(list.querySelectorAll('[data-name]'));
    function run(){var v=q.value.trim().toLowerCase(),k=0,hit=null;
      items.forEach(function(c){var m=!v||c.getAttribute('data-name').indexOf(v)>-1;c.hidden=!m;if(m){k++;hit=c;}});
      if(out)out.textContent=v?(k===0?'No match yet. Try another name.':(k===1?'1 match':k+' matches')):'';
      if(empty)empty.hidden=!!k;return k===1?hit:null;}
    q.addEventListener('input',run);
    f.addEventListener('submit',function(ev){var h=run();var a=h&&(h.tagName==='A'?h:h.querySelector('a'));if(a){ev.preventDefault();location.href=a.href;}});
  });
  // Row filter for data tables: <input data-rows="tableId">
  [].forEach.call(document.querySelectorAll('input[data-rows]'),function(i){
    var t=document.getElementById(i.getAttribute('data-rows'));if(!t)return;var rows=[].slice.call(t.querySelectorAll('tbody tr')),out=document.getElementById(i.id+'-count');
    i.addEventListener('input',function(){var v=i.value.trim().toLowerCase(),k=0;rows.forEach(function(r){var m=!v||(r.getAttribute('data-n')||r.textContent.toLowerCase()).indexOf(v)>-1;r.hidden=!m;if(m)k++;});
      if(out)out.textContent=v?('Showing '+k+' of '+rows.length):'';});
  });
})();
/* State -> County -> City picker. Progressive enhancement: without JS the covered-pages list stays visible. */
(function(){
  [].forEach.call(document.querySelectorAll('[data-picker]'),function(pk){
    var row=pk.querySelector('.pk-row'),out=pk.querySelector('.pk-result'),src=pk.querySelector('.pk-src'),
      sS=pk.querySelector('[data-pk=state]'),sC=pk.querySelector('[data-pk=county]'),sP=pk.querySelector('[data-pk=city]'),data=null,loading=null;
    var fb=pk.parentNode.querySelector('[data-picker-fallback]');
    row.hidden=false;if(src)src.hidden=false;pk.parentNode.classList.add('js');
    function load(){if(!loading)loading=fetch(pk.getAttribute('data-picker')).then(function(r){return r.json();}).then(function(d){data=d;return d;});return loading;}
    function opt(v,t,dis){var o=document.createElement('option');o.value=v;o.textContent=t;if(dis)o.className='soon';return o;}
    function reset(s,t){s.innerHTML='';s.appendChild(opt('',t));s.disabled=true;}
    function say(html){out.innerHTML=html;}
    function esc(t){return t.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
    function go(u,label){say('<a class="pk-go" href="'+u+'">'+esc(label)+' <span aria-hidden="true">&rarr;</span></a>');}
    function soon(label){say('<p class="pk-soon"><strong>'+esc(label)+'</strong> (coming soon). We haven\'t covered it yet.</p>');}
    sS.addEventListener('focus',load);sS.addEventListener('pointerdown',load);
    if('requestIdleCallback' in window)requestIdleCallback(load);else setTimeout(load,1500);
    sS.addEventListener('change',function(){reset(sC,'Loading counties…');reset(sP,'Pick a county');say('');
      if(!sS.value){reset(sC,'Pick a state');return;}
      load().then(function(d){var st=d.states[sS.value];sC.innerHTML='';sC.appendChild(opt('','Choose a county ('+st[1].length+')'));
        var n=0;st[1].forEach(function(c,i){var cov=!!c[1];if(cov)n++;sC.appendChild(opt(String(i),c[0]+(cov?'':' (coming soon)'),!cov));});
        sC.disabled=false;say('<p class="pk-note">'+n+' of '+st[1].length+' counties in '+esc(st[0])+' are covered so far.</p>');});});
    if(sS.options.length===2){sS.selectedIndex=1;load().then(function(){sS.dispatchEvent(new Event('change'));});}
    sC.addEventListener('change',function(){reset(sP,'Pick a county');say('');if(sC.value==='')return;
      var st=data.states[sS.value],c=st[1][+sC.value],places=c[2];
      sP.innerHTML='';sP.appendChild(opt('',places.length?'Choose a city or town ('+places.length+')':'No Census places listed'));
      places.forEach(function(p,i){sP.appendChild(opt(String(i),p[0]+(p[1]?'':' (coming soon)'),!p[1]));});sP.disabled=!places.length;
      if(typeof c[1]==='string'){go(c[1],'Open the '+c[0]+' page');}
      else if(c[1]){say('<p class="pk-note">'+esc(c[0])+' has covered towns. Pick one below.</p>');}
      else soon(c[0]+', '+st[0]);});
    sP.addEventListener('change',function(){if(sP.value==='')return;var st=data.states[sS.value],c=st[1][+sC.value],p=c[2][+sP.value];
      if(p[1])go(p[1],data.mode==='county'?(p[0]+' is on the '+c[0]+' page'):('See '+p[0].replace(/ \(.*\)$/,'')+', '+sS.value));else soon(p[0]+', '+c[0]);});
  });
})();
