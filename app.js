'use strict';
const KEY='adk-food-pwa-v1';
const APP_VERSION='V4';
const CATALOG=[
['Plats','Poulet sauté','portions'],['Plats','Tilapia frit','poissons'],['Plats','Thon garba','portions'],['Plats','Thieb','portions'],['Plats','Yassa','portions'],['Plats','Mafé','portions'],['Plats','Sauce graine','portions'],['Plats','Poisson capitaine frit','poissons'],['Plats','Kedjenou','portions'],['Plats','Poisson braisé (tilapia mariné)','poissons'],['Plats','Poulet mariné braisé','portions'],
['Accompagnements','Attiéké','portions'],['Accompagnements','Banane alloco','portions'],['Accompagnements','Placali','portions'],['Accompagnements','Foutou','portions'],
['Sauces','Sauce tomate-piment en pot','pots'],['Sauces','Sauce oignon en pot','pots'],['Sauces','Sauce oignon bain-marie','portions'],['Sauces','Sauce piment-oignon bain-marie','portions'],
['Pastels','Pastels thon','pièces'],['Pastels','Pastels viande','pièces'],
['Crudités','Oignon découpé garba','portions'],['Crudités','Tomate découpée garba','portions'],['Crudités','Piment frais découpé','portions'],['Crudités','Oignon crudité','portions'],['Crudités','Tomate crudité','portions'],
['Emballages','Barquette plastique 2 compartiments','pièces'],['Emballages','Barquette plastique 3 compartiments','pièces'],['Emballages','Barquette aluminium','pièces'],['Emballages','Pot huile rempli','pots'],['Emballages','Pot sel rempli','pots'],['Emballages','Pot piment-tomate rempli','pots']
].map(([cat,name,unit],i)=>({id:'p'+(i+1),cat,name,unit}));
const START_TARGETS={ 'Poulet sauté':[24,16],'Tilapia frit':[6,4],'Thon garba':[6,4],'Thieb':[6,4],'Yassa':[3,2],'Mafé':[3,2],'Sauce graine':[3,2],'Poisson capitaine frit':[6,4]};
const initial=()=>({version:1,targets:Object.fromEntries(CATALOG.map(p=>[p.id,START_TARGETS[p.name]||[null,null]])),checks:{}});
let db;
try{db=JSON.parse(localStorage.getItem(KEY))||initial();if(!db||typeof db!=='object'||!db.targets||!db.checks)throw Error('bad store');}catch(e){alert('Données locales illisibles. Une session vierge est affichée ; exportez vos anciennes données si possible.');db=initial()}
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(db));return true}catch(e){alert('Impossible d’enregistrer sur cette tablette : espace ou stockage indisponible.');return false}};
const dateLocal=()=>{let d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
$('date').value=dateLocal();
const recordId=()=>`${$('date').value}_${$('shift').value}`;
function showTab(tab){document.querySelectorAll('.page').forEach(el=>el.classList.toggle('hidden',el.id!==tab));document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));if(tab==='targets')renderTargets();if(tab==='history')renderHistory()}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));
let draft={};let dirty=false;
function getTarget(p){const t=db.targets[p.id]||[null,null];return t[$('shift').value==='midi'?0:1]}
function autoOk(p,v){const target=getTarget(p);return target!==null&&target!==undefined&&target!==''&&v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v))&&Number(v)>=Number(target)}
function status(p,v){const target=getTarget(p);if(v===''||v===null||v===undefined)return ['Non renseigné','unknown'];if(target===null||target===''||target===undefined)return ['Objectif à définir','unknown'];return Number(v)>=Number(target)?['OK','ok']:[`Manque : ${Math.max(0,Number(target)-Number(v))} ${p.unit}`,'low']}
function renderChecks(){
  const rec=db.checks[recordId()]||{items:{},manager:'',notes:''};
  draft=JSON.parse(JSON.stringify(rec.items||{}));
  $('manager').value=rec.manager||'';$('notes').value=rec.notes||'';
  const categories=[...new Set(CATALOG.map(p=>p.cat))];
  $('checklist').innerHTML=categories.map(cat=>`<article class="group"><h2>${esc(cat)}</h2>${CATALOG.filter(p=>p.cat===cat).map(p=>{
    const d=draft[p.id]||{};
    const objective=getTarget(p);
    // Pour un objectif défini, le OK est toujours déduit de la quantité disponible.
    if(objective!==null && objective!==undefined && objective!=='')d.checked=autoOk(p,d.qty);
    draft[p.id]=d;
    const [label,cls]=status(p,d.qty);
    return `<div class="item"><input type="checkbox" data-check="${p.id}" aria-label="OK : ${esc(p.name)}" ${d.checked?'checked':''} ${objective!=null&&objective!==''?'disabled title="Cocher automatiquement selon la quantité saisie"':''}><div><div class="name">${esc(p.name)}</div><div class="unit">Objectif : ${objective??'—'} ${esc(p.unit)}</div><div class="status ${cls}" id="s-${p.id}">${label}</div></div><input type="number" min="0" step="1" inputmode="numeric" data-qty="${p.id}" aria-label="Quantité disponible ${esc(p.name)}" placeholder="Qté" value="${d.qty??''}"></div>`}).join('')}</article>`).join('');
  $('checklist').querySelectorAll('[data-check]').forEach(el=>el.addEventListener('change',()=>{const p=el.dataset.check;draft[p]={...(draft[p]||{}),checked:el.checked};dirty=true;renderProgress()}));
  $('checklist').querySelectorAll('[data-qty]').forEach(el=>el.addEventListener('input',()=>{
    const id=el.dataset.qty,val=el.value;
    const product=CATALOG.find(x=>x.id===id);
    const objective=getTarget(product);
    const item={...(draft[id]||{}),qty:val};
    if(objective!==null && objective!==undefined && objective!=='')item.checked=autoOk(product,val);
    draft[id]=item;
    const checkbox=$('checklist').querySelector(`[data-check="${id}"]`);
    checkbox.checked=!!item.checked;
    const [label,cls]=status(product,val);$('s-'+id).textContent=label;$('s-'+id).className='status '+cls;
    dirty=true;renderProgress();
  }));
  renderProgress();dirty=false;
}
function renderProgress(){
  const ok=CATALOG.filter(p=>draft[p.id]?.checked).length;
  const entered=CATALOG.filter(p=>draft[p.id]?.qty!==''&&draft[p.id]?.qty!==undefined&&draft[p.id]?.qty!==null).length;
  const lacks=CATALOG.filter(p=>status(p,draft[p.id]?.qty)[1]==='low').length;
  $('progress').textContent=`${ok}/${CATALOG.length} OK · ${entered} quantité(s) saisie(s) · ${lacks} manque(s)`;
}
function switchRecord(){if(dirty&&!confirm('Des modifications ne sont pas enregistrées. Changer de service sans enregistrer ?'))return false;renderChecks();$('saveStatus').textContent='';return true}
let lastDate=$('date').value,lastShift=$('shift').value;
$('date').addEventListener('change',()=>{if(!switchRecord()){$('date').value=lastDate;return}lastDate=$('date').value});$('shift').addEventListener('change',()=>{if(!switchRecord()){$('shift').value=lastShift;return}lastShift=$('shift').value});
$('manager').addEventListener('input',()=>dirty=true);$('notes').addEventListener('input',()=>dirty=true);
$('save').addEventListener('click',()=>{if(!$('manager').value.trim()){alert('Renseignez le nom du responsable.');$('manager').focus();return}if(CATALOG.some(p=>draft[p.id]?.checked&&(draft[p.id].qty===''||draft[p.id].qty===undefined))){alert('Un produit coché n’a pas de quantité renseignée.');return}db.checks[recordId()]={date:$('date').value,shift:$('shift').value,manager:$('manager').value.trim(),notes:$('notes').value,items:draft,updatedAt:new Date().toISOString()};if(persist()){dirty=false;$('saveStatus').textContent=`Contrôle enregistré : ${new Date().toLocaleString('fr-FR')}`}});

// Le mail est preparé dans le client e-mail ; cette application n'envoie rien silencieusement.
function prepareEmailReport(){
  const key=recordId(),rec=db.checks[key];
  if(dirty || !rec){alert('Enregistrez d’abord le contrôle avant de préparer le rapport.');return}
  const products=CATALOG.map(p=>({p,item:rec.items?.[p.id]||{},target:db.targets[p.id]?.[rec.shift==='midi'?0:1]}));
  const checked=products.filter(x=>x.item.checked);
  const entered=products.filter(x=>x.item.qty!==undefined&&x.item.qty!==''&&x.item.qty!==null);
  if(!entered.length){alert('Aucune quantité saisie. Renseignez les quantités puis enregistrez le contrôle.');return}
  const shortages=entered.filter(x=>x.target!=null&&Number(x.item.qty)<Number(x.target));
  const undefinedTargets=entered.filter(x=>x.target==null);
  const missingQuantities=checked.filter(x=>x.item.qty===''||x.item.qty===undefined);
  const subject=`ADK Food - Controle ${rec.shift} du ${rec.date}`;
  const lines=[
    'ABIDJAN-DAKAR FOOD - RAPPORT AVANT SERVICE',
    `Date : ${rec.date}`,
    `Service : ${rec.shift.toUpperCase()}`,
    `Responsable : ${rec.manager}`,
    `Produits OK : ${checked.length}/${CATALOG.length}`,
    `Produits avec quantite saisie : ${entered.length}/${CATALOG.length}`,
    `Produits insuffisants : ${shortages.length}`,
    '',
    'MANQUES A COMPLETER :',
    ...(shortages.length?shortages.map(x=>`- ${x.p.name} : ${x.item.qty}/${x.target} ${x.p.unit} (manque ${Number(x.target)-Number(x.item.qty)})`):['Aucun manque constate parmi les produits renseignes avec un objectif defini.']),
    '',
    'DETAIL DES PRODUITS RENSEIGNES :',
    ...entered.map(x=>`- ${x.p.name} : ${x.item.qty??'?'} ${x.p.unit} / objectif ${x.target??'non defini'}`),
    '',
    `Objectifs non definis : ${undefinedTargets.length}`,
    `Quantites non renseignees : ${missingQuantities.length}`,
    `Remarques : ${rec.notes||'Aucune'}`,
    '',
    'Rapport genere depuis la tablette ADK Food.'
  ];
  // URI mailto : l'utilisateur doit encore confirmer dans son application mail.
  const link=`mailto:contact@adk-food.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  window.location.href=link;
  $('saveStatus').textContent='Application e-mail ouverte : vérifiez le destinataire et confirmez l’envoi. Aucun envoi automatique.';
}
$('sendMail').addEventListener('click',prepareEmailReport);

function renderTargets(){$('targetList').innerHTML='<div class="target-item target-head"><div>Produit</div><div>Midi</div><div>Soir</div></div>'+CATALOG.map(p=>{const t=db.targets[p.id]||[null,null];return `<div class="target-item"><span>${esc(p.name)} <small>(${esc(p.unit)})</small></span><input type="number" min="0" step="1" inputmode="numeric" data-target="${p.id}" data-index="0" aria-label="${esc(p.name)} midi" value="${t[0]??''}"><input type="number" min="0" step="1" inputmode="numeric" data-target="${p.id}" data-index="1" aria-label="${esc(p.name)} soir" value="${t[1]??''}"></div>`}).join('')}
$('saveTargets').addEventListener('click',()=>{const next={};document.querySelectorAll('[data-target]').forEach(input=>{const id=input.dataset.target,index=Number(input.dataset.index);if(!next[id])next[id]=[null,null];next[id][index]=input.value===''?null:Math.max(0,parseInt(input.value,10))});db.targets=next;if(persist()){alert('Objectifs enregistrés.');renderChecks()}});
function renderHistory(){const records=Object.values(db.checks).sort((a,b)=>b.date.localeCompare(a.date)||(a.shift==='soir'?-1:1));$('historyList').innerHTML=records.length?'':'Aucun contrôle enregistré.';records.forEach(rec=>{const valid=CATALOG.filter(p=>rec.items?.[p.id]?.checked).length;const low=CATALOG.filter(p=>rec.items?.[p.id]?.qty!==''&&rec.items?.[p.id]?.qty!==undefined&&db.targets[p.id]?.[rec.shift==='midi'?0:1]!=null&&Number(rec.items[p.id].qty)<Number(db.targets[p.id][rec.shift==='midi'?0:1])).length;const div=document.createElement('div');div.className='history-entry';div.innerHTML=`<strong>${esc(rec.date)} — ${esc(rec.shift)}</strong><br>${esc(rec.manager)} · ${valid}/${CATALOG.length} OK · ${low} manque(s)<br><small>${esc(rec.notes||'')}</small><br><button>Voir / modifier</button>`;div.querySelector('button').addEventListener('click',()=>{if(dirty&&!confirm('Quitter les modifications non enregistrées ?'))return;$('date').value=rec.date;$('shift').value=rec.shift;lastDate=rec.date;lastShift=rec.shift;renderChecks();showTab('check')});$('historyList').append(div)})}
function download(content,filename,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
$('exportJson').onclick=()=>download(JSON.stringify({exportVersion:1,exportedAt:new Date().toISOString(),data:db},null,2),'adk-sauvegarde-'+dateLocal()+'.json','application/json');
const cell=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
$('exportCsv').onclick=()=>{const rows=[['Date','Service','Responsable','Produit','Catégorie','Unité','Vérifié','Quantité disponible','Objectif actuel','Remarque']];Object.values(db.checks).forEach(rec=>CATALOG.forEach(p=>rows.push([rec.date,rec.shift,rec.manager,p.name,p.cat,p.unit,rec.items?.[p.id]?.checked?'Oui':'Non',rec.items?.[p.id]?.qty??'',db.targets[p.id]?.[rec.shift==='midi'?0:1]??'',rec.notes||''])));download('\ufeff'+rows.map(r=>r.map(cell).join(';')).join('\r\n'),'adk-historique-'+dateLocal()+'.csv','text/csv;charset=utf-8')};
$('importJson').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const obj=JSON.parse(await file.text());if(obj.exportVersion!==1||!obj.data||!obj.data.targets||!obj.data.checks||typeof obj.data.checks!=='object')throw Error('Format non reconnu');if(!confirm('Remplacer TOUTES les données présentes par cette sauvegarde ?'))return;db=obj.data;if(persist()){renderChecks();$('backupStatus').textContent='Sauvegarde restaurée.'}}catch(err){alert('Sauvegarde invalide : '+err.message)}finally{e.target.value=''}});
function updateConnection(){$('connectivity').textContent=navigator.onLine?'En ligne':'Hors ligne'}window.addEventListener('online',updateConnection);window.addEventListener('offline',updateConnection);updateConnection();
if('serviceWorker' in navigator && location.protocol.startsWith('http')) {
 navigator.serviceWorker.register('./sw.js?v=4', {updateViaCache:'none'}).then(reg=>reg.update()).catch(()=>{});
}
renderChecks();
