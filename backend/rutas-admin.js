const express = require('express');
const router = express.Router();
const db = require('./db');

// --- API: GUARDAR NUEVO PRODUCTO (POST) ---
router.post('/productos', async (req, res) => {
    const { titulo, precio, descripcion, categoria_id, url_imagen, stock } = req.body;
    const usuario_id = 1; // Usuario por defecto

    try {
        // 1. Insertar Publicación
        const sql = `
            INSERT INTO publicaciones 
            (usuario_id, categoria_id, titulo, descripcion, precio, stock_disponible, estado, moneda)
            VALUES (?, ?, ?, ?, ?, ?, 'activa', 'COP')
        `;
        const [result] = await db.query(sql, [usuario_id, categoria_id, titulo, descripcion, precio, stock]);
        const nuevoId = result.insertId;

        // 2. Insertar Imagen
        const sqlImagen = "INSERT INTO imagenes_producto (publicacion_id, url_imagen) VALUES (?, ?)";
        await db.query(sqlImagen, [nuevoId, url_imagen]);

        res.json({ mensaje: "Producto guardado con éxito", id: nuevoId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar producto" });
    }
});

module.exports = router;