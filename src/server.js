import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from './db.js';
import { slugSchema, paisSchema, searchSchema } from './schemas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 4321;

app.use('/imagenes', express.static(path.join(__dirname, '..', 'public', 'imagenes')));

// GET /  -> informacion de la API
app.get('/', (req, res) => {
  res.json({
    nombre: "API Copa Mundial FIFA",
    descripcion: "API REST con informacion de las ediciones de la Copa Mundial de la FIFA",
    version: "1.0.0",
    rutas: {
      "/mundiales": "Lista todas las ediciones del mundial",
      "/mundiales?include=full": "Lista todas las ediciones con todos los campos",
      "/mundial/:slug": "Obtiene una edicion por su slug",
      "/campeon/:pais": "Lista los slugs de las ediciones ganadas por un pais",
      "/random": "Devuelve una edicion al azar",
      "/search/:text": "Busca ediciones por texto (minimo 3 caracteres)",
      "/imagenes/*": "Acceso a las imagenes de las portadas"
    }
  });
});

// GET /mundiales
app.get('/mundiales', (req, res) => {
  const { include } = req.query;

  let mundiales;
  if (include === 'full') {
    mundiales = db.prepare('SELECT * FROM mundiales ORDER BY anio ASC').all();
  } else {
    mundiales = db.prepare(`
      SELECT nombre, anio, sede, campeon, slug, imagen
      FROM mundiales ORDER BY anio ASC
    `).all();
  }

  res.status(200).json(mundiales);
});

// GET /mundial/:slug
app.get('/mundial/:slug', (req, res) => {
  const result = slugSchema.safeParse(req.params.slug);

  if (!result.success) {
    return res.status(400).json({
      error: 'Bad Request',
      detalle: result.error.issues[0].message
    });
  }

  const mundial = db.prepare('SELECT * FROM mundiales WHERE slug = ?').get(result.data);

  if (!mundial) {
    return res.status(404).json({
      error: 'Not Found',
      detalle: `No existe un mundial con slug '${result.data}'`
    });
  }

  res.status(200).json(mundial);
});

// GET /campeon/:pais
app.get('/campeon/:pais', (req, res) => {
  const result = paisSchema.safeParse(req.params.pais);

  if (!result.success) {
    return res.status(400).json({
      error: 'Bad Request',
      detalle: result.error.issues[0].message
    });
  }

  const mundiales = db.prepare('SELECT slug FROM mundiales WHERE campeon = ? COLLATE NOCASE')
    .all(result.data);

  if (mundiales.length === 0) {
    return res.status(404).json({
      error: 'Not Found',
      detalle: `'${result.data}' no ha sido campeon en ninguna edicion registrada`
    });
  }

  res.status(200).json(mundiales.map(m => m.slug));
});

// GET /random
app.get('/random', (req, res) => {
  const mundial = db.prepare('SELECT * FROM mundiales ORDER BY RANDOM() LIMIT 1').get();
  res.status(200).json(mundial);
});

// GET /search/:text
app.get('/search/:text', (req, res) => {
  const result = searchSchema.safeParse(req.params.text);

  if (!result.success) {
    return res.status(400).json({
      error: 'Bad Request',
      detalle: result.error.issues[0].message
    });
  }

  const texto = `%${result.data}%`;
  const mundiales = db.prepare(`
    SELECT * FROM mundiales
    WHERE nombre LIKE ? COLLATE NOCASE
       OR sede LIKE ? COLLATE NOCASE
       OR campeon LIKE ? COLLATE NOCASE
       OR subcampeon LIKE ? COLLATE NOCASE
       OR goleador LIKE ? COLLATE NOCASE
       OR resumen LIKE ? COLLATE NOCASE
       OR descripcion LIKE ? COLLATE NOCASE
  `).all(texto, texto, texto, texto, texto, texto, texto);

  if (mundiales.length === 0) {
    return res.status(404).json({
      error: 'Not Found',
      detalle: `No se encontraron resultados para '${result.data}'`
    });
  }

  res.status(200).json(mundiales);
});

// 404 para rutas no definidas
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    detalle: `La ruta '${req.originalUrl}' no existe`
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});