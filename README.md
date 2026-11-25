# Revisor de planificaciones

Sitio estático (HTML, CSS y JS). No necesita servidor ni base de datos.

## Publicar en GitHub Pages
1. Crea un repositorio y sube estos archivos a la raíz: `index.html`, `styles.css`, `app.js`, `data.js`.
2. En el repositorio: Settings > Pages > Source: "Deploy from a branch" > rama `main`, carpeta `/ (root)`.
3. Espera uno o dos minutos. La dirección será `https://USUARIO.github.io/REPOSITORIO/`.

## Qué incluye
- Comprobaciones de planificaciones de unidad, anuales y talleres contra las bases curriculares (datos en `data.js`).
- Lectura de archivos .docx en el navegador (mammoth) y descarga del informe en Word (JSZip). Ambas librerías se cargan desde cdnjs, por lo que se necesita internet.
- Resumen UTP: guarda solo códigos de hallazgos, en el navegador de cada persona (localStorage). No se comparte entre usuarios.

## Qué no incluye
- La revisión pedagógica con IA (solo existe en la versión de Claude).

## Privacidad
Todo se procesa en el navegador; no se envía ningún texto a servidores. El sitio es público si el repositorio lo es: no subas planificaciones reales ni datos de estudiantes al repositorio.
