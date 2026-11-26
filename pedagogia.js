/* Revisión pedagógica por reglas (sin IA) — motor v2.
   Principios: 1) cada hallazgo indica su fundamento (bases, decreto o taxonomía);
   2) "Comprobable" = constatación literal del texto; "Indicio" = inferencia que la docente debe confirmar;
   3) ante evidencia insuficiente el motor se abstiene en vez de marcar un error.
   Comparte ámbito global con app.js (usa norm, segs, oaSec, esc, EP, PO). */
const PV=(()=>{
 const F={d67:'Decreto 67/2018 (evaluación), aplica a básica y media',d83:'Decreto 83/2015 (diversificación de la enseñanza y adecuaciones)',bc:'Bases Curriculares 1° a 6° básico (D. 433 y 439/2012)',bcep:'Bases Curriculares de Educación Parvularia (D. 481/2018)',ak:'Taxonomía revisada de Bloom (Anderson y Krathwohl, 2001)'};
 const NV={1:'recordar',2:'comprender',3:'aplicar',4:'analizar',5:'evaluar',6:'crear'};
 /* Léxico de verbos: [infinitivo normalizado, nivel mínimo, nivel máximo, formas irregulares].
    Los verbos de frontera tienen rango: al OA se le asigna el mínimo y a las actividades el máximo,
    para que una diferencia solo se marque cuando es clara. Verbos ambiguos (leer, participar, realizar,
    trabajar, expresar, conocer) se excluyen a propósito. */
 const LX=[['reconocer',1,1,'reconoce reconocen reconozca reconozcan reconociendo'],['identificar',1,1],['nombrar',1,1],['enumerar',1,1],['recordar',1,1,'recuerda recuerdan recuerde recuerden'],['localizar',1,1],['ubicar',1,1],['senalar',1,1],['mencionar',1,1],['listar',1,1],['rotular',1,1],['memorizar',1,1],['repetir',1,1,'repite repiten repita repitan repitiendo'],['copiar',1,1],['transcribir',1,1],['colorear',1,1],
  ['observar',1,3],['registrar',1,3],['recolectar',1,3],['buscar',1,3],['completar',1,3],['reproducir',1,3,'reproduce reproducen reproduzca reproduzcan'],['seleccionar',1,4],['ordenar',1,4],
  ['describir',2,2],['explicar',2,2],['resumir',2,2],['parafrasear',2,2],['ejemplificar',2,2],['interpretar',2,2],['comprender',2,2],['caracterizar',2,4],['sintetizar',2,5],
  ['comunicar',2,3],['narrar',2,3],['predecir',2,3,'predice predicen prediga predigan prediciendo'],['representar',2,3],['estimar',2,3],['explorar',2,3],['demostrar',2,3,'demuestra demuestran demuestre demuestren'],['dibujar',2,6],['opinar',2,5],
  ['comparar',2,4],['contrastar',2,4],['clasificar',2,4],['categorizar',2,4],['inferir',2,4,'infiere infieren infiera infieran infiriendo'],['relacionar',2,4],['distinguir',2,4,'distinga distingan'],['diferenciar',2,4],['organizar',2,4],['secuenciar',2,4],['deducir',2,4,'deduce deducen deduzca deduzcan'],['formular',2,6],
  ['aplicar',3,3],['usar',3,3],['utilizar',3,3],['ejecutar',3,3],['calcular',3,3],['practicar',3,3],['medir',3,3,'mide miden mida midan midiendo'],['resolver',3,4,'resuelve resuelven resuelva resuelvan'],['determinar',3,4],['experimentar',3,4],['investigar',3,5],['construir',3,6,'construye construyen construya construyan construyendo'],['elaborar',3,6],['escribir',3,6],['debatir',3,5],['probar',3,5,'prueba prueban pruebe prueben'],['improvisar',3,6],['autoevaluar',3,5,'autoevalua autoevaluan'],['coevaluar',3,5,'coevalua coevaluan'],
  ['analizar',4,4],['examinar',4,4],['descomponer',4,4,'descompone descomponen descomponga'],['justificar',4,5],['comprobar',4,5,'comprueba comprueban compruebe comprueben'],['verificar',4,5],
  ['evaluar',5,5,'evalua evaluan evalue evaluen'],['argumentar',5,5],['fundamentar',5,5],['criticar',5,5],['juzgar',5,5],['defender',5,5,'defiende defienden defienda defiendan'],
  ['planificar',5,6],['proponer',5,6,'propone proponen proponga propongan'],['crear',6,6],['disenar',6,6],['producir',6,6,'produce producen produzca produzcan'],['componer',6,6,'compone componen componga compongan'],['inventar',6,6],['generar',6,6]];
 const FORM=new Map(),INF=new Map();
 const sub=(s,e)=>/^e/.test(e)?(s.endsWith('z')?s.slice(0,-1)+'c':s.endsWith('c')?s.slice(0,-1)+'qu':s.endsWith('g')?s+'u':s)+e:s+e;
 LX.forEach(([v,lo,hi,irr])=>{const r={v,lo,hi};INF.set(v,r);const add=f=>FORM.set(f,r);add(v);const s=v.slice(0,-2),t=v.slice(-2);
  if(t==='ar')['a','an','ando','amos','aron','e','en'].forEach(e=>add(sub(s,e)));
  else{['e','en','iendo','imos','ieron','a','an'].forEach(e=>add(s+e))}
  (irr||'').split(' ').filter(Boolean).forEach(add)});
 /* Homógrafos que suelen ser sustantivos o verbos ajenos (lista de cotejo, prueba, práctica, cree). */
 'lista listas prueba pruebas practica practicas copia copias marca registro cree creen ordenes'.split(' ').forEach(w=>FORM.delete(w));
 /* Se descartan las acciones del docente al evaluar ("el docente evalúa", "se evalúa"). */
 const dv=v=>({disenar:'diseñar',senalar:'señalar'})[v]||v;
 const verbos=tx=>norm(tx).replace(/\b(se|docente|profesora?|educadora?)( \w+)? (evalua|evaluan|retroalimenta|observa|registra)\b/g,' ').split(' ').map(w=>FORM.get(w)).filter(Boolean);
 /* Nivel del OA: el mayor nivel mínimo entre los infinitivos de sus primeras 15 palabras. */
 function nivelOA(l){const w=norm(l).split(' ').slice(0,15);if(/^demostrar (que )?(comprend|entend)/.test(w.join(' ')))return{lo:2,v:'demostrar que comprenden'};
  let b=null;w.forEach(x=>{const r=INF.get(x);if(r&&(!b||r.lo>b.lo))b={lo:r.lo,v:x}});return b}
 /* Texto de actividades: sin OA copiados, habilidades, actitudes ni OAT (declarar no es hacer). */
 function actividades(t,P){let x=t;
  [[/Habilidades?\s*:?/i,/Actitudes|Objetivo de Aprendizaje Transversal|Integraci[oó]n de otras|Contenidos?\s*[:(]|Conocimientos? previos?/i],[/Actitudes\s*:?/i,/Objetivo de Aprendizaje Transversal|Integraci[oó]n de otras|Contenidos?\s*[:(]|Conocimientos? previos?/i],[/Objetivos? de Aprendizaje Transversal(es)?\s*:?/i,/Integraci[oó]n de otras|Contenidos?\s*[:(]|Conocimientos? previos?/i],[/Objetivos? de Aprendizaje\s*(\(basales?\))?\s*:/i,/Habilidades|Actitudes|Objetivo de Aprendizaje Transversal|Contenidos?\s*[:(]/i]].forEach(([a,b])=>{const i=x.search(a);if(i<0)return;const r=x.slice(i+8),j=r.search(new RegExp(b.source+'|Objetivos? de (las )?clases?|Actividades|Desarrollo\\s*:|Estrategias|Evaluaci[oó]n\\s*(diagn|formativ|sumativ|para el|:)|\\n\\s*\\n','i')),k=j>=0?j:(r.indexOf('\n')>=0?r.indexOf('\n'):Math.min(r.length,600));x=x.slice(0,i)+'\n'+r.slice(k)});
  const ofi=P.map(p=>tok(p.l));
  return x.split(/\n+|(?<=[.;])\s+/).filter(s=>{const k=tok(s);if(!k.size)return false;if(/^\W*OA\s*\d/i.test(s.trim())&&k.size<6)return false;return!ofi.some(o=>{let i=0;k.forEach(w=>o.has(w)&&i++);return k.size>=5&&i/k.size>=.6})}).join('\n')}
 const STOP=new Set('entre sobre mediante manera partir diferentes distintos distintas otros otras algunos algunas cuando donde desde hasta cada tipos forma formas considerando usando medio traves ejemplo ejemplos ellos como para sean puede pueden sido tener tiene tienen propias propios propio propia simples simple principales principal ademas tambien estos estas otros utilizando incluyendo actividad actividades estudiantes alumnos clase clases objetivo objetivos aprendizaje aprendizajes'.split(' '));
 const raiz=w=>w.slice(0,6);
 const kw=s=>[...new Set(norm(s).split(' ').filter(w=>w.length>=5&&!STOP.has(w)&&!INF.has(w)&&!/(ar|er|ir|arse|erse|irse)$/.test(w)).map(raiz))];
 /* Claves del enunciado del OA; la lista de ejemplos (ítems) cuenta como UNA clave que se cumple con cualquiera de ellos. */
 function claves(p){const k=kw(p.l),it=p.t.slice(p.l.length).trim();return{k,it:it?kw(it):[]}}
 const EVI=[['prueba o control escrito',/\bprueba (escrita|de desarrollo|objetiva|de seleccion)|\bprueba\b(?! de funcionamiento)(?!s de funcionamiento)|\bcontrol (escrito|de lectura)|\bquiz\b|\btickets? de salida|\btest\b|evaluacion escrita|instrumento impreso|evaluacion impresa/],['rúbrica',/\brubricas?\b/],['lista de cotejo o escala de apreciación',/lista de cotejo|escala de apreciacion|pauta de (cotejo|evaluacion|observacion)/],['portafolio',/\bportafolios?\b/],['registro de observación',/registros? anecdotic|observacion directa|registro de observacion|\bbitacora/],['autoevaluación o coevaluación',/autoevalua|coevalua/],['producto o desempeño',/\bafiches?\b|\bmaquetas?\b|disertacion|exposicion|presentacion oral|\binformes?\b|dramatizacion|objeto tecnologico|\bproducto final|\bpresenta(n|cion)? (el|un|su|breve)/]];
 const ESTR=[['trabajo colaborativo',/colaborativ|\ben (grupos?|parejas|equipos?)\b|trabajo (grupal|en equipo)|por equipos|entre pares|\bpares\b/],['indagación o experimentación',/experiment|indaga|investiga|laboratorio/],['aprendizaje basado en proyectos',/\babp\b|aprendizaje basado en proyectos|\bproyectos?\b/],['juego o dramatización',/\bjuegos?\b|ludic|dramatiz/],['recursos digitales',/\btics?\b|computador|digital|plataforma|\bvideos?\b|software|tablet|\bppt\b|powerpoint|audiovisual/],['modelado del docente',/modelad|\bmodela\b|ejemplos? (resueltos?|modelados?)|pienso en voz alta|demostracion del docente/],['conversación o discusión guiada',/lectura (guiada|compartida)|conversaci|\bdebate|discusi|plenario|lluvia de ideas|preguntas (abiertas|orales|guiadas)/],['material concreto o visual',/material concreto|pictograma|organizador grafico|apoyos? visual|imagenes|mapa (conceptual|visual)|agenda visual/],['reflexión sobre lo aprendido',/metacogni|autoevalua|reflexion|que aprendi/]];
 function revisar(t,tp,as,c,P,UN){
  const R=[],add=(k,c,tx,fu)=>R.push({k,c,tx,fu}),ep=as===EP,tn=norm(t);
  const nv={};P.forEach(p=>{if(p.n!==null){const r=nivelOA(p.l);nv[p.n]={r,p}}});
  const B=tp==='anual'&&UN&&UN.length?UN.map(u=>({lb:u.lb,tx:u.txt,oa:[...u.oa]})):[{lb:'La planificación',tx:t,oa:[...new Set(segs(oaSec(t)||t).map(x=>x.n))]}];
  const AT=actividades(t,P),nw=norm(AT).split(' ').length;
  if(nw<80){add('mj','Comprobable',`Después de quitar los OA copiados, habilidades y actitudes quedan ${nw} palabras de actividades y evaluación. Con tan poco texto no se puede revisar la coherencia pedagógica: describe qué harán los estudiantes y cómo se evaluará.`,'Criterio de la herramienta (mínimo 80 palabras)');return R}
  /* 1. Exigencia cognitiva del OA vs actividades (solo OA numerados con verbo clasificable). */
  if(!ep&&as!==PO&&!B.some(b=>b.oa.some(n=>nv[n])))add('mj','Comprobable','No pude relacionar OA numerados (“OA 3”) con las bases; por eso no se revisó la coherencia entre OA y actividades.',F.bc);
  B.forEach(b=>{const at=b===B[0]&&B.length===1?AT:actividades(b.tx,P),V=verbos(at),dist=[...new Set(V.map(v=>v.v))];if(V.length<4||dist.length<3)return;
   const hi=Math.max(...V.map(v=>v.hi));
   b.oa.filter(n=>nv[n]&&nv[n].r).forEach(n=>{const o=nv[n].r;
    if(o.lo>=3&&hi<o.lo)add('mj','Indicio',`${b.lb}, OA ${n}: el OA pide “${dv(o.v)}” (nivel ${o.lo}, ${NV[o.lo]}) y ninguna actividad alcanza ese nivel, ni siquiera en su lectura más favorable (verbos encontrados: ${dist.slice(0,6).map(dv).join(', ')}). Incluye al menos una actividad y un criterio de evaluación de nivel ${o.lo}.`,F.ak+' aplicada al verbo del OA ('+F.bc+')');
    else{const al=V.filter(v=>v.lo>=o.lo);if(o.lo>=2&&al.length)add('ok','Indicio',`${b.lb}, OA ${n}: hay actividades de nivel igual o superior al que pide el OA (“${dv(o.v)}”, ${NV[o.lo]}): ${[...new Set(al.map(v=>dv(v.v)))].slice(0,3).join(', ')}.`,F.ak)}})});
  /* 2. Términos del OA en las actividades (sin contar el OA copiado). */
  B.forEach(b=>{const at=B.length===1?AT:actividades(b.tx,P),aw=norm(at).split(' ');if(aw.length<(B.length>1?40:80))return;const st=new Set(aw.filter(w=>w.length>=5).map(raiz));
   b.oa.filter(n=>nv[n]).forEach(n=>{const{k,it}=claves(nv[n].p),tot=k.length+(it.length?1:0);if(tot<4)return;const f=k.filter(x=>!st.has(x)),hit=k.length-f.length+(it.some(x=>st.has(x))?1:0),cub=hit/tot;
    if(hit===0)add('mj','Indicio',`${b.lb}, OA ${n}: ninguna palabra clave del OA ni de sus ejemplos aparece en las actividades (por ejemplo: ${nv[n].p.l.split(/\s+/).map(w=>w.replace(/[^\wáéíóúñü]/gi,'')).filter(w=>f.includes(raiz(norm(w)))&&w.length>4).slice(0,4).join(', ')}). Confirma que lo planificado enseña este OA; si se trabaja con otras palabras, ignora esta observación.`,F.bc);
    else if(cub>=.5)add('ok','Indicio',`${b.lb}, OA ${n}: las actividades usan términos propios del OA (${Math.round(cub*100)}%).`,F.bc)})});
  /* 3. Evaluación: diversidad de evidencias y retroalimentación. */
  const ev=EVI.filter(x=>x[1].test(tn)).map(x=>x[0]),fuE=ep?F.bcep+': evaluación formativa (en parvularia no rige el decreto 67)':F.d67+', art. 5 y art. 18 letra g';
  if(ev.length>=2)add('ok','Comprobable',`Usa distintos tipos de evidencia: ${ev.join(', ')}.`,fuE);
  else add('mj','Comprobable',ev.length?`Solo se nombra un tipo de evidencia (${ev[0]}). Agrega otro de distinta naturaleza (por ejemplo, rúbrica de un producto, lista de cotejo de observación o autoevaluación).`:'No se nombran instrumentos de evaluación (prueba, rúbrica, lista de cotejo, registro de observación, producto).',fuE);
  const alto=B.some(b=>b.oa.some(n=>nv[n]&&nv[n].r&&nv[n].r.lo>=4));
  if(!ep&&alto&&!/\brubrica|lista de cotejo|escala de apreciacion|pauta de/.test(tn))add('mj','Comprobable','Hay OA de nivel analizar, evaluar o crear, pero no se nombra rúbrica, lista de cotejo ni escala. Con criterios explícitos el estudiante sabe antes cómo será evaluado.',F.d67+', art. 3 (derecho a conocer los criterios)');
  if(tp!=='unidad')/retroaliment/.test(tn)?add('ok','Comprobable','Declara retroalimentación a los estudiantes.',ep?F.bcep:F.d67+', art. 18 letra d'):add('mj','Comprobable','No se menciona retroalimentación: indica cuándo y cómo se devuelve al estudiante lo que logró y lo que falta.',ep?F.bcep:F.d67+', art. 18 letra d');
  /* 4. Estrategias. */
  const es=ESTR.filter(x=>x[1].test(tn)).map(x=>x[0]);
  if(es.length>=3)add('ok','Comprobable',`Estrategias variadas: ${es.join(', ')}.`,F.d83);
  else if(es.length<2)add('mj','Comprobable',`Se reconoce${es.length?' solo una estrategia ('+es[0]+')':'n pocas estrategias'}. Combina al menos tres (por ejemplo: trabajo colaborativo, modelado del docente, material concreto o visual, reflexión al cierre).`,F.d83);
  /* 5. Objetivos de clase (planificación de unidad). */
  if(tp==='unidad'){const i=t.search(/Objetivos?\s+de\s+(las\s+)?clases?/i);
   if(i>=0){let s=t.slice(i).replace(/^Objetivos?\s+de\s+(las\s+)?clases?\s*:?/i,'');const e=s.search(/Recursos de aprendizaje|Evaluaci[oó]n para el aprendizaje|Tipo de evaluaci/i);if(e>0)s=s.slice(0,e);s=s.replace(/\*+/g,' ').replace(/Clase\s+Objetivo y evidencia de aprendizaje/i,' ');
    const O=s.split(/(?:^|\s)(?:Clase\s*)?\d{1,2}(?:\s*(?:,|y|-|–)\s*\d{1,2})*\s*[.):\-–]?\s+(?=[A-ZÁÉÍÓÚÑ¿“"])/).map(x=>x.replace(/\(OA[^)]*\)/g,'').trim()).filter(x=>x.length>12);
    if(O.length>=2){const pv=O.map(x=>{const w=norm(x.replace(/^Evaluaci[oó]n( de)?( la)? unidad\s*:\s*/i,'')).split(' ')[0];return INF.get(w)||(/(ar|er|ir)$/.test(w)&&w.length>4?{lo:0,v:w}:null)});
     const sv=pv.filter(x=>!x).length;
     sv?add('mj','Comprobable',`${sv} de ${O.length} objetivos de clase no empiezan con un verbo en infinitivo; así no se puede comprobar si se lograron.`,'Criterio de la pauta UTP del colegio'):add('ok','Comprobable',`Los ${O.length} objetivos de clase empiezan con un verbo.`,'Criterio de la pauta UTP del colegio');}}}
  return R}
 function render(R){const h=k=>R.filter(x=>x.k===k).map(x=>`<div class="f ${k==='ok'?'ok':'obs'}"><span class="tg${x.c==='Indicio'?' i':''}">${x.c}</span> ${esc(x.tx)}<div class="fu">Fundamento: ${esc(x.fu)}</div></div>`).join('')||'<p class="e">Sin elementos.</p>';
  return`<h3>Lo que está bien</h3>${h('ok')}<h3>Qué fortalecer</h3>${h('mj')}<p class="e">“Comprobable”: se constata en el texto. “Indicio”: inferencia por palabras y verbos que la docente o UTP debe confirmar. Cuando el texto no alcanza para concluir, la herramienta no opina.</p>`}
 return{revisar,render,nivelOA,verbos,actividades,LX}})();
function revPed(t,tp,as,c,P,UN){return PV.render(PV.revisar(t,tp,as,c,P,UN))}
