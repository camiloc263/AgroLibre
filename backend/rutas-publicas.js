const express = require('express');
const router = express.Router();
const db = require('./db');

// 1. HOME COMPLETO (SECCIONES DINÁMICAS)
router.get('/home-completo', async (req, res) => {
    try {
        // Obtenemos las secciones
        const [secciones] = await db.query("SELECT * FROM secciones_home ORDER BY orden ASC");
        
        // Llenamos cada sección con sus productos
        for (let seccion of secciones) {
            const sqlProductos = `
                SELECT p.id, p.titulo, p.precio, u.ubicacion, u.nombre_completo as vendedor, MAX(i.url_imagen) as url_imagen
                FROM publicaciones p
                JOIN usuarios u ON p.usuario_id = u.id
                LEFT JOIN imagenes_producto i ON p.id = i.publicacion_id
                WHERE p.estado = 'activa' AND p.categoria_id = ?
                GROUP BY p.id LIMIT 6
            `;
            // La consulta devuelve un array [rows, fields], tomamos solo rows [0]
            const [productos] = await db.query(sqlProductos, [seccion.categoria_id]);
            seccion.productos = productos;
        }
        res.json(secciones);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error server");
    }
});

// 2. PRODUCTOS GENERALES
router.get('/productos', async (req, res) => {
    try {
        const sql = `SELECT p.id, p.titulo, p.precio, u.ubicacion, u.nombre_completo as vendedor, MAX(i.url_imagen) as url_imagen 
                     FROM publicaciones p JOIN usuarios u ON p.usuario_id = u.id LEFT JOIN imagenes_producto i ON p.id = i.publicacion_id 
                     WHERE p.estado = 'activa' GROUP BY p.id`;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (error) { res.status(500).send("Error"); }
});

// 3. DETALLE PRODUCTO
router.get('/productos/:id', async (req, res) => {
    try {
        const sql = `SELECT p.*, u.ubicacion, u.nombre_completo as vendedor, u.telefono, MAX(i.url_imagen) as url_imagen 
                     FROM publicaciones p JOIN usuarios u ON p.usuario_id = u.id LEFT JOIN imagenes_producto i ON p.id = i.publicacion_id 
                     WHERE p.id = ? GROUP BY p.id`;
        const [rows] = await db.query(sql, [req.params.id]);
        if (rows.length === 0) return res.status(404).send("No existe");
        res.json(rows[0]);
    } catch (error) { res.status(500).send("Error"); }
});

// 4. TABLAS AUXILIARES
router.get('/banners', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM banners ORDER BY orden ASC");
    res.json(rows);
});

router.get('/beneficios', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM beneficios ORDER BY orden ASC");
    res.json(rows);
});

router.get('/categorias', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM categorias ORDER BY id ASC");
    res.json(rows);
});

router.get('/configuracion', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM configuracion LIMIT 1");
    res.json(rows[0] || {});
});

router.get('/menu-usuario', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM menu_usuario ORDER BY orden ASC");
    res.json(rows);
});

router.get('/promociones', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM promociones ORDER BY orden ASC LIMIT 2");
    res.json(rows);
});

router.get('/footer', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM footer_enlaces ORDER BY orden ASC");
    res.json(rows);
});

// 5. SUSCRIPCIÓN
router.get('/suscripcion', async (req, res) => {
    try {
        const [info] = await db.query("SELECT * FROM info_suscripcion LIMIT 1");
        const [beneficios] = await db.query("SELECT * FROM beneficios_suscripcion ORDER BY orden ASC");
        res.json({ header: info[0], items: beneficios });
    } catch (e) { res.status(500).send("Error"); }
});

module.exports = router;