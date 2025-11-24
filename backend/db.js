// backend/db.js
// Usamos la versión con PROMESAS de mysql2
const mysql = require('mysql2/promise');

// Usamos 'createPool' en lugar de 'createConnection'.
// Es mejor para servidores porque gestiona las conexiones automáticamente.
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sasa', // Tu contraseña
    database: 'agrolibre_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probamos la conexión
db.getConnection()
    .then(connection => {
        console.log('✅ Base de datos conectada exitosamente (Pool)');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error conectando a la DB:', err);
    });

module.exports = db;