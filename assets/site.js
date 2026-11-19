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
