const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const puerto = 3000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// 1. CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS
// ---------------------------------------------------------
app.use(express.static(path.join(__dirname, '../frontend')));

// ---------------------------------------------------------
// 2. BASE DE DATOS
// ---------------------------------------------------------
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sasa', // Tu contraseña
    database: 'agrolibre_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err);
        return;
    }
    console.log('✅ ¡Conectado exitosamente a la base de datos MySQL!');
});

// ---------------------------------------------------------
// 3. RUTAS DE PÁGINAS (HTML)
// ---------------------------------------------------------

// Ruta Principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Ruta Detalle
app.get('/detalle.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'detalle.html'));
});

// Ruta de Prueba
app.get('/test-db', (req, res) => {
    db.query('SHOW TABLES', (err, resultados) => {
        if (err) {
            res.status(500).send('Error en la consulta');
        } else {
            res.json({ mensaje: 'Conexión funcionando', tablas: resultados });
        }
    });
});

// ---------------------------------------------------------
// 4. API (DATOS)
// ---------------------------------------------------------

// A. PRODUCTOS (HOME)
app.get('/api/productos', (req, res) => {
    const sql = `
        SELECT 
            p.id, 
            p.titulo, 
            p.precio, 
            u.ubicacion, 
            u.nombre_completo as vendedor,
            MAX(i.url_imagen) as url_imagen 
        FROM publicaciones p
        JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN imagenes_producto i ON p.id = i.publicacion_id
        WHERE p.estado = 'activa'
        GROUP BY p.id
    `;

    db.query(sql, (err, resultados) => {
        if (err) {
            console.error("Error consulta SQL:", err);
            res.status(500).send("Error del servidor");
            return;
        }
        res.json(resultados);
    });
});

// B. PRODUCTO INDIVIDUAL (DETALLE)
app.get('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
            p.id, 
            p.titulo, 
            p.precio, 
            p.descripcion, 
            p.stock_disponible, 
            u.ubicacion, 
            u.nombre_completo as vendedor, 
            u.telefono, 
            u.email, 
            MAX(i.url_imagen) as url_imagen 
        FROM publicaciones p
        JOIN usuarios u ON p.usuario_id = u.id
        LEFT JOIN imagenes_producto i ON p.id = i.publicacion_id
        WHERE p.id = ? 
        GROUP BY p.id
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send("Error en el servidor");
            return;
        }
        if (result.length === 0) {
            res.status(404).send("Producto no encontrado");
            return;
        }
        res.json(result[0]);
    });
});

// C. BANNERS (SLIDER)
app.get('/api/banners', (req, res) => {
    const sql = "SELECT * FROM banners ORDER BY orden ASC";
    db.query(sql, (err, resultados) => {
        if (err) {
            console.error("Error obteniendo banners:", err);
            res.status(500).send("Error del servidor");
            return;
        }
        res.json(resultados);
    });
});

// D. BENEFICIOS (INFO CARDS)
app.get('/api/beneficios', (req, res) => {
    const sql = "SELECT * FROM beneficios ORDER BY orden ASC";
    db.query(sql, (err, resultados) => {
        if (err) {
            console.error("Error obteniendo beneficios:", err);
            res.status(500).send("Error del servidor");
            return;
        }
        res.json(resultados);
    });
});

// --- RUTA API: OBTENER CATEGORÍAS (MENÚ) ---
app.get('/api/categorias', (req, res) => {
    const sql = "SELECT * FROM categorias ORDER BY id ASC";
    
    db.query(sql, (err, resultados) => {
        if (err) {
            console.error("Error obteniendo categorías:", err);
            res.status(500).send("Error del servidor");
            return;
        }
        res.json(resultados);
    });
});

// --- RUTA API: OBTENER CONFIGURACIÓN DEL SITIO (LOGO) ---
app.get('/api/configuracion', (req, res) => {
    const sql = "SELECT * FROM configuracion LIMIT 1";
    
    db.query(sql, (err, results) => {
        // Si hay error en SQL, lo mostramos en la consola pero NO rompemos la página
        if(err) {
            console.error("❌ ERROR BASE DE DATOS (Configuración):", err.message);
            // Enviamos datos de emergencia para que la página cargue
            return res.json({
                nombre_sitio: "MercaAgro",
                logo_svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 13-1.8 16.2"></path><path d="M12 10a7 7 0 0 1 0 10Z"></path></svg>'
            });
        }

        // Si la tabla existe pero está VACÍA
        if (results.length === 0) {
            console.warn("⚠️ La tabla 'configuracion' está vacía.");
            return res.json({
                nombre_sitio: "MercaAgro (Vacio)",
                logo_svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>'
            });
        }

        // Si todo está bien
        res.json(results[0]);
    });
});

// --- RUTA API: OBTENER MENÚ USUARIO ---
app.get('/api/menu-usuario', (req, res) => {
    const sql = "SELECT * FROM menu_usuario ORDER BY orden ASC";
    
    db.query(sql, (err, resultados) => {
        if (err) {
            console.error("Error menú usuario:", err);
            res.status(500).send("Error del servidor");
            return;
        }
        res.json(resultados);
    });
});
// ---------------------------------------------------------
// 5. ENCENDER SERVIDOR
// ---------------------------------------------------------
app.listen(puerto, () => {
    console.log(`🚀 Servidor AgroLibre corriendo en: http://localhost:${puerto}`);
});