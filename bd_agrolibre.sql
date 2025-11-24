-- =========================================================
-- 1. INICIALIZACIÓN DE LA BASE DE DATOS
-- =========================================================
DROP DATABASE IF EXISTS agrolibre_db; -- Borra si existe (OJO: Borra todo)
CREATE DATABASE agrolibre_db;
USE agrolibre_db;

-- =========================================================
-- 2. TABLAS DE USUARIOS Y AUTENTICACIÓN
-- =========================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL, -- Encriptar en producción
    nombre_completo VARCHAR(100),
    rol VARCHAR(20) NOT NULL, -- 'admin', 'gerente', 'aseo', 'huesped'
    telefono VARCHAR(20),
    ubicacion VARCHAR(100) DEFAULT 'Colombia'
);

-- Usuarios de prueba
INSERT INTO usuarios (usuario, password, rol, nombre_completo, ubicacion) VALUES 
('admin', '1234', 'administrador', 'Juan Ganadero', 'Medellín, Antioquia'),
('camilo', '1234', 'gerente', 'Camilo Admin', 'Bogotá'),
('invitado', '1234', 'huesped', 'Cliente Feliz', 'Cali');


-- =========================================================
-- 3. TABLAS DEL NEGOCIO (PRODUCTOS)
-- =========================================================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE,
    url_imagen TEXT -- Foto del círculo de categoría
);

INSERT INTO categorias (nombre, slug, url_imagen) VALUES 
('Ganado Bovino', 'bovinos', 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=200&h=200&fit=crop'),
('Porcinos', 'porcinos', 'https://images.unsplash.com/photo-1604848698030-c434ba08ece1?w=200&h=200&fit=crop'),
('Equinos', 'equinos', 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=200&h=200&fit=crop'),
('Caprinos', 'caprinos', 'https://images.unsplash.com/photo-1571152652708-3125e9306974?w=200&h=200&fit=crop'),
('Ovinos', 'ovinos', 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=200&h=200&fit=crop'),
('Insumos Agrícolas', 'insumos', 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=200&h=200&fit=crop'),
('Maquinaria', 'maquinaria', 'https://images.unsplash.com/photo-1592846212339-b734432343b1?w=200&h=200&fit=crop'),
('Aves de Corral', 'aves', 'https://images.unsplash.com/photo-1548550023-2bdb3c5c6d84?w=200&h=200&fit=crop'),
('Búfalos', 'bufalos', 'https://images.unsplash.com/photo-1504204267355-bdda04958d18?w=200&h=200&fit=crop');


CREATE TABLE publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    categoria_id INT,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(15, 2) NOT NULL,
    stock_disponible INT DEFAULT 1,
    estado VARCHAR(20) DEFAULT 'activa',
    moneda CHAR(3) DEFAULT 'COP',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Insertar Productos (Ejemplos variados)
INSERT INTO publicaciones (usuario_id, categoria_id, titulo, descripcion, precio, stock_disponible) VALUES
(1, 1, 'Vaca Holstein Lechera', 'Vaca de 3 años, alta producción.', 3500000, 1),
(1, 2, 'Cerdos Pietrain Destetos', 'Lote de 10 cerditos listos para ceba.', 250000, 10),
(1, 3, 'Caballo Criollo Colombiano', 'Caballo de paso fino, muy noble.', 8000000, 1),
(1, 7, 'Mini Tractor Agrícola 4x4', 'Motor diesel 25HP, ideal terrenos pendientes.', 25000000, 2),
(1, 7, 'Motobomba Diesel Alta Presión', 'Salida 3 pulgadas, garantía 1 año.', 1200000, 5),
(1, 4, 'Pareja de Cabras Alpinas', 'Excelente genética lechera.', 850000, 2),
(1, 1, 'Toro Brahman Rojo', 'Reproductor puro con registro.', 12500000, 1),
(1, 8, 'Lote 50 Gallinas Ponedoras', '16 semanas, listas para postura.', 1250000, 5);


CREATE TABLE imagenes_producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publicacion_id INT,
    url_imagen TEXT NOT NULL,
    orden INT DEFAULT 0,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE
);

-- Fotos de los productos (En orden de inserción)
INSERT INTO imagenes_producto (publicacion_id, url_imagen) VALUES
(1, 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600'), -- Vaca
(2, 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600'), -- Cerdos
(3, 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600'), -- Caballo
(4, 'https://images.unsplash.com/photo-1592846212339-b734432343b1?w=600'), -- Tractor
(5, 'https://images.unsplash.com/photo-1574623460632-d1c91f970997?w=600'), -- Motobomba
(6, 'https://images.unsplash.com/photo-1571152652708-3125e9306974?w=600'), -- Cabras
(7, 'https://images.unsplash.com/photo-1549424748-4b3e8734b020?w=600'), -- Toro
(8, 'https://images.unsplash.com/photo-1548550023-2bdb3c5c6d84?w=600'); -- Gallinas


-- =========================================================
-- 4. CONFIGURACIÓN VISUAL (FRONTEND)
-- =========================================================

-- A. CONFIGURACIÓN GENERAL (Logo)
CREATE TABLE configuracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_sitio VARCHAR(100) NOT NULL,
    logo_svg TEXT, 
    color_primario VARCHAR(20) DEFAULT '#2E7D32'
);
INSERT INTO configuracion (nombre_sitio, logo_svg) VALUES ('MercaAgro', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 13-1.8 16.2"></path><path d="M12 10a7 7 0 0 1 0 10Z"></path></svg>');

-- B. MENÚ DE USUARIO (Botones Header)
CREATE TABLE menu_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texto VARCHAR(50) NOT NULL,
    enlace VARCHAR(255) DEFAULT '#',
    icono_svg TEXT NOT NULL,
    orden INT DEFAULT 0
);
INSERT INTO menu_usuario (texto, enlace, icono_svg, orden) VALUES 
('Ingresa', 'login.html', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>', 1),
('Mis Compras', 'compras.html', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>', 2),
('Favoritos', 'favoritos.html', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>', 3);

-- C. BANNERS PRINCIPALES (Slider Grande)
CREATE TABLE banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100), descripcion VARCHAR(255), texto_boton VARCHAR(50), url_imagen TEXT, orden INT DEFAULT 0
);
INSERT INTO banners (titulo, descripcion, texto_boton, url_imagen, orden) VALUES 
('Hacienda La Esperanza', 'Genética Holstein certificada.', 'Ver animales', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=550&fit=crop', 1),
('Porcicultura Rentable', 'Cerdos Pietrain listos para cría.', 'Comprar lote', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1600&h=550&fit=crop', 2),
('Maquinaria Agrícola', 'Tecnifica tu campo hoy.', 'Ver tractores', 'https://images.unsplash.com/photo-1625246333195-58197bd47d72?w=1600&h=550&fit=crop', 3);

-- D. BENEFICIOS (Info Cards - Tarjetas Blancas)
CREATE TABLE beneficios (
    id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(100), descripcion VARCHAR(255), icono_svg TEXT, orden INT DEFAULT 0
);
INSERT INTO beneficios (titulo, descripcion, icono_svg, orden) VALUES 
('Paga seguro', 'Transferencia o tarjeta', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>', 1),
('Transporte animal', 'Certificado y seguro', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>', 2),
('Compra protegida', 'Garantía de sanidad', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>', 3),
('Veterinarios', 'Consultas en línea', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M12 7v10" /><path d="M7 12h10" /></svg>', 4),
('Soporte 24/7', 'Expertos disponibles', '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>', 5);

-- E. SECCIONES DEL HOME (Bloques de Productos)
CREATE TABLE secciones_home (
    id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(100), categoria_id INT, orden INT DEFAULT 0
);
INSERT INTO secciones_home (titulo, categoria_id, orden) VALUES 
('🐄 Ganado Lechero Destacado', 1, 1),
('🐖 Porcicultura de Calidad', 2, 2),
('🐴 Equinos y Caballos', 3, 3),
('🚜 Tecnifica tu Campo', 7, 4);

-- F. BANNERS PROMOCIONALES (Negros)
CREATE TABLE promociones (
    id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(100), subtitulo VARCHAR(100), texto_boton VARCHAR(50), url_imagen TEXT, enlace_destino VARCHAR(255) DEFAULT '#', orden INT DEFAULT 0
);
INSERT INTO promociones (titulo, subtitulo, texto_boton, url_imagen, orden) VALUES 
('FERIA GANADERA', 'Descuentos en genética Cebú', 'Ver lotes >', 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=800&h=400&fit=crop', 1),
('INSUMOS AL POR MAYOR', 'Hasta 30% OFF en fertilizantes', 'Comprar ahora >', 'https://images.unsplash.com/photo-1625246333195-58197bd47d72?w=800&h=400&fit=crop', 2);

-- G. SUSCRIPCIÓN (Agro+)
CREATE TABLE info_suscripcion (id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(100), texto_badge VARCHAR(20), texto_boton VARCHAR(50), enlace_boton VARCHAR(255) DEFAULT '#');
INSERT INTO info_suscripcion (titulo, texto_badge, texto_boton) VALUES ('LLEVA TU FINCA AL SIGUIENTE NIVEL', 'Agro+', 'Suscribirme por $19.900');

CREATE TABLE beneficios_suscripcion (id INT AUTO_INCREMENT PRIMARY KEY, icono VARCHAR(50), descripcion VARCHAR(100), orden INT DEFAULT 0);
INSERT INTO beneficios_suscripcion (icono, descripcion, orden) VALUES ('🚛', 'Envíos gratis desde $100.000', 1), ('👨‍⚕️', 'Asesoría veterinaria 24/7', 2), ('🛡️', 'Garantía en maquinaria', 3), ('💎', 'Destaca tus ventas', 4);

-- H. FOOTER
CREATE TABLE footer_enlaces (id INT AUTO_INCREMENT PRIMARY KEY, texto VARCHAR(100), enlace VARCHAR(255) DEFAULT '#', seccion ENUM('busquedas', 'legales') NOT NULL, orden INT DEFAULT 0);
INSERT INTO footer_enlaces (texto, enlace, seccion, orden) VALUES 
('Venta de Ganado', '#', 'busquedas', 1), ('Tractores Baratos', '#', 'busquedas', 2),
('Trabaja con nosotros', '#', 'legales', 1), ('Ayuda / PQR', '#', 'legales', 2);