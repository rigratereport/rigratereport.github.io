(function(){
  // City search on home and index pages
  var q=document.getElementById('city-q');
  if(q){var cards=[].slice.call(document.querySelectorAll('[data-search]')),out=document.getElementById('city-count'),empty=document.getElementById('city-empty');
    q.addEventListener('input',function(){var t=q.value.trim().toLowerCase(),n=0;cards.forEach(function(c){var ok=!t||c.getAttribute('data-search').indexOf(t)>-1;c.hidden=!ok;if(ok)n++;});
      if(out)out.textContent='Showing '+n+' of '+cards.length+' cities';if(empty)empty.style.display=n?'none':'block';});}
  // Facility type filter on city pages
  var fb=[].slice.call(document.querySelectorAll('.filters button'));
  if(fb.length){var items=[].slice.call(document.querySelectorAll('[data-types]')),st=document.getElementById('fac-count');
    fb.forEach(function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-f');fb.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
      var n=0;items.forEach(function(it){var ok=k==='all'||(' '+it.getAttribute('data-types')+' ').indexOf(' '+k+' ')>-1;it.hidden=!ok;if(ok&&it.tagName==='ARTICLE')n++;});
      if(st)st.textContent='Showing '+n+' facilities';});});}
})();
