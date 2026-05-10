// api/server.js
import express from 'express';
import { MongoClient } from 'mongodb';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto'; 

const port = process.env.PORT;

if (globalThis.crypto === undefined) {
    globalThis.crypto = crypto;
}

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const client = new MongoClient(uri);
let db;

async function startServer() {
  try {
    console.log("intentando conectar a MongoDB...");
    await client.connect();
    db = client.db(dbName); 
    console.log(`✅ Conectado a la base de datos: ${dbName}`);

    app.get('/api/locales', async (req, res) => {
      try {
        const locales = await db.collection('locales').find().toArray();
        res.json(locales);
      } catch (error) {
        res.status(500).json({ error: "Error al obtener locales" });
      }
    });

    app.get('/health', (req, res) => {
      res.status(200).send('OK');
    });

    app.post('/api/locales', upload.single('foto'), async (req, res) => {
      try {
        const nuevoLocal = {
          nombre: req.body.nombre,
          localidad: req.body.localidad,
          fotoUrl: `${process.env.NGINX_URL}/uploads/${req.file.filename}` 
        };
        
        await db.collection('locales').insertOne(nuevoLocal);
        console.log("🏠 Nuevo local guardado:", nuevoLocal.nombre);
        res.status(201).json(nuevoLocal);
      } catch (error) {
        console.error("Error al guardar:", error);
        res.status(500).json({ error: "Error al guardar el local" });
      }
    });

    app.listen(port, () => {
      console.log(`🚀 API lista en http://localhost:${port}`);
    });

  } catch (error) {
    console.error("❌ Error de conexión a MongoDB:", error.message);
    console.log("Reintentando en 5 segundos...");
    setTimeout(startServer, 5000);
  }
}

startServer();