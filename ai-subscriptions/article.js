
'use strict';
const D=JSON.parse(document.getElementById('article-data').textContent);
const $=s=>document.querySelector(s);
const allPlanRows=Array.from(document.querySelectorAll('#plan-table tbody tr'));
function filterPlans(){
  const q=$('#plan-search').value.trim().toLocaleLowerCase('ru');
  const p=$('#provider-filter').value,c=$('#clarity-filter').value;
  let count=0;
  allPlanRows.forEach(r=>{const visible=(!q||r.textContent.toLocaleLowerCase('ru').includes(q))&&(p==='all'||r.dataset.provider===p)&&(c==='all'||r.dataset.clarity===c);r.hidden=!visible;if(visible)count++;});
  $('#plan-count').textContent=`Показано ${count} из ${allPlanRows.length} строк. Цены CNY не пересчитаны в USD.`;
  $('#no-plans').style.display=count?'none':'block';
}
['#plan-search','#provider-filter','#clarity-filter'].forEach(s=>$(s).addEventListener('input',filterPlans));
$('#reset-plans').addEventListener('click',()=>{$('#plan-search').value='';$('#provider-filter').value='all';$('#clarity-filter').value='all';filterPlans();});
const modelRows=Array.from(document.querySelectorAll('#model-table tbody tr'));
modelRows.forEach((r,i)=>r.dataset.original=i);
function renderModels(){
 const q=$('#model-search').value.trim().toLocaleLowerCase('ru'),sort=$('#model-sort').value;
 const rows=[...modelRows];
 if(sort==='score')rows.sort((a,b)=>Number(b.dataset.index)-Number(a.dataset.index)||Number(a.dataset.cost)-Number(b.dataset.cost));
 else if(sort==='cost')rows.sort((a,b)=>Number(a.dataset.cost)-Number(b.dataset.cost));
 else rows.sort((a,b)=>Number(a.dataset.original)-Number(b.dataset.original));
 let previous=null;
 rows.forEach(r=>{r.hidden=q&&!r.textContent.toLocaleLowerCase('ru').includes(q);r.classList.toggle('groupstart',sort==='family'&&previous!==null&&previous!==r.dataset.family);$('#model-table tbody').appendChild(r);if(!r.hidden)previous=r.dataset.family;});
}
$('#model-sort').addEventListener('change',renderModels);$('#model-search').addEventListener('input',renderModels);
const nf=new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2,minimumFractionDigits:2});
function calc(){
 const r=D.api[Number($('#calc-model').value)];
 let budget=Number($('#calc-budget').value),out=Number($('#calc-output').value);
 if(!Number.isFinite(budget)||budget<0||!Number.isFinite(out)||out<0||out>100){$('#calc-total').textContent='Проверьте ввод';$('#calc-price').textContent='—';$('#calc-split').textContent='—';return;}
 const q=out/100,unit=(1-q)*r.input+q*r.output,total=budget/unit;
 $('#calc-total').textContent=nf.format(total)+' млн';$('#calc-price').textContent='$'+nf.format(unit);$('#calc-split').textContent=nf.format(total*(1-q))+' / '+nf.format(total*q);
 $('#calc-model-note').textContent=r.note||'Стандартный текстовый тариф. Дополнительные сборы не включены.';
}
['#calc-model','#calc-budget','#calc-output'].forEach(s=>$(s).addEventListener('input',calc));calc();
function save(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
const quote=x=>'"'+String(x??'').replaceAll('"','""')+'"';
function csv(rows){return '\uFEFF'+rows.map(r=>r.map(quote).join(',')).join('\r\n');}
function sourceURLs(refs){return refs.map(k=>D.sources[k].url).join(' | ');}
$('#download-plans').addEventListener('click',()=>save('ai-subscriptions-2026-09-29.csv',csv([['provider','plan','price_per_month','currency','public_quota','token_transparency','note','sources'],...D.plans.map(r=>[r.provider,r.name,r.price,r.currency,r.quota,r.tokens,r.note,sourceURLs(r.refs)])]),'text/csv;charset=utf-8'));
$('#download-models').addEventListener('click',()=>save('ai-model-quality-2026-09-29.csv',csv([['family','model','configuration','AA_index_v4.3.2','USD_per_AA_task','note','sources'],...D.models.map(r=>[r.family,r.name,r.mode,r.index,r.cost,r.note,sourceURLs(r.refs)])]),'text/csv;charset=utf-8'));
$('#download-api').addEventListener('click',()=>save('ai-api-prices-2026-09-29.csv',csv([['model','input_USD_per_M','cache_read_USD_per_M','output_USD_per_M','blend_80_20_USD_per_M','M_tokens_for_20_USD_API','note','sources'],...D.api.map(r=>[r.name,r.input,r.cache,r.output,r.blend_80_20,r.million_tokens_for_20,r.note,sourceURLs(r.refs)])]),'text/csv;charset=utf-8'));
$('#download-data').addEventListener('click',()=>save('kontrabanda-ai-data-2026-09-29.json',JSON.stringify(D,null,2),'application/json;charset=utf-8'));
if('IntersectionObserver' in window){const links=Array.from(document.querySelectorAll('.toc a'));const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}});},{rootMargin:'-8% 0px -72% 0px',threshold:0});document.querySelectorAll('.section').forEach(s=>observer.observe(s));}
