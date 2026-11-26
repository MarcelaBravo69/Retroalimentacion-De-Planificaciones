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

## Revisión pedagógica automática (sin IA)
`pedagogia.js` hace un análisis por reglas: compara los verbos y los términos de cada OA con lo que escribe la planificación (exigencia cognitiva, coherencia de contenidos, progresión entre unidades, variedad de instrumentos y de estrategias, retroalimentación, atención a la diversidad, objetivos de clase e indicadores). Es más limitado que una IA: detecta coincidencias de palabras y no entiende el sentido completo del texto, por eso entrega observaciones para revisar, no veredictos.

## Privacidad
Todo se procesa en el navegador; no se envía ningún texto a servidores. El sitio es público si el repositorio lo es: no subas planificaciones reales ni datos de estudiantes al repositorio.
