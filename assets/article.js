(()=>{'use strict';
const $=(s)=>document.querySelector(s),$$=(s)=>[...document.querySelectorAll(s)];
const progress=$('.progress');
function updateProgress(){const full=document.documentElement.scrollHeight-innerHeight;progress.style.width=(full>0?Math.min(100,scrollY/full*100):0)+'%'}
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
if('IntersectionObserver' in window){const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){$$('.contents a').forEach(a=>a.classList.toggle('active',a.dataset.chapter===e.target.id));}})},{rootMargin:'-12% 0px -70% 0px'});$$('.chapter').forEach(s=>obs.observe(s));}
function revealSource(id){const details=$('#source-details');if(details)details.open=true;const target=document.getElementById(id);if(target){requestAnimationFrame(()=>{target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});target.focus({preventScroll:true});});}}
$$('[data-source]').forEach(a=>a.addEventListener('click',()=>revealSource('source-'+a.dataset.source)));
if(location.hash.startsWith('#source-'))revealSource(location.hash.slice(1));
$$('.mobile-toc .contents a').forEach(a=>a.addEventListener('click',()=>{$('.mobile-toc').open=false;}));
const dialog=$('#image-dialog');let lastFocus;
$$('[data-image]').forEach(b=>b.addEventListener('click',()=>{lastFocus=b;const img=dialog.querySelector('img');img.src=b.dataset.image;img.alt=b.dataset.alt||'';dialog.showModal();document.body.classList.add('locked');}));
function closeDialog(){dialog.close();document.body.classList.remove('locked');if(lastFocus)lastFocus.focus({preventScroll:true});}
$('.lightbox-close').addEventListener('click',closeDialog);dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog();});dialog.addEventListener('cancel',()=>document.body.classList.remove('locked'));
addEventListener('beforeprint',()=>{$('#source-details').open=true;});
})();