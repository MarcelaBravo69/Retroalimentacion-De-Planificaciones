
const D=window.DATA,$=i=>document.getElementById(i);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
const tok=s=>new Set(norm(s).split(' ').filter(w=>w.length>3));
const EP='Educación Parvularia',PO='Lengua y Cultura de los Pueblos Originarios (Interculturalidad)',ING='Idioma Extranjero: Inglés',NIV=['Sala cuna','Nivel medio','Nivel transición'];
const A={};D.basica.forEach(o=>(A[o.asignatura]=A[o.asignatura]||new Set()).add(o.curso));D.ingles_1a4.forEach(o=>(A[ING]=A[ING]||new Set()).add(o.curso));
A[PO]=new Set([1,2,3,4,5,6]);A[EP]=new Set(NIV);
const LAB={OA_NO_COINCIDE:'OA que no coinciden con las bases',OA_PARCIAL:'OA con redacción distinta a la oficial',OA_SIN_DECLARAR:'OA sin declarar en formato numerado',EVAL_ETAPAS:'Faltan etapas de evaluación',SIN_INDICADORES:'Sin indicadores de logro',SIN_DUA:'Sin apartado DUA',SIN_ADECUACION:'Sin adecuaciones',NEE_NO_ESPECIFICADA:'NEE no especificada',SIN_OBJ_CLASES:'Sin objetivos de clase',SIN_PME:'Sin vínculo con el PME',POCAS_UNIDADES:'Pocas unidades detectadas',TALLER_FECHA_DIA:'Fechas fuera del día del taller',TALLER_NUM_DUP:'Numeración de sesiones repetida',TALLER_TIEMPO:'Sesiones que exceden el horario',TALLER_SIN_FECHAS:'Taller sin fechas legibles',DATOS_PERSONALES:'Posibles datos personales (RUT)',EJES_NO_CUBIERTOS:'Ejes de Pueblos Originarios sin trabajar',DUA_INCOMPLETO:'DUA sin los tres principios',SIN_RETROALIMENTACION:'Sin retroalimentación declarada',SIN_PACI:'Sin referencia al PACI',ELIMINA_OA:'Eliminación de aprendizajes',EPA_ADEC_OA:'Parvularia: ajustes a OA',HAB_SIN_DECLARAR:'Habilidades de Historia sin declarar',HAB_NO_COINCIDE:'Habilidades que no coinciden con las bases',HAB_PARCIAL:'Habilidades con redacción distinta',HAB_LETRA:'Letra de habilidad equivocada',HAB_GENERICA:'Habilidades declaradas de forma genérica',OA_INEXISTENTE:'OA que no existen en las bases',OA_SIN_TEXTO:'OA declarados solo con número',OA_SIN_CLASE:'OA declarados que ninguna clase cita',OA_NO_DECLARADO:'OA citados en clases sin declarar',ASIGNATURA_VACIA:'Encabezado sin asignatura',ANUAL_FORMATO:'Anual fuera del formato del colegio',ES_EJEMPLO:'Documento marcado como ejemplo',ASIG_DISTINTA:'Asignatura distinta a la elegida',NIVEL_VACIO:'Nivel educativo vacío',NIVEL_DISTINTO:'Nivel distinto al elegido',DOCENTE_VACIO:'Sin docentes indicados',SEMANAS_SIN_DATO:'Sin número de semanas',SEMANAS_RARAS:'Semanas fuera de rango',CARGA_SIN_DATO:'Sin carga horaria semanal',UNIDADES_NO_DETECTADAS:'Unidades no detectadas',UNIDAD_SIN_TITULO:'Unidades sin título',UNIDAD_SIN_OA:'Unidades sin OA',UNIDAD_SIN_EVAL:'Unidades sin evaluación',UNIDAD_SIN_FORMATIVA:'Unidades sin evaluación formativa',UNIDAD_SIN_SUMATIVA:'Unidades sin evaluación sumativa',ANUAL_SIN_DIAGNOSTICA:'Anual sin evaluación diagnóstica',UNIDAD_POCO_DETALLE:'Unidades con poco detalle',UNIDAD_CARGADA:'Unidades con carga alta de OA',UNIDAD_SIN_DURACION:'Unidades sin duración',SEMANAS_EXCEDEN:'Unidades suman más semanas que el total',SEMANAS_FALTAN:'Semanas sin asignar',OA_SIN_UNIDAD:'OA declarados que ninguna unidad trabaja',OA_NIVEL_SIN_PLANIFICAR:'OA del nivel que no aparecen en el año',NUCLEOS_NO_MENCIONADOS:'Núcleos de parvularia sin mencionar',SIN_PME_DIM:'PME sin dimensión'};
/* Servicios locales para el sitio web (sin cuenta ni servidor). */
const LS={get(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const SERV={
 db:{collection:n=>({add:async o=>{const a=LS.get('rev_'+n);a.push(o);LS.set('rev_'+n,a)},get:async()=>({docs:LS.get('rev_'+n).map(x=>({data:()=>x}))})})},
 downloads:{save:async({filename,data})=>{const u=URL.createObjectURL(new Blob([data],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})),a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);return{status:'saved'}}}
};
async function use(n){return SERV[n]||null}
const cur=()=>{const c=$('cu').value;return A[$('as').value]&&NIV.includes(c)?c:+c};
function fillAs(){$('as').innerHTML=Object.keys(A).sort().map(a=>`<option>${esc(a)}</option>`).join('');fillCu()}
function fillCu(){const l=[...A[$('as').value]];$('cu').innerHTML=l.map(c=>`<option value="${esc(c)}">${typeof c==='number'?c+'° básico':esc(c)}</option>`).join('')}
$('as').onchange=fillCu;fillAs();
$('fi').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(/\.docx$/i.test(f.name)&&window.mammoth){$('tx').value=(await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()})).value}else if(/\.docx$/i.test(f.name)){alert('No se pudo cargar el lector de Word. Pega el texto en el cuadro.')}else{$('tx').value=await f.text()}}catch(x){alert('No pude leer el archivo. Pega el texto en el cuadro.')}};
function pool(a,c){
 if(a===EP)return D.parvularia.filter(o=>o.nivel===c).map(o=>({k:`OA ${o.oa} (${o.nucleo})`,n:null,t:o.texto,l:o.texto}));
 if(a===PO)return D.pueblos_originarios.filter(o=>o.curso==c&&(o.contexto===null||o.contexto==='sensibilización')).map(o=>({k:`OA ${o.oa} (${o.eje.split(',')[0]})`,n:null,t:o.texto,l:o.texto}));
 return D.basica.filter(o=>o.asignatura===a&&o.curso==c).concat(a===ING?D.ingles_1a4.filter(o=>o.curso==c):[]).map(o=>({k:'OA '+o.oa,n:o.oa,t:o.texto+' '+(o.items||[]).join(' '),l:o.texto}));
}
const m=(a,b)=>{const x=tok(a),y=tok(b);if(!x.size||!y.size)return 0;let i=0;y.forEach(w=>x.has(w)&&i++);return Math.min(i/y.size,i/x.size)};
function oaSec(t){
 const a=t.search(/Objetivos?\s+de\s+Aprendizaje\s*(\(basales?\))?\s*:?/i);if(a<0)return null;
 let s=t.slice(a);const e=s.slice(10).search(/Habilidades|Actitudes|Objetivo de Aprendizaje Transversal|Integraci[oó]n de otras/i);
 if(e>=0)s=s.slice(0,e+10);return s.slice(0,1500)}
function segs(t){const X=[...t.matchAll(/\bOA\.?\s*(\d{1,2})\b\s*[:.\-–]?\s*/gi)];return X.map((x,i)=>{const s=x.index+x[0].length,e=i+1<X.length?X[i+1].index:Math.min(t.length,s+700);let g=t.slice(s,e);const c=g.search(/Habilidades|Actitudes|Objetivo de Aprendizaje Transversal|Integraci[oó]n de otras|\n\s*\n/i);if(c>20)g=g.slice(0,c);return{n:+x[1],t:g.replace(/^[\s;,.:–-]+|(\s+y)?[\s;,.]+$/g,'').trim().slice(0,700)}})}
function checkOA(t,P,o){
 const S=segs(oaSec(t)||t),seen=new Set(),dec=[];
 if(!S.length){o.push(['obs','OA_SIN_DECLARAR','No encontré OA numerados con el formato “OA 3”. Revisa que el documento los declare.']);return}
 S.forEach(s=>{if(seen.has(s.n))return;seen.add(s.n);dec.push(s.n);
  if(s.t.length<25){const l=P.find(x=>x.n===s.n);
   if(l)o.push(['ok','OA_OK',`OA ${s.n} existe en las bases: “${l.l.slice(0,110)}…”`]);
   else if(P.some(x=>x.n!==null))o.push(['error','OA_INEXISTENTE',`OA ${s.n} no existe en ${$('as').value} (${$('cu').selectedOptions[0].text}).`]);
   else o.push(['obs','OA_SIN_TEXTO',`OA ${s.n}: declarado solo con número; escribe su redacción para poder verificarlo.`]);return}
  let C=P.filter(x=>x.n===s.n);if(!C.length)C=P;let b=null;C.forEach(x=>{const q=Math.max(m(s.t,x.t),m(s.t,x.l));if(!b||q>b.q)b={q,x}});
  if(b.q>=.9)o.push(['ok','OA_OK',`OA ${s.n}: coincide con las bases (${b.x.k}).`]);
  else if(b.q>=.55)o.push(['obs','OA_PARCIAL',`OA ${s.n}: la redacción difiere de la oficial (${b.x.k}). Texto oficial: “${b.x.l.slice(0,170)}…”`]);
  else o.push(['error','OA_NO_COINCIDE',`OA ${s.n}: no coincide con ningún OA de ${$('as').value} (${$('cu').selectedOptions[0].text}). Verifica número y redacción.`])});
 const ci=t.search(/Objetivos?\s+de\s+(las\s+)?clases?/i);
 if(ci>=0&&dec.length){const cited=new Set();[...t.slice(ci).matchAll(/OA\.?\s*(\d{1,2}(?:\s*(?:,|y|e)\s*\d{1,2})*)/gi)].forEach(x=>(x[1].match(/\d+/g)||[]).forEach(n=>cited.add(+n)));
  if(cited.size){const a=dec.filter(n=>!cited.has(n)),b=[...cited].filter(n=>!dec.includes(n));
   a.length&&o.push(['obs','OA_SIN_CLASE',`OA declarados que ninguna clase cita: ${a.join(', ')}.`]);
   b.length&&o.push(['error','OA_NO_DECLARADO',`OA citados en las clases pero no declarados: ${b.join(', ')}.`]);
   a.length||b.length||o.push(['ok','OA_CLASES_OK','Todos los OA declarados se trabajan en alguna clase y las clases no citan OA sin declarar.'])}}}
function checkUnidad(t,o){
 /Asignatura\s*:\s*\n?\s*Nivel/i.test(t)&&o.push(['obs','ASIGNATURA_VACIA','El campo Asignatura está vacío en el encabezado.']);
 const R=[['diagn[oó]stic','diagnóstica'],['formativ','formativa'],['sumativ','sumativa']],ms=R.filter(r=>!new RegExp(r[0],'i').test(t)).map(r=>r[1]);
 ms.length?o.push(['error','EVAL_ETAPAS','Falta evaluación '+ms.join(', ')+'.']):o.push(['ok','EVAL_OK','Están las tres etapas de evaluación.']);
 /indicadores?\s+de\s+logro/i.test(t)||o.push(['obs','SIN_INDICADORES','No hay indicadores de logro explícitos; el formato solo trae “criterios”. Revisa su alineación con los OA.']);
 /\bDUA\b/.test(t)||o.push(['error','SIN_DUA','No aparece el apartado de DUA.']);
 /adecuaci[oó]n/i.test(t)||o.push(['error','SIN_ADECUACION','No aparece el apartado de adecuaciones.']);
 /\b(NEE|TEA|TEL|TDL|CEA|TDAH|DEA|FIL|discapacidad|dificultades? (de|del) aprendizaje)\b/i.test(t.replace(/\(\s*Considerar[^)]*\)/i,''))||o.push(['obs','NEE_NO_ESPECIFICADA','Las adecuaciones no indican qué tipo de NEE consideran, así que no se ve a qué necesidad responden.']);
 /objetivos?\s+de\s+(las\s+)?clases?/i.test(t)||o.push(['obs','SIN_OBJ_CLASES','No encontré “Objetivos de las clases”.'])}
let EST='',UNI=[];
function checkAnual(t,o,P,as,c){
 t=t.replace(/\u00a0/g,' ');EST='';
 const g=(a,b)=>{const i=t.search(a);if(i<0)return null;let s=t.slice(i);if(b){const j=s.slice(8).search(b);if(j>=0)s=s.slice(0,j+8)}return s};
 const S={dat:g(/1\.?\s*DATOS\s+INFORMATIVOS/i,/2\.?\s*TIEMPO/i),tie:g(/2\.?\s*TIEMPO/i,/3\.?\s*OBJETIVOS/i),obj:g(/3\.?\s*OBJETIVOS/i,/4\.?\s*OBJETIVOS\s+PME/i),pme:g(/4\.?\s*OBJETIVOS\s+PME/i,/DESARROLLO\s+DE\s+UNIDADES/i),uni:g(/DESARROLLO\s+DE\s+UNIDADES/i)};
 const falta=[['dat','1. Datos informativos'],['tie','2. Tiempo'],['obj','3. Objetivos'],['pme','4. Objetivos PME'],['uni','Desarrollo de unidades']].filter(x=>!S[x[0]]).map(x=>x[1]);
 falta.length&&o.push(['error','ANUAL_FORMATO','El documento no sigue el formato anual del colegio: no encontré '+falta.join(', ')+'. Algunas revisiones no se pudieron hacer.']);
 /\(\s*ejemplo\s*\)/i.test(t)&&o.push(['obs','ES_EJEMPLO','El título dice “(ejemplo)”. Borra esa marca antes de entregar la planificación.']);
 const val=(x,a,b)=>{const i=x.search(a);if(i<0)return null;let s=x.slice(i).replace(a,'');const j=b?s.search(b):-1;if(j>=0)s=s.slice(0,j);return s.replace(/\s+/g,' ').trim()};
 if(S.dat){const A1=val(S.dat,/Asignatura\s*:/i,/Docente/i),Dc=val(S.dat,/Docente\(?s?\)?\s*:/i,/Nivel\s+Educativo/i),Nv=val(S.dat,/Nivel\s+Educativo\s*:/i,null);
  if(!A1)o.push(['obs','ASIGNATURA_VACIA','El campo Asignatura está vacío en los datos informativos.']);
  else if(m(A1,as)<.5&&!norm(as).includes(norm(A1))&&!norm(A1).includes(norm(as)))o.push(['obs','ASIG_DISTINTA',`El documento dice “${A1.slice(0,60)}” y en la herramienta elegiste ${as}. Verifica que sea la asignatura correcta.`]);
  if(!Nv)o.push(['obs','NIVEL_VACIO','El campo Nivel Educativo está vacío.']);
  else if(typeof c==='number'){const OR={primero:1,primer:1,segundo:2,tercero:3,tercer:3,cuarto:4,quinto:5,sexto:6};let nn=null;Object.keys(OR).forEach(k=>{if(norm(Nv).split(' ').includes(k))nn=OR[k]});if(nn===null){const q=Nv.match(/\b([1-6])\s*(?:°|º|ro\b|do\b|er\b|to\b|mo\b|b[aá]sico|a[nñ]o)/i);if(q)nn=+q[1]}
   nn!==null&&nn!==c&&o.push(['error','NIVEL_DISTINTO',`El documento indica ${nn}° y en la herramienta elegiste ${c}°. Los OA se comparan con ${c}°.`])}
  if(!Dc||/nombres del equipo/i.test(Dc))o.push(['obs','DOCENTE_VACIO','No se indican los docentes que elaboran la planificación (aparece el texto de ayuda del formato o está vacío).'])}
 let sem=null;
 if(S.tie){const tt=S.tie.replace(/^\s*2\.?\s*TIEMPO/i,'').replace(/\s+/g,' '),vp=tt.replace(/^.*semanas\s+de\s+trabajo/i,''),nums=[...vp.matchAll(/\b(\d{1,2})\b/g)].map(x=>+x[1]);
  sem=nums.length?nums[nums.length-1]:null;const hr=nums.length>1?nums[0]:null;
  if(sem===null)o.push(['error','SEMANAS_SIN_DATO','No encontré el número de semanas de trabajo.']);
  else if(sem<30||sem>42)o.push(['obs','SEMANAS_RARAS',`Se declaran ${sem} semanas de trabajo, fuera del rango habitual de un año escolar (30 a 42).`]);
  if(hr===null&&/seg[uú]n la malla/i.test(vp))o.push(['obs','CARGA_SIN_DATO','La carga horaria dice “Según la malla curricular”. Escribe las horas semanales para poder revisar la distribución de las unidades.']);
  else if(hr===null&&nums.length<2)o.push(['obs','CARGA_SIN_DATO','No encontré la carga horaria semanal.']);
  EST+=`Semanas de trabajo: ${sem===null?'no indicadas':sem}. Carga horaria semanal: ${hr===null?'no indicada':hr+' horas'}.\n`}
 const ob=S.obj||t,SG=segs(ob),dec=[...new Set(SG.map(x=>x.n))];
 if(as!==PO)checkOA(ob,P,o);
 const body0=S.uni||'',hi=body0.search(/Duraci[oó]n\s*/i),body=hi>=0?body0.slice(hi).replace(/^Duraci[oó]n\s*/i,''):body0,U=[];let last=0;
 [...body.matchAll(/(\d{1,2}(?:[.,]\d)?)\s*semanas?/gi)].forEach(x=>{U.push({txt:body.slice(last,x.index+x[0].length),sem:parseFloat(x[1].replace(',','.'))});last=x.index+x[0].length});
 const rest=body.slice(last).replace(/^\s*\d\s*[-–.:)]?\s*$/gm,'').replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ]/g,'');
 U.forEach((u,i)=>{u.n=i+1;const ps=u.txt.split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(x=>x&&!/^\d\s*[-–.:)]?$/.test(x)&&!/^unidad\s*\d+\s*[:.\-–]?$/i.test(x));
  u.tit=/^OA\b/i.test(ps[0]||'')?'':(ps[0]||'').replace(/^unidad\s*\d+\s*[:.\-–]?\s*/i,'').slice(0,80);u.oa=new Set();
  [...u.txt.matchAll(/OA\.?\s*(\d{1,2}(?:\s*(?:,|y|e|al|-|–)\s*\d{1,2})*)/gi)].forEach(x=>(x[1].match(/\d+/g)||[]).forEach(n=>u.oa.add(+n)));u.l=u.txt.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ]/g,'').length;
  u.lb=`Unidad ${u.n}${u.tit?' ('+u.tit+')':''}`});
 UNI=U;
 if(!U.length){o.push(['error','UNIDADES_NO_DETECTADAS','No pude detectar unidades con su duración en semanas (por ejemplo “4 semanas”). Revisa la tabla “Desarrollo de unidades”.']);}
 else{const n0=o.length,L=f=>U.filter(f).map(u=>u.lb).join('; ');let q;
  (q=L(u=>!u.tit))&&o.push(['obs','UNIDAD_SIN_TITULO','Sin título legible: unidad '+U.filter(u=>!u.tit).map(u=>u.n).join(', ')+'.']);
  (q=L(u=>!u.oa.size))&&o.push(['error','UNIDAD_SIN_OA','Sin OA citados (escríbelos como “OA 3”): '+q+'.']);
  if(P.some(x=>x.n!==null)){U.forEach(u=>{const b=[...u.oa].filter(n=>!P.some(x=>x.n===n));b.length&&o.push(['error','OA_INEXISTENTE',`${u.lb} cita OA que no existen en ${as} (${c}°): ${b.join(', ')}.`])})}
  (q=L(u=>!/evalua|prueba|r[uú]brica|lista de cotejo|control|portafolio|exposici|producto|informe|proyecto|ticket|quiz|autoevaluaci/i.test(u.txt)))&&o.push(['error','UNIDAD_SIN_EVAL','Sin evaluación indicada: '+q+'.']);
  (q=L(u=>!/formativ/i.test(u.txt)))&&o.push(['obs','UNIDAD_SIN_FORMATIVA','No mencionan evaluación formativa: '+q+'.']);
  (q=L(u=>!/sumativ/i.test(u.txt)))&&o.push(['obs','UNIDAD_SIN_SUMATIVA','No mencionan evaluación sumativa: '+q+'.']);
  /diagn[oó]stic/i.test(body)||o.push(['obs','ANUAL_SIN_DIAGNOSTICA','Ninguna unidad menciona evaluación diagnóstica. El decreto 67 no la exige, pero tu pauta considera las tres etapas.']);
  (q=L(u=>u.l<120))&&o.push(['obs','UNIDAD_POCO_DETALLE','Casi sin contenidos, estrategias o evaluación: '+q+'.']);
  (q=U.filter(u=>u.oa.size>=4&&u.oa.size/u.sem>=3).map(u=>`${u.lb}: ${u.oa.size} OA en ${u.sem} semana${u.sem===1?'':'s'}`).join('; '))&&o.push(['obs','UNIDAD_CARGADA','Carga alta de OA para el tiempo asignado: '+q+'.']);
  rest.length>40&&o.push(['obs','UNIDAD_SIN_DURACION','Hay una unidad con contenido pero sin duración en semanas (después de la unidad '+U.length+').']);
  const sum=U.reduce((a,u)=>a+u.sem,0);
  if(sem!==null){if(sum>sem)o.push(['error','SEMANAS_EXCEDEN',`Las unidades suman ${sum} semanas y el total declarado es ${sem}.`]);else if(sum<sem)o.push(['obs','SEMANAS_FALTAN',`Las unidades suman ${sum} semanas de ${sem}: quedan ${sem-sum} sin asignar (¿evaluaciones, recuperación, imprevistos?).`]);else o.push(['ok','SEMANAS_OK',`Las unidades suman ${sem} semanas, igual al total declarado.`])}
  const used=new Set();U.forEach(u=>u.oa.forEach(n=>used.add(n)));
  if(dec.length){const a=dec.filter(n=>!used.has(n)),b=[...used].filter(n=>!dec.includes(n));
   a.length&&o.push(['obs','OA_SIN_UNIDAD','OA declarados en “3. Objetivos” que ninguna unidad trabaja: '+a.join(', ')+'.']);
   b.length&&o.push(['error','OA_NO_DECLARADO','OA citados en las unidades pero no declarados en “3. Objetivos”: '+b.join(', ')+'.'])}
  if(P.some(x=>x.n!==null)){const all=new Set([...dec,...used]),miss=P.filter(x=>!all.has(x.n)).map(x=>x.n).sort((x,y)=>x-y);
   miss.length?o.push(['obs','OA_NIVEL_SIN_PLANIFICAR',`OA de ${as} (${c}°) que no aparecen en el año: ${miss.join(', ')} (${P.length-miss.length} de ${P.length} cubiertos). Si es intencional, déjalo explicado.`]):o.push(['ok','OA_NIVEL_CUBIERTO',`Todos los OA del nivel (${P.length}) aparecen en el año.`])}
  if(as===EP){const N=[...new Set(P.map(x=>(x.k.match(/\(([^)]+)\)/)||[])[1]).filter(Boolean))],ms=N.filter(n=>!norm(t).includes(norm(n)));ms.length&&o.push(['obs','NUCLEOS_NO_MENCIONADOS','Núcleos que no se nombran en la planificación: '+ms.join(', ')+'.'])}
  o.length===n0&&o.push(['ok','UNIDADES_OK',`${U.length} unidades con título, OA, evaluación y duración.`]);
  EST+='Unidades detectadas:\n'+U.map(u=>`${u.n}) ${u.tit||'(sin título)'} | OA: ${[...u.oa].join(', ')||'ninguno'} | ${u.sem} semanas | evaluación: ${['diagnóstica','formativa','sumativa'].filter(k=>new RegExp(k.slice(0,6),'i').test(u.txt)).join(', ')||'no se menciona'}`).join('\n')+'\n';
  EST+=`OA declarados en “3. Objetivos”: ${dec.join(', ')||'ninguno'}.\n`}
 const Pm=(S.pme||'').replace(/\s+/g,' '),oi=Pm.search(/\bOBJETIVO\b/i),dimOk=/Pedag[oó]gic|Liderazgo|Convivencia|Gesti[oó]n/i.test(Pm),objOk=oi>=0&&Pm.slice(oi+8).trim().length>40;
 if(S.pme){!dimOk&&o.push(['error','SIN_PME_DIM','El apartado del PME no indica la dimensión.']);!objOk&&o.push(['error','SIN_PME','El apartado del PME no indica el objetivo.']);dimOk&&objOk&&o.push(['ok','PME_OK','Declara dimensión y objetivo del PME.'])}
 else/PME/i.test(t)?o.push(['ok','PME_OK','Menciona el PME.']):o.push(['error','SIN_PME','No aparece el vínculo con el PME.'])}
function checkTaller(t,o){
 const hm=t.match(/horario\s*:?\s*\**\s*(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado)/i)||t.match(/lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado/i),day=((hm&&(hm[1]||hm[0]))||'').toLowerCase().replace('é','e').replace('á','a'),DN={lunes:1,martes:2,miercoles:3,jueves:4,viernes:5,sabado:6},yr=+((t.match(/\b(20\d\d)\b/)||[0,new Date().getFullYear()])[1]),ds=[...t.matchAll(/(?:^|\|)\s*\**\s*(\d{1,2})\s*\**\s*\**\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?(?!\d)/gm)].filter(x=>+x[3]>=1&&+x[3]<=12&&+x[2]>=1&&+x[2]<=31).map(x=>{const r=[x[2]+'/'+x[3],x[2],x[3],x[4]||yr];r.index=x.index;r.num=+x[1];return r});
 if(!ds.length){o.push(['obs','TALLER_SIN_FECHAS','No encontré fechas de sesión con formato dd/mm.']);return}
 const bad=[],nums=[];ds.forEach(x=>{const d=new Date(+x[3],+x[2]-1,+x[1]);if(day&&d.getDay()!==DN[day])bad.push(x[0]);nums.push(x.num)});
 const n0=o.length;
 bad.length&&o.push(['error','TALLER_FECHA_DIA',`Fechas que no caen en ${day}: ${bad.join(', ')}.`]);
 const dup=[...new Set(nums.filter((n,i)=>nums.indexOf(n)!==i))];dup.length&&o.push(['error','TALLER_NUM_DUP',`Número de sesión repetido: ${dup.join(', ')}.`]);
 const h=t.match(/(\d{1,2})[:.](\d{2})\s*(?:a|-|–|hasta)\s*(\d{1,2})[:.](\d{2})/);
 if(h){const dur=(+h[3]*60+ +h[4])-(+h[1]*60+ +h[2]),ix=ds.map(x=>x.index).concat([t.length]),ov=[];
  ds.forEach((x,i)=>{let s=0;[...t.slice(ix[i],ix[i+1]).matchAll(/(\d{1,3})\s*(?:min|minutos)\b/gi)].forEach(y=>s+=+y[1]);if(s>dur)ov.push(`${x[0]} (${s} min)`)});
  ov.length&&o.push(['error','TALLER_TIEMPO',`Sesiones que superan los ${dur} min del horario: ${ov.join(', ')}.`])}
 o.length===n0&&o.push(['ok','TALLER_OK','Fechas, numeración y tiempos sin inconsistencias detectables.'])}
function checkEjes(t,c,o){const T=tok(t),ms=[];[['Lengua, tradición oral','Lengua'],['Territorio','Territorio'],['Cosmovisión','Cosmovisión'],['Patrimonio','Patrimonio']].forEach(([k,n])=>{let b=0;D.pueblos_originarios.filter(x=>x.curso==c&&x.eje.startsWith(k)&&(x.contexto===null||x.contexto==='sensibilización')).forEach(x=>{const y=tok(x.texto);let i=0;y.forEach(w=>T.has(w)&&i++);b=Math.max(b,i/(y.size||1))});if(b<.3&&!(n!=='Lengua'&&norm(t).includes(norm(n))))ms.push(n)});ms.length?o.push(['error','EJES_NO_CUBIERTOS','No se aprecia trabajo de los ejes: '+ms.join(', ')+'. Las bases piden trabajarlos de forma integrada.']):o.push(['ok','EJES_OK','Se aprecian los cuatro ejes.'])}
function checkDec(t,o,ep){
 const P=[['presentaci[oó]n|representaci[oó]n','presentación de la información'],['expresi[oó]n|ejecuci[oó]n','expresión'],['participaci[oó]n|compromiso|motivaci[oó]n|activaci[oó]n','participación y compromiso']];
 if(/\bDUA\b/.test(t)){const f=P.filter(p=>!new RegExp(p[0],'i').test(t)).map(p=>p[1]);f.length&&o.push(['obs','DUA_INCOMPLETO','El DUA no menciona el principio de: '+f.join(', ')+' (decreto 83: múltiples medios de presentación, de expresión y de participación).'])}
 /retroaliment/i.test(t)||o.push(['obs','SIN_RETROALIMENTACION','No se menciona retroalimentación de las evaluaciones (decreto 67).']);
 /\bPACI\b|plan de adecuaci/i.test(t)||o.push(['obs','SIN_PACI','No se menciona el PACI: las adecuaciones individuales deben registrarse en un Plan de Adecuaciones Curriculares Individualizado (decreto 83).']);
 /eliminaci[oó]n|eliminar/i.test(t)&&o.push(['obs','ELIMINA_OA','Se menciona eliminar aprendizajes: el decreto 83 lo permite solo en última instancia y sin afectar los aprendizajes básicos imprescindibles.']);
 ep&&/graduaci[oó]n|priorizaci[oó]n|temporalizaci[oó]n|enriquecimiento|eliminaci[oó]n/i.test(t)&&o.push(['obs','EPA_ADEC_OA','En Educación Parvularia el decreto 83 prefiere adecuaciones de acceso y no ajustes a los OA.'])}
function checkHab(t,c,o){
 const H=(D.hab_historia||[]).filter(x=>x.curso==c);if(!H.length)return;
 const i=t.search(/habilidades?\s*:?/i);
 if(i<0){o.push(['obs','HAB_SIN_DECLARAR','No encontré habilidades declaradas.']);return}
 let s=t.slice(i).replace(/^habilidades?\s*:?/i,''),e=s.search(/Actitudes|Objetivo de Aprendizaje Transversal|Contenidos?\s*:|Integraci[oó]n de otras|Conocimientos? previos?/i);
 if(e>0)s=s.slice(0,e);s=s.slice(0,1200);
 const P=s.split(/\n+|•|;|\.\s+(?=[A-ZÁÉÍÓÚ])/).map(x=>x.trim()).filter(x=>x.length>12);
 if(!P.length){o.push(['obs','HAB_SIN_DECLARAR','La sección de habilidades no tiene texto legible.']);return}
 P.forEach(p=>{const L=(p.match(/^\(?([a-n])[).:\-–]\s/)||[])[1],x=p.replace(/^\(?[a-n][).:\-–]\s/,'');
  if(H.some(h=>norm(x)===norm(h.grupo))){o.push(['ok','HAB_OK','Grupo de habilidades declarado: '+x+'.']);return}
  let b=null;H.forEach(h=>{const q=m(x,h.texto);if(!b||q>b.q)b={q,h}});
  const z=H[H.length-1].habilidad;
  if(b.q>=.9){o.push(['ok','HAB_OK',`Habilidad ${b.h.habilidad}) coincide con las bases.`]);if(L&&L!==b.h.habilidad)o.push(['error','HAB_LETRA',`La letra “${L}” no corresponde: ese texto es la habilidad ${b.h.habilidad}) de ${c}° básico.`])}
  else if(b.q>=.5)o.push(['obs','HAB_PARCIAL',`Habilidad ${b.h.habilidad}): la redacción difiere de la oficial: “${b.h.texto.slice(0,140)}…”`]);
  else if(x.split(/\s+/).length<=12)o.push(['obs','HAB_GENERICA',`“${x}”: habilidad genérica; las bases de ${c}° básico las redactan por curso (letras a–${z}).${b.q>=.3?` Posible equivalente: ${b.h.habilidad}) “${b.h.texto.slice(0,120)}…”`:''}`]);
  else o.push(['error','HAB_NO_COINCIDE',`“${x.slice(0,70)}…” no coincide con ninguna habilidad de las bases de ${c}° básico.`])})}
const PAUTA={unidad:'1) Los OA declarados coinciden con las bases. 2) Los objetivos de clase siguen una progresión coherente que lleva al logro de los OA (señala OA declarados que ninguna clase trabaja y OA trabajados que no se declaran). 3) La evaluación tiene diagnóstica, formativa y sumativa, con instrumentos pertinentes que recogen evidencia (decreto 67). 4) Los indicadores o criterios se alinean con los OA. 5) El apartado final de DUA, adecuaciones de acceso y curriculares es coherente con las necesidades del grupo y el decreto 83.',anual:'1) Los OA declarados corresponden a las bases y no faltan OA relevantes del nivel. 2) La distribución de OA por unidad y las semanas asignadas son coherentes con la carga horaria, y la secuencia de unidades muestra progresión. 3) Los contenidos y las estrategias de cada unidad permiten lograr los OA que se le asignan. 4) La evaluación de cada unidad tiene etapas diagnóstica, formativa y sumativa con instrumentos pertinentes (decreto 67: retroalimentación y actividades diversificadas). 5) Objetivo y dimensión del PME presentes y conectados con las unidades. 6) Las estrategias consideran la diversidad de los estudiantes (DUA, decreto 83). El formato anual del colegio no tiene apartado de DUA ni de indicadores de logro: no lo señales como falta, esos se revisan en las planificaciones de unidad.',taller:'1) Cada sesión tiene un objetivo claro. 2) Secuencia de inicio, desarrollo y cierre coherente con el tiempo. 3) Progresión entre sesiones. 4) Estrategias diversificadas. 5) Adecuación individual con códigos de estudiantes (nunca nombres), indicando la habilidad descendida y una estrategia pertinente.'};
let ctl=null;
function fmt(t){return esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/^#+\s*(.+)$/gm,'<h3>$1</h3>')}
$('st').onclick=()=>ctl&&ctl.abort();
let LAST=null;
const xe=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function wp(t,o={}){return `<w:p><w:pPr><w:spacing w:after="${o.h?120:80}" w:before="${o.h?240:0}"/>${o.i?'<w:ind w:left="360" w:hanging="260"/>':''}</w:pPr><w:r><w:rPr>${o.b?'<w:b/>':''}${o.c?'<w:color w:val="'+o.c+'"/>':''}<w:sz w:val="${o.s||22}"/></w:rPr><w:t xml:space="preserve">${xe(t)}</w:t></w:r></w:p>`}
async function descargar(){
 const m=$('dm');if(!LAST)return;const dw=await use('downloads');if(!dw){m.textContent='La descarga no está disponible en esta vista.';return}
 const L=LAST,TP={unidad:'Planificación de unidad',anual:'Planificación anual',taller:'Taller de reforzamiento'},fe=new Date().toLocaleDateString('es-CL',{day:'numeric',month:'long',year:'numeric'});
 let b=wp('Informe de revisión de planificación',{b:1,s:36,h:1})+wp(`${TP[L.tp]} · ${L.as} · ${L.cu}`,{s:22})+wp(`Fecha de revisión: ${fe}`,{s:20,c:'5B6A72'});
 [['error','Errores comprobables','A42E2E'],['obs','Observaciones','A85A0B'],['ok','Cumple','1D7448']].forEach(([k,ti,co])=>{const a=L.o.filter(x=>x[0]===k);b+=wp(ti,{b:1,s:26,h:1,c:co});b+=a.length?a.map(x=>wp('• '+x[2],{i:1})).join(''):wp('Sin hallazgos.',{c:'5B6A72'})});
 b+=wp('Revisión pedagógica',{b:1,s:26,h:1});
 [...$('ai').childNodes].forEach(n=>{if(n.nodeType===1&&/^H/.test(n.tagName))b+=wp(n.textContent,{b:1,s:24,h:1});else String(n.textContent).split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach(x=>{b+=wp(x)})});
 b+=wp('Informe de apoyo generado automáticamente. Las decisiones sobre la planificación corresponden a la docente y a UTP.',{s:18,c:'5B6A72',h:1});
 const z=new JSZip();
 z.file('[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
 z.file('_rels/.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
 z.file('word/document.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+b+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>');
 try{const d=await z.generateAsync({type:'uint8array'});await dw.save({filename:`Revision_${L.tp}_${L.as.split(' ')[0]}_${String(L.cu).replace(/[^\wÁ-ú]+/g,'_')}.docx`,data:d});m.textContent='Informe guardado.'}catch(e){m.textContent=e&&e.code==='declined'?'Descarga cancelada.':'No se pudo guardar el informe.'}}
$('go').onclick=async()=>{
 const t=$('tx').value.trim();if(t.length<80){alert('Carga o pega la planificación completa.');return}
 const tp=$('tp').value,as=$('as').value,c=cur(),P=pool(as,c),o=[];
 if(/\b\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]\b/.test(t))o.push(['error','DATOS_PERSONALES','El texto contiene algo parecido a un RUT. Quita datos personales antes de compartir.']);
 if(tp==='unidad'&&as!==PO)checkOA(t,P,o);
 tp==='anual'?checkAnual(t,o,P,as,c):({unidad:checkUnidad,taller:checkTaller})[tp](t,o);
 if(as===PO&&tp!=='taller')checkEjes(t,c,o);
 if(tp==='unidad')checkDec(t,o,as===EP);
 if(tp==='unidad'&&as.startsWith('Historia'))checkHab(t,c,o);
 const G=k=>o.filter(x=>x[0]===k).map(x=>`<div class="f ${k}">${esc(x[2])}</div>`).join('')||'<p class="e">Sin hallazgos.</p>';
 $('out').innerHTML=`<h2>Errores comprobables</h2>${G('error')}<h2>Observaciones</h2>${G('obs')}<h2>Cumple</h2>${G('ok')}<h2>Revisión pedagógica</h2><div class="ai" id="ai"><span class="e">Pensando…</span></div><div class="row"><button id="dl" class="s">Descargar informe en Word</button><span class="n" id="dm"></span></div>`;
 LAST={tp,as,cu:$('cu').selectedOptions[0].text,o};$('dl').onclick=descargar;
 const db=await use('db');if(db){try{await db.collection('revisiones').add({f:Date.now(),tipo:tp,asig:as,curso:String(c),cod:[...new Set(o.filter(x=>x[0]!=='ok').map(x=>x[1]))]})}catch(e){}}
 const S=await use('sample'),ai=$('ai');if(!S){ai.innerHTML=revPed(t,tp,as,c,P,tp==='anual'?UNI:null);return}
 const hab=(D.hab_historia||[]).filter(x=>x.curso==c&&as.startsWith('Historia')).map(x=>x.habilidad+') '+x.texto).join(' | '),act=D.actitudes.filter(x=>x.asignatura===as).map(x=>'- '+x.texto).join('\n'),ref=P.map(x=>`${x.k}: ${x.l}`).join('\n').slice(0,9000);
 const pr=`Eres un asesor técnico-pedagógico de un colegio chileno. Revisa una planificación de tipo “${tp}” de ${as}, ${$('cu').selectedOptions[0].text}.\n\nPAUTA DE REVISIÓN:\n${PAUTA[tp]}${as===PO?' Enfoque de esta asignatura: proceso formativo; verifica que los cuatro ejes (Lengua, Territorio, Cosmovisión, Patrimonio) se trabajen de forma integrada, que la interculturalidad sea transversal y que la evaluación tenga sentido formativo.':''}\n\nREFERENCIA OFICIAL (OA de las bases curriculares vigentes para este nivel; no inventes OA que no estén aquí):\n${ref}\n\n${hab?'Habilidades del nivel (Historia): '+hab+'\n\n':''}Actitudes de la asignatura:\n${act||'(no aplica)'}\n\nHALLAZGOS AUTOMÁTICOS YA DETECTADOS (no los repitas, complétalos):\n${o.filter(x=>x[0]!=='ok').map(x=>'- '+x[2]).join('\n')||'(ninguno)'}\n\n${tp==='anual'&&EST?'ESTRUCTURA DETECTADA EN LA PLANIFICACIÓN ANUAL:\n'+EST+'\n':''}PLANIFICACIÓN:\n${t.slice(0,14000)}\n\nFORMATO: responde en español con cuatro secciones con estos títulos: “Lo que cumple”, “Errores comprobables”, “Observaciones pedagógicas” y “Sugerencias concretas”. Distingue lo comprobable contra la referencia de lo que es criterio profesional. Cita el OA o el texto de la planificación al que se refiere cada punto. Decretos: D.83 — el DUA tiene tres principios (múltiples medios de presentación, de ejecución y expresión, y de participación y compromiso); las adecuaciones de acceso (presentación de la información, formas de respuesta, entorno, organización del tiempo) se consideran primero y deben ser congruentes con la evaluación; las adecuaciones a los OA son graduación de complejidad, priorización, temporalización, enriquecimiento y, solo en última instancia, eliminación, sin afectar los aprendizajes básicos imprescindibles; las adecuaciones individuales se registran en un PACI a partir de la evaluación diagnóstica individual; en Educación Parvularia se prefieren las adecuaciones de acceso. D.67 — la evaluación formativa se integra a la enseñanza para monitorear y acompañar, y su evidencia la usan docentes y estudiantes para decidir los siguientes pasos; la sumativa certifica logros; no se puede eximir de asignaturas y deben diversificarse las actividades y la evaluación; los criterios se comunican a los estudiantes y las actividades evaluativas, incluidas las tareas, se retroalimentan. El decreto 67 no exige una evaluación diagnóstica: esa etapa es una práctica del colegio. No cites otros artículos ni la ley 20.845. Si aparecen nombres de estudiantes, adviértelo y no los repitas. Sé breve y concreto.`;
 ctl=new AbortController();$('st').hidden=false;$('go').disabled=true;
 try{await S(pr,{signal:ctl.signal,onText:({text})=>{ai.innerHTML=fmt(text)}})}catch(e){if(e&&e.code==='not_granted')ai.innerHTML='<span class="e">Necesito tu autorización para generar la revisión pedagógica. Vuelve a pulsar Revisar.</span>';else if(e&&e.code==='rate_limited')ai.innerHTML+='<p class="e">Demasiadas solicitudes seguidas. Espera un momento.</p>';else if(!(e&&e.code==='aborted'))ai.innerHTML+='<p class="e">No se pudo completar la revisión pedagógica.</p>'}
 $('st').hidden=true;$('go').disabled=false};
$('rs').onclick=async()=>{
 const db=await use('db'),r=$('out');if(!db){r.innerHTML='<p class="e">El historial no está disponible en este navegador.</p>';return}
 try{const s=await db.collection('revisiones').get(),R=s.docs.map(d=>d.data()),C={},B={};
  R.forEach(x=>{B[x.asig]=(B[x.asig]||0)+1;(x.cod||[]).forEach(k=>C[k]=(C[k]||0)+1)});
  const T=O=>Object.entries(O).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<tr><td>${esc(LAB[k]||k)}</td><td>${v}</td></tr>`).join('')||'<tr><td class="e">Sin datos todavía.</td><td></td></tr>';
  r.innerHTML=`<h2>Resumen UTP: ${R.length} revisiones</h2><h2>Nudos críticos más repetidos</h2><table>${T(C)}</table><h2>Revisiones por asignatura</h2><table>${T(B)}</table>`}
 catch(e){r.innerHTML='<p class="e">No pude leer el historial.</p>'}};
