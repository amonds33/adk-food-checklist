'use strict';
const KEY='adk-cuisine-production-v2',OLD='adk-cuisine-production-v1';
const DAYS=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
// Quantités reprises des lignes journalières du classeur, sans arbitrer ses divergences de synthèse.
const SEED=[
['Mafé','Sauces et plats','portions',{0:25,1:25,3:25}],
['Yassa','Sauces et plats','portions',{0:20}],
['Sauce graine','Sauces et plats','portions',{1:30,3:30}],
['Kedjenou','Sauces et plats','portions',{3:20}],
['Sauce tomate-piment','Sauces et plats','lots',{0:1}],
['Sauce oignon','Sauces et plats','lots',{1:1,4:1}],
['Thieb du jour','Thieb','portions',{0:null,1:null,2:null,3:null,4:null,5:null,6:null}],
['Base Thieb','Thieb','lots',{0:null}],
['Épluchage des oignons','Préparations et stocks','lots',{2:null}],
['Contrôle des stocks','Préparations et stocks','contrôles',{2:1,4:1,5:1,6:1}],
['Réassort / rotation FIFO','Préparations et stocks','contrôles',{2:1,5:1,6:1}],
['Préparation des réserves week-end','Préparations et stocks','lots',{3:null,4:null}],
['Inventaire fin de semaine','Préparations et stocks','contrôles',{6:1}],
['Poulet sauté','Sauces et plats','portions',{}],['Tilapia frit','Sauces et plats','poissons',{}],
['Capitaine frit','Sauces et plats','poissons',{}],['Thon garba','Sauces et plats','portions',{}],
['Gombo','Sauces et plats','portions',{}],['Tilapia braisé','Sauces et plats','poissons',{}],['Poulet braisé','Sauces et plats','portions',{}],
['Attiéké','Accompagnements','portions',{}],['Banane alloco','Accompagnements','portions',{}],['Placali','Accompagnements','portions',{}],['Foutou','Accompagnements','portions',{}],
['Pastels thon','Accompagnements','pièces',{}],['Pastels viande','Accompagnements','pièces',{}],
['Oignons garba découpés','Préparations et stocks','portions',{}],['Tomates garba découpées','Préparations et stocks','portions',{}],['Piment frais découpé','Préparations et stocks','portions',{}],['Oignon crudité','Préparations et stocks','portions',{}],['Tomate crudité','Préparations et stocks','portions',{}]
];
const $=id=>document.getElementById(id),safe=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateISO=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,parse=s=>new Date(s+'T12:00:00'),plus=(s,n)=>{let d=parse(s);d.setDate(d.getDate()+n);return dateISO(d)},monday=s=>{let d=parse(s);d.setDate(d.getDate()-(d.getDay()+6)%7);return dateISO(d)};
const today=dateISO(new Date());let week=monday(today),day=(parse(today).getDay()+6)%7,activeView='production';
function seed(){return {type:'adk-cuisine-v2',products:SEED.map((s,i)=>({id:'p'+(i+1),name:s[0],category:s[1],unit:s[2],days:Array.from({length:7},(_,d)=>Object.hasOwn(s[3],d)?s[3][d]:false)})),records:{}}}
let data;try{data=JSON.parse(localStorage.getItem(KEY))}catch(e){};if(!data||data.type!=='adk-cuisine-v2'||!Array.isArray(data.products)||!data.records){data=seed();try{const old=JSON.parse(localStorage.getItem(OLD));if(old?.records&&old?.type==='adk-cuisine-v1'){data.records=old.records;for(const p of data.products){const op=old.targets?.[p.id];if(Array.isArray(op)&&op.length===7&&op.some(v=>v!==null)){p.days=op.map(v=>v===null?false:v)}}}}catch(e){}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch(e){alert('Échec de l’enregistrement : espace insuffisant ou stockage désactivé.');return false}}
persist();const currentDate=()=>plus(week,day),record=()=>data.records[currentDate()]||{manager:'',shift:'journee',notes:'',items:{}};
function status(p,v){const t=p.days[day];if(t===false)return {kind:'wait',text:'Non programmé',ok:false};if(v===undefined||v===null||v==='')return {kind:'wait',text:'À renseigner',ok:false};if(t===null)return {kind:'wait',text:'Quantité à définir',ok:false};if(!Number.isFinite(Number(v))||Number(v)<0)return {kind:'low',text:'Quantité invalide',ok:false};return Number(v)>=Number(t)?{kind:'ok',text:'OK',ok:true}:{kind:'low',text:`Manque ${Number(t)-Number(v)}`,ok:false}}
function dayBar(){$('weekLabel').textContent=`Du ${parse(week).toLocaleDateString('fr-FR')} au ${parse(plus(week,6)).toLocaleDateString('fr-FR')}`;$('dayTabs').innerHTML=DAYS.map((d,i)=>`<button class="${i===day?'active':''}" data-day="${i}">${d.slice(0,3)}<small>${plus(week,i).slice(-2)}</small></button>`).join('');$('dayTabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{day=Number(b.dataset.day);render()})}
function updateSummary(){const ps=data.products.filter(p=>p.days[day]!==false),r=record();let ok=0,low=0,entered=0;for(const p of ps){const s=status(p,r.items?.[p.id]);if(s.ok)ok++;if(s.kind==='low')low++;if(r.items?.[p.id]!==undefined&&r.items?.[p.id]!=='')entered++}$('summary').textContent=`${DAYS[day]} • ${ps.length} préparations • ${ok} OK • ${low} à compléter • ${entered} renseignées`}
function renderProduction(){const r=record();$('manager').value=r.manager||'';$('shift').value=r.shift||'journee';$('notes').value=r.notes||'';const scheduled=data.products.filter(p=>p.days[day]!==false),cats=[...new Set(scheduled.map(p=>p.category))];$('products').innerHTML=scheduled.length?cats.map(c=>`<article class="group"><h3>${safe(c)}</h3><div class="item"><div></div><div class="colhead">Prévu</div><div class="colhead">Réalisé</div><div class="colhead">OK</div></div>${scheduled.filter(p=>p.category===c).map(p=>{const v=r.items?.[p.id],st=status(p,v);return `<div class="item"><div><div class="name">${safe(p.name)}</div><div class="sub status ${st.kind}" id="status-${p.id}">${safe(st.text)}</div></div><div class="colhead">${p.days[day]===null?'À définir':p.days[day]}<br><small>${safe(p.unit)}</small></div><input type="number" min="0" step="1" inputmode="numeric" data-qty="${p.id}" aria-label="Quantité réalisée ${safe(p.name)}" value="${v??''}" placeholder="Qté"><input type="checkbox" data-ok="${p.id}" aria-label="OK ${safe(p.name)}" ${st.ok?'checked':''} disabled></div>`}).join('')}</article>`).join(''):'<div class="group" style="padding:15px">Aucune préparation prévue ce jour. Utilise l’onglet Programmation pour en ajouter.</div>';
$('products').querySelectorAll('[data-qty]').forEach(el=>el.addEventListener('input',()=>{const r=record();r.items??={};if(el.value!==''&&(!Number.isInteger(Number(el.value))||Number(el.value)<0)){el.setCustomValidity('Entier positif requis');el.reportValidity();return}el.setCustomValidity('');r.items[el.dataset.qty]=el.value;data.records[currentDate()]=r;persist();const p=data.products.find(p=>p.id===el.dataset.qty),s=status(p,el.value);$('status-'+p.id).textContent=s.text;$('status-'+p.id).className='sub status '+s.kind;$('products').querySelector(`[data-ok="${p.id}"]`).checked=s.ok;updateSummary();$('saveState').textContent='Quantité sauvegardée'}));updateSummary()}
function renderPlan(){const search=$('search').value.trim().toLowerCase(),ps=data.products.filter(p=>p.name.toLowerCase().includes(search)||p.category.toLowerCase().includes(search));$('planList').innerHTML=ps.map(p=>`<article class="plan-card" data-product="${p.id}"><div class="plan-card-head"><div><h3>${safe(p.name)}</h3><small>${safe(p.category)} • ${safe(p.unit)}</small></div><button type="button" class="danger" data-delete="${p.id}">Supprimer</button></div><div class="plan-grid">${DAYS.map((d,i)=>{const v=p.days[i];return `<label class="day-control ${v===false?'off':''}"><b>${d.slice(0,3)}</b><input type="checkbox" data-enable="${p.id}:${i}" ${v!==false?'checked':''}><input type="number" min="0" step="1" inputmode="numeric" aria-label="Portions ${safe(p.name)} ${d}" data-plan="${p.id}:${i}" value="${v===false||v===null?'':v}" placeholder="Qté" ${v===false?'disabled':''}></label>`}).join('')}</div><div class="help">Pour un jour actif, laisse la quantité vide si elle reste à définir.</div></article>`).join('')||'<p>Aucune préparation trouvée.</p>';
$('planList').querySelectorAll('[data-enable]').forEach(el=>el.onchange=()=>{const field=el.closest('label').querySelector('[data-plan]');field.disabled=!el.checked;el.closest('label').classList.toggle('off',!el.checked);if(el.checked)field.focus();$('planState').textContent='Modifications non enregistrées'});$('planList').querySelectorAll('[data-plan]').forEach(el=>el.oninput=()=>$('planState').textContent='Modifications non enregistrées');$('planList').querySelectorAll('[data-delete]').forEach(el=>el.onclick=()=>{const p=data.products.find(p=>p.id===el.dataset.delete);if(!confirm(`Supprimer « ${p.name} » du planning ? Les anciennes saisies resteront dans la sauvegarde JSON mais ne s’afficheront plus.`))return;data.products=data.products.filter(x=>x.id!==p.id);persist();render()})}
function savePlanning(){const cards=[...document.querySelectorAll('[data-product]')];for(const card of cards){const p=data.products.find(p=>p.id===card.dataset.product);if(!p)continue;const days=[];for(let i=0;i<7;i++){const cb=card.querySelector(`[data-enable="${p.id}:${i}"]`),inp=card.querySelector(`[data-plan="${p.id}:${i}"]`);if(!cb.checked){days.push(false);continue}if(inp.value===''){days.push(null);continue}const n=Number(inp.value);if(!Number.isSafeInteger(n)||n<0){alert(`Quantité invalide pour ${p.name}, ${DAYS[i]}`);inp.focus();return}days.push(n)}p.days=days}if(persist()){$('planState').textContent='Programmation enregistrée';render()}}
function saveMeta(){const r=record();r.manager=$('manager').value.trim();r.shift=$('shift').value;r.notes=$('notes').value;r.updatedAt=new Date().toISOString();r.items??={};data.records[currentDate()]=r;return persist()}
for(const id of ['manager','shift','notes'])$(id).addEventListener('change',()=>{saveMeta();$('saveState').textContent='Enregistré'});
$('save').onclick=()=>{if(!$('manager').value.trim()){alert('Saisis le nom du responsable.');return}saveMeta();$('saveState').textContent='Contrôle enregistré le '+new Date().toLocaleString('fr-FR')};
// Génération locale de PDF avec images JPEG, sans librairie ni serveur externe.
// Chaque page est dessinée sur canvas pour conserver les accents, le logo et une mise en page stable.
function pdfFileName(){return `ADK_Rapport_Cuisine_${currentDate()}.pdf`}
function buildPdfFromJpegs(images){
  const enc=new TextEncoder(), parts=[], positions=[], n=images.length;
  let pos=0;
  function push(v){let bytes=typeof v==='string'?enc.encode(v):v;parts.push(bytes);pos+=bytes.length}
  function object(id,body){positions[id]=pos;push(`${id} 0 obj\n`);push(body);push('\nendobj\n')}
  push('%PDF-1.4\n%ADK\n');
  object(1,`<< /Type /Catalog /Pages 2 0 R >>`);
  object(2,`<< /Type /Pages /Kids [${images.map((_,i)=>`${3+i*3} 0 R`).join(' ')}] /Count ${n} >>`);
  images.forEach((img,i)=>{
    const page=3+i*3, im=page+1, content=page+2;
    object(page,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im${i} ${im} 0 R >> >> /Contents ${content} 0 R >>`);
    positions[im]=pos;push(`${im} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.bytes.length} >>\nstream\n`);push(img.bytes);push('\nendstream\nendobj\n');
    const commands=`q\n595.28 0 0 841.89 0 0 cm\n/Im${i} Do\nQ\n`;
    object(content,`<< /Length ${enc.encode(commands).length} >>\nstream\n${commands}endstream`);
  });
  const start=pos, end=2+n*3;
  push(`xref\n0 ${end+1}\n0000000000 65535 f \n`);
  for(let k=1;k<=end;k++)push(`${String(positions[k]).padStart(10,'0')} 00000 n \n`);
  push(`trailer\n<< /Size ${end+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`);
  return new Blob(parts,{type:'application/pdf'});
}
async function createPdf(){
  saveMeta();
  const r=record(), ps=data.products.filter(p=>p.days[day]!==false);
  const W=1190,H=1684,margin=86, footerY=1570;
  const canvases=[];
  let logo=null;
  try{logo=await new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src='logo-adk.png'})}catch(e){}
  const categories=[...new Set(ps.map(p=>p.category))];
  let c,ctx,y,pageIndex=0;
  function newPage(){
    c=document.createElement('canvas');c.width=W;c.height=H;ctx=c.getContext('2d');
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#115038';ctx.fillRect(0,0,W,20);
    if(logo){const ratio=Math.min(145/logo.width,145/logo.height);const wi=logo.width*ratio,hi=logo.height*ratio;ctx.drawImage(logo,margin,56,wi,hi)}
    ctx.textAlign='left';ctx.fillStyle='#115038';ctx.font='bold 42px Arial';ctx.fillText('ABIDJAN–DAKAR FOOD',margin+165,103);
    ctx.fillStyle='#333';ctx.font='28px Arial';ctx.fillText('RAPPORT DE PRODUCTION CUISINE',margin+165,150);
    ctx.strokeStyle='#d8e2dd';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(margin,228);ctx.lineTo(W-margin,228);ctx.stroke();
    ctx.fillStyle='#222';ctx.font='26px Arial';ctx.fillText(`Date : ${new Date(currentDate()+'T12:00:00').toLocaleDateString('fr-FR')} (${DAYS[day]})`,margin,277);
    ctx.fillText(`Responsable : ${r.manager||'Non renseigné'}`,margin,316);
    ctx.fillText(`Service : ${r.shift==='journee'?'Journée':r.shift==='matin'?'Matin':r.shift==='soir'?'Soir':r.shift||'Journée'}`,margin,355);
    ctx.font='22px Arial';ctx.fillStyle='#666';ctx.fillText('Document généré depuis ADK Food • Production Cuisine',margin,398);
    ctx.font='22px Arial';ctx.fillStyle='#555';ctx.fillText(`Page ${++pageIndex}`,W-margin-90,footerY+47);
    ctx.fillText('Contrôles sanitaires et traçabilité : se référer au PMS.',margin,footerY+47);
    ctx.strokeStyle='#ddd';ctx.beginPath();ctx.moveTo(margin,footerY);ctx.lineTo(W-margin,footerY);ctx.stroke();
    canvases.push(c);y=452;
  }
  function line(txt,x,yy,font='24px Arial',color='#222',max=W-margin-x){ctx.font=font;ctx.fillStyle=color;ctx.fillText(String(txt),x,yy,max)}
  function category(name){if(y>footerY-110)newPage();ctx.fillStyle='#e7f1eb';ctx.fillRect(margin,y-33,W-2*margin,56);line(name,margin+14,y+4,'bold 26px Arial','#114c35');y+=70}
  function row(p){if(y>footerY-45){newPage();category('Suite du rapport')};const v=r.items?.[p.id],st=status(p,v),t=p.days[day],actual=v===undefined||v===''?'—':String(v),expected=t===null?'À définir':String(t),value=st.ok?'OK':st.kind==='low'?'MANQUE':'NON VÉRIFIÉ';
    if(((y/53)|0)%2===0){ctx.fillStyle='#f7f8f7';ctx.fillRect(margin,y-34,W-2*margin,54)}
    line(p.name,margin+9,y,'22px Arial','#222',405);line(expected,margin+430,y,'22px Arial','#333',115);line(actual,margin+580,y,'22px Arial','#333',100);line(value,margin+730,y,'bold 21px Arial',st.ok?'#137447':st.kind==='low'?'#b73531':'#666',255);y+=57;
  }
  newPage();
  const statuses=ps.map(p=>status(p,r.items?.[p.id]));
  line(`Total : ${ps.length} préparations  |  OK : ${statuses.filter(s=>s.ok).length}  |  Manques : ${statuses.filter(s=>s.kind==='low').length}`,margin,y,'bold 25px Arial','#115038');y+=58;
  ctx.fillStyle='#e9ecea';ctx.fillRect(margin,y-32,W-2*margin,53);
  line('PRÉPARATION',margin+9,y,'bold 21px Arial');line('PRÉVU',margin+430,y,'bold 21px Arial');line('RÉALISÉ',margin+580,y,'bold 21px Arial');line('STATUT',margin+730,y,'bold 21px Arial');y+=55;
  for(const cat of categories){category(cat);for(const p of ps.filter(p=>p.category===cat))row(p)}
  if(y>footerY-130)newPage();
  y+=35;line('OBSERVATIONS / ACTIONS',margin,y,'bold 26px Arial','#115038');y+=43;
  const note=r.notes?.trim()||'Aucune observation.';
  const words=note.split(/\s+/);let str='';
  for(const word of words){const trial=str?str+' '+word:word;if(ctx.measureText(trial).width>W-2*margin-20&&str){if(y>footerY-45)newPage();line(str,margin,y);y+=37;str=word}else str=trial}if(str){if(y>footerY-45)newPage();line(str,margin,y)}
  const images=[];for(const canvas of canvases){const blob=await new Promise(res=>canvas.toBlob(res,'image/jpeg',0.87));if(!blob)throw Error('Impossible de créer le PDF sur cet appareil');images.push({bytes:new Uint8Array(await blob.arrayBuffer()),width:W,height:H})}
  return new File([buildPdfFromJpegs(images)],pdfFileName(),{type:'application/pdf'});
}
async function deliverPdf(share){
  let file;
  try{file=await createPdf()}catch(e){alert('Erreur de génération PDF : '+e.message);return}
  if(share&&navigator.canShare&&navigator.canShare({files:[file]})&&navigator.share){
    try{await navigator.share({files:[file],title:'Rapport ADK Food — '+currentDate(),text:'Rapport de production du '+currentDate()+' — à adresser à contact@adk-food.fr'});return}catch(e){if(e.name==='AbortError')return}
  }
  const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  if(share)alert('Le rapport PDF a été téléchargé. Dans Gmail : nouveau mail vers contact@adk-food.fr, puis joins le fichier PDF téléchargé.');
}
$('email').onclick=()=>deliverPdf(true);
$('pdfDownload').onclick=()=>deliverPdf(false);
$('historyPdf').onclick=()=>deliverPdf(false);
$('weekDate').value=today;$('weekDate').onchange=()=>{const d=$('weekDate').value;if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return;week=monday(d);day=(parse(d).getDay()+6)%7;render()};
$('nav').querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{activeView=b.dataset.view;render()});
$('search').oninput=renderPlan;$('savePlan').onclick=savePlanning;
$('addNew').onclick=()=>$('modal').showModal();$('cancelNew').onclick=()=>$('modal').close();$('newForm').addEventListener('submit',e=>{e.preventDefault();const name=$('newName').value.trim(),unit=$('newUnit').value.trim();if(!name||!unit)return;if(data.products.some(p=>p.name.toLocaleLowerCase('fr')===name.toLocaleLowerCase('fr'))){alert('Cette préparation existe déjà dans le planning.');return}const id='custom-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);data.products.push({id,name,unit,category:$('newCategory').value,days:Array(7).fill(false)});persist();$('modal').close();$('newForm').reset();$('newUnit').value='portions';$('search').value='';render();document.querySelector(`[data-product="${id}"]`)?.scrollIntoView({behavior:'smooth',block:'center'})});
function download(name,txt,type){const url=URL.createObjectURL(new Blob([txt],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1800)}
$('backup').onclick=()=>download('adk-cuisine-v2-sauvegarde-'+today+'.json',JSON.stringify(data,null,2),'application/json');
$('csv').onclick=()=>{const rows=[['Date','Responsable','Preparation','Categorie','Objectif','Realise','Unite','Statut']];for(const [date,r] of Object.entries(data.records).sort()){const d=(parse(date).getDay()+6)%7;for(const p of data.products){const t=p.days[d];if(t===false)continue;const v=r.items?.[p.id];const state=v===''||v===undefined?'Non renseigné':t===null?'A définir':Number(v)>=Number(t)?'OK':'Insuffisant';rows.push([date,r.manager||'',p.name,p.category,t??'',v??'',p.unit,state])}}const csv='\ufeff'+rows.map(row=>row.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(';')).join('\r\n');download('adk-cuisine-export-'+today+'.csv',csv,'text/csv;charset=utf-8')};
$('restore').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const v=JSON.parse(await f.text());if(v.type!=='adk-cuisine-v2'||!Array.isArray(v.products)||typeof v.records!=='object')throw Error('Sauvegarde non compatible');if(confirm('Remplacer le planning et les historiques de cet appareil ?')){data=v;persist();render()}}catch(err){alert('Fichier JSON invalide : '+err.message)}finally{e.target.value=''}};
function history(){const dates=Object.keys(data.records).sort().reverse();$('historyList').innerHTML=dates.length?dates.map(d=>`<div class="historyrow"><b>${d}</b> — ${safe(data.records[d].manager||'Non renseigné')} <span class="muted">• ${Object.keys(data.records[d].items||{}).length} valeurs</span></div>`).join(''):'Aucune saisie enregistrée.'}
function render(){dayBar();document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===activeView));document.querySelectorAll('.view').forEach(el=>el.classList.toggle('hidden',el.id!==activeView));renderProduction();if(activeView==='planning')renderPlan();if(activeView==='history')history()}
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('./sw.js').catch(()=>{});render();
