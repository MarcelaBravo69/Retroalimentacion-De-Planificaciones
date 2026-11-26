# Revisor de planificaciones

Sitio estático (HTML, CSS y JS). No necesita servidor ni base de datos.

## Publicar en GitHub Pages
1. Crea un repositorio y sube estos archivos a la raíz: `index.html`, `styles.css`, `app.js`, `pedagogia.js`, `data.js`.
2. En el repositorio: Settings > Pages > Source: "Deploy from a branch" > rama `main`, carpeta `/ (root)`.
3. Espera uno o dos minutos. La dirección será `https://USUARIO.github.io/REPOSITORIO/`.

## Qué incluye
- Comprobaciones de planificaciones de unidad, anuales y talleres contra las bases curriculares (datos en `data.js`).
- Lectura de archivos .docx en el navegador (mammoth) y descarga del informe en Word (JSZip). Ambas librerías se cargan desde cdnjs, por lo que se necesita internet.
- Resumen UTP: guarda solo códigos de hallazgos, en el navegador de cada persona (localStorage). No se comparte entre usuarios.

## Revisión pedagógica automática (sin IA) — motor v2
`pedagogia.js` aplica reglas con fundamento explícito. Cada hallazgo indica:
- **Comprobable**: se constata literalmente en el texto (p. ej., no se nombra instrumento de evaluación).
- **Indicio**: inferencia por verbos o palabras que la docente o UTP debe confirmar.
- **Fundamento**: norma o referencia que lo respalda.

Marco normativo vigente 2026 que usa:
- Bases Curriculares 1° a 6° básico (D. 433 y 439/2012); Parvularia (D. 481/2018); Pueblos Originarios (D. 97/2021). Desde 2026 se gestionan sin Priorización Curricular (terminó en diciembre de 2025). La actualización de bases 1°–6° está en trámite en el CNED y no rige.
- Decreto 67/2018: aplica a básica y media (no a parvularia). Art. 3 (conocer criterios), art. 4 (formativa y sumativa), art. 5 y 18 g (diversificar la evaluación), art. 18 d (retroalimentación). No exige evaluación diagnóstica.
- Decreto 83/2015: diversificación de la enseñanza, DUA y adecuaciones (parvularia y básica). El PACI se exige cuando hay adecuaciones a los objetivos de aprendizaje.
- Exigencia cognitiva: taxonomía revisada de Bloom (Anderson y Krathwohl, 2001). Los verbos de frontera (comparar, clasificar, construir…) tienen un rango; se marca un OA solo si ninguna actividad alcanza su nivel ni en la lectura más favorable.

Reglas para reducir el error:
- Se descartan los OA copiados, habilidades, actitudes y OAT antes de analizar (declarar no es hacer).
- Con menos de 80 palabras de actividades, el motor no opina.
- Verbos ambiguos (leer, participar, realizar) y homógrafos (lista, prueba, práctica) no se cuentan; tampoco las acciones del docente ("el docente evalúa").
- Cobertura del OA: solo se marca si ninguna palabra clave del OA ni de sus ejemplos aparece.
- Coincidencias por palabra completa (antes "TIC" coincidía con "práctica" y "DUA" con "individual").

Pruebas: `pruebas_v2/t7.js` compara el motor anterior y el v2 en 11 casos con resultado esperado definido de antemano (23 comprobaciones): anterior 10/23, v2 23/23. Dos casos son planificaciones reales del colegio; el resto son casos construidos. La calibración definitiva requiere planificaciones ya revisadas por UTP.

## Privacidad
Todo se procesa en el navegador; no se envía ningún texto a servidores. El sitio es público si el repositorio lo es: no subas planificaciones reales ni datos de estudiantes al repositorio.
