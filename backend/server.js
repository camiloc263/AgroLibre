const express = require('express');
const cors = require('cors');
const path = require('path');

// Importamos las rutas separadas
const rutasPublicas = require('./rutas-publicas');
const rutasAdmin = require('./rutas-admin');

const app = express();
const puerto = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// --- USAR LAS RUTAS ---
// Todo lo que sea API pública entra por aquí
app.use('/api', rutasPublicas);

// Todo lo que sea API de administración entra por aquí
app.use('/api', rutasAdmin); // Comparten el prefijo /api, pero están en archivos distintos

// --- RUTAS DE ARCHIVOS HTML ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend', 'index.html')));
app.get('/detalle.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend', 'detalle.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend', 'admin.html')));

// Encender
app.listen(puerto, () => {
    console.log(`🚀 Servidor ORDENADO corriendo en: http://localhost:${puerto}`);
});