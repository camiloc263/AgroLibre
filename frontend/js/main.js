// frontend/js/main.js

document.addEventListener('DOMContentLoaded', () =>{ 
    
    // =========================================================
    // 1. LÓGICA DEL SLIDER (Solo si existe en la página)
    // =========================================================
    let indiceSlide = 1;
    if (document.querySelectorAll('.slide').length > 0) {
        mostrarSlides(indiceSlide);
        
        // Auto-play del slider
        setInterval(() => {
            if(typeof window.moverSlide === 'function') window.moverSlide(1);
        }, 5000);
    }

    // Definir funciones globales del slider para el HTML
    window.moverSlide = function(n) { mostrarSlides(indiceSlide += n); }
    window.slideActual = function(n) { mostrarSlides(indiceSlide = n); }

    function mostrarSlides(n) {
        let slides = document.getElementsByClassName("slide");
        let dots = document.getElementsByClassName("dot");
        if (slides.length === 0) return;

        if (n > slides.length) {indiceSlide = 1}    
        if (n < 1) {indiceSlide = slides.length}
        
        for (let i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }
        for (let i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" active", ""); }
        
        slides[indiceSlide-1].style.display = "block";
        
        // Reiniciar animación texto
        let contenido = slides[indiceSlide-1].querySelector('.contenido-slide');
        if(contenido) {
            contenido.style.animation = 'none';
            contenido.offsetHeight; 
            contenido.style.animation = 'subirTexto 1s ease forwards';
        }
        if(dots.length > 0) dots[indiceSlide-1].className += " active";
    }

    // =========================================================
    // 2. ENRUTADOR: QUÉ CARGAR SEGÚN LA PÁGINA
    // =========================================================
    
    // Si estamos en el Home (hay contenedor de productos), cargamos todo
    if (document.getElementById('contenedor-productos')) {
        if (document.getElementById('contenedor-slider')) cargarSliderDB();
        cargarProductos(); // <--- Aquí llamamos a la función que faltaba
        cargarBeneficios();
    }

    if (document.getElementById('contenedor-menu')) {
        cargarCategorias(); // <--- NUEVA LÍNEA
    }

    // Si estamos en Detalle (hay título de detalle), cargamos la info del animal
    if (document.getElementById('detalle-titulo')) {
        cargarDetalleProducto();
    }

    cargarConfiguracion();
    cargarMenuUsuario();
});

// =========================================================
// 3. FUNCIONES DE CONEXIÓN (API)
// =========================================================

// A. CARGAR SLIDER DESDE BD
async function cargarSliderDB() {
    try {
        const contenedor = document.getElementById('contenedor-slider');
        const respuesta = await fetch('http://localhost:3000/api/banners');
        const banners = await respuesta.json();

        if (banners.length === 0) return;

        let htmlSlides = '';
        let htmlDots = '<div class="puntos-container">';

        banners.forEach((banner, index) => {
            htmlSlides += `
                <div class="slide fade">
                    <img src="${banner.url_imagen}" class="imagen-banner" alt="${banner.titulo}">
                    <div class="overlay-gradiente"></div>
                    <div class="contenido-slide">
                        <span class="etiqueta-destacado">DESTACADO</span>
                        <h2>${banner.titulo}</h2>
                        <p>${banner.descripcion}</p>
                        <a href="#" class="btn-slide">${banner.texto_boton}</a>
                    </div>
                </div>`;
            htmlDots += `<span class="dot" onclick="window.slideActual(${index + 1})"></span>`;
        });
        htmlDots += '</div>';
        
        contenedor.innerHTML = htmlSlides + `
            <a class="prev" onclick="window.moverSlide(-1)">❮</a>
            <a class="next" onclick="window.moverSlide(1)">❯</a>
        ` + htmlDots;

        // Reiniciamos lógica visual del slider
        if(typeof window.moverSlide === 'function') window.moverSlide(0);

    } catch (error) { console.error("Error slider:", error); }
}

// B. CARGAR PRODUCTOS (HOME) --> ¡AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA!
async function cargarProductos() {
    try {
        const contenedor = document.getElementById('contenedor-productos');
        if (!contenedor) return;

        const respuesta = await fetch('http://localhost:3000/api/productos');
        const productos = await respuesta.json();

        contenedor.innerHTML = ''; // Limpiar

        if (productos.length === 0) {
            contenedor.innerHTML = '<p style="width:100%; text-align:center;">No hay animales publicados aún.</p>';
            return;
        }

        productos.forEach(animal => {
            const imagenUrl = animal.url_imagen || 'https://placehold.co/400x300?text=Sin+Foto';
            
            const tarjetaHTML = `
                <div class="tarjeta-animal" onclick="verDetalle(${animal.id})">
                    <div class="imagen-container">
                        <span class="etiqueta-flotante nuevo">NUEVO</span>
                        <button class="btn-favorito" onclick="event.stopPropagation()">♥</button>
                        <img src="${imagenUrl}" alt="${animal.titulo}" class="imagen-animal" onerror="this.src='https://placehold.co/400x300?text=Foto+No+Disponible'">
                    </div>
                    <div class="info-animal">
                        <div class="precio-row">
                            <span class="precio">${formatoMoneda(animal.precio)}</span>
                            <span class="envio-gratis">⚡ Envío gratis</span>
                        </div>
                        <div class="titulo">${animal.titulo}</div>
                        <div class="meta-data">
                            <span class="ubicacion">📍 ${animal.ubicacion || 'Nacional'}</span>
                            <span class="vendedor">👤 ${animal.vendedor || 'Vendedor'}</span>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += tarjetaHTML;
        });
    } catch (error) { console.error("Error productos:", error); }
}

// C. CARGAR BENEFICIOS (INFO CARDS)
async function cargarBeneficios() {
    try {
        const contenedor = document.getElementById('contenedor-beneficios');
        if (!contenedor) return;

        const respuesta = await fetch('http://localhost:3000/api/beneficios');
        const beneficios = await respuesta.json();

        contenedor.innerHTML = '';

        beneficios.forEach(item => {
            const cardHTML = `
                <div class="info-card">
                    <div class="icono-contenedor">${item.icono_svg}</div>
                    <div class="info-texto">
                        <div class="texto-info-titulo">${item.titulo}</div>
                        <div class="texto-info-desc">${item.descripcion}</div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += cardHTML;
        });
    } catch (error) { console.error("Error beneficios:", error); }
}

// D. CARGAR DETALLE (PÁGINA DETALLE)
async function cargarDetalleProducto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const respuesta = await fetch(`http://localhost:3000/api/productos/${id}`);
        if (!respuesta.ok) throw new Error('Producto no encontrado');
        
        const animal = await respuesta.json();

        // Llenar datos
        setText('detalle-titulo', animal.titulo);
        setText('detalle-precio', formatoMoneda(animal.precio));
        setText('detalle-descripcion', animal.descripcion || 'Sin descripción detallada.');
        setText('detalle-vendedor', animal.vendedor);
        setText('detalle-ubicacion', animal.ubicacion || 'Ubicación no disponible');
        setText('detalle-stock', animal.stock_disponible);
        setText('detalle-id', animal.id);

        // Imagen
        const imagen = document.getElementById('detalle-imagen');
        if(imagen) {
            imagen.src = animal.url_imagen || 'https://placehold.co/600x400?text=Sin+Foto';
            imagen.onerror = function() { this.src = 'https://placehold.co/600x400?text=Foto+No+Disponible'; };
        }
        
        // WhatsApp
        const btnWhatsapp = document.getElementById('btn-whatsapp-detalle');
        if(btnWhatsapp) {
            btnWhatsapp.onclick = () => {
                const mensaje = `Hola, estoy interesado en: ${animal.titulo} (ID: ${animal.id})`;
                const telefono = animal.telefono || '573000000000';
                window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
            };
        }

    } catch (error) {
        console.error(error);
        document.querySelector('.contenedor-detalle').innerHTML = '<div style="padding:50px; text-align:center"><h2>Producto no encontrado 😢</h2><a href="index.html">Volver al inicio</a></div>';
    }
}

// --- NUEVA FUNCIÓN: CARGAR MENÚ DESDE BD ---
async function cargarCategorias() {
    try {
        const contenedor = document.getElementById('contenedor-menu');
        if (!contenedor) return;

        // 1. Pedir categorías
        const respuesta = await fetch('http://localhost:3000/api/categorias');
        const categorias = await respuesta.json();

        // 2. Generar HTML (Mantenemos el botón de hamburguesa fijo al inicio si quieres)
        // Si borraste el botón fijo del HTML, descomenta la siguiente línea:
        // contenedor.innerHTML = `<li class="item-menu categorias-btn"><a href="#"><span class="icono-hamburguesa">☰</span> Todas</a></li>`;

        // 3. Dibujar cada categoría
        categorias.forEach(cat => {
            const itemHTML = `
                <li class="item-menu">
                    <a href="#">${cat.nombre}</a>
                </li>
            `;
            // Insertamos antes del botón "Ofertas" si quisieras mantener orden, 
            // o simplemente al final de la lista.
            contenedor.innerHTML += itemHTML;
        });

        // 4. Agregar el botón de Ofertas al final (Manual)
        contenedor.innerHTML += `<li class="item-menu destaque"><a href="#">Ofertas</a></li>`;

    } catch (error) {
        console.error("Error cargando menú:", error);
    }
}

// --- FUNCIÓN: CARGAR MENÚ Y DROPDOWN DESDE BD ---
async function cargarCategorias() {
    try {
        const contenedorHorizontal = document.getElementById('contenedor-menu');
        const contenedorDropdown = document.getElementById('dropdown-todas'); // <--- NUEVO OBJETIVO

        // Si no existe ninguno de los dos, salimos
        if (!contenedorHorizontal && !contenedorDropdown) return;

        // 1. Pedir categorías al servidor
        const respuesta = await fetch('http://localhost:3000/api/categorias');
        const categorias = await respuesta.json();

        // 2. Generar el HTML de los ítems
        let htmlItems = '';
        
        categorias.forEach(cat => {
            // Creamos el link para cada categoría
            htmlItems += `
                <li>
                    <a href="#">${cat.nombre}</a>
                </li>
            `;
        });

        // 3. Inyectar en el Dropdown "Todas las Categorías"
        if (contenedorDropdown) {
            contenedorDropdown.innerHTML = htmlItems;
        }

        // 4. Inyectar en la Barra Horizontal (Opcional: podrías querer mostrar solo algunas aquí)
        if (contenedorHorizontal) {
            // Mantenemos el botón de "Todas" al principio y "Ofertas" al final
            const botonTodas = `<li class="item-menu categorias-btn">
                                    <a href="#"><span class="icono-hamburguesa">☰</span> Todas las Categorías</a>
                                    <ul class="submenu" id="dropdown-todas">${htmlItems}</ul>
                                </li>`;
            
            // Aquí decidimos poner las categorías también en la barra horizontal
            // Nota: Si son muchas, quizás prefieras no ponerlas todas en la barra horizontal
            let itemsHorizontales = '';
            categorias.forEach(cat => {
                itemsHorizontales += `<li class="item-menu"><a href="#">${cat.nombre}</a></li>`;
            });

            const botonOfertas = `<li class="item-menu destaque"><a href="#">Ofertas</a></li>`;

            // Reconstruimos todo el menú
            contenedorHorizontal.innerHTML = botonTodas + itemsHorizontales + botonOfertas;
        }

    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

// --- NUEVA FUNCIÓN: CARGAR LOGO Y NOMBRE ---
async function cargarConfiguracion() {
    try {
        const iconoContainer = document.getElementById('logo-icono-db');
        const textoContainer = document.getElementById('logo-texto-db');
        
        if (!iconoContainer || !textoContainer) return;

        // 1. Pedir datos
        const respuesta = await fetch('http://localhost:3000/api/configuracion');
        const config = await respuesta.json();

        if (!config) return;

        // 2. Inyectar Icono SVG
        iconoContainer.innerHTML = config.logo_svg;

        // 3. Inyectar Nombre con Estilo
        // Dividimos el nombre para darle color diferente a la segunda mitad (Merca - Agro)
        // O simplemente lo ponemos todo junto si prefieres.
        // Aquí aplicamos la lógica: "Merca" blanco, "Agro" amarillo.
        
        const nombre = config.nombre_sitio;
        const mitad = Math.ceil(nombre.length / 2);
        const primeraParte = nombre.slice(0, mitad); // Ej: "Merca"
        const segundaParte = nombre.slice(mitad);    // Ej: "Agro"

        textoContainer.innerHTML = `${primeraParte}<span class="agro-destacado">${segundaParte}</span>`;
        
        // Opcional: Cambiar el título de la pestaña del navegador
        document.title = `${config.nombre_sitio} - Tu tienda de campo`;

    } catch (error) {
        console.error("Error cargando configuración:", error);
    }
}

// --- NUEVA FUNCIÓN: CARGAR MENÚ DE USUARIO ---
async function cargarMenuUsuario() {
    try {
        const contenedor = document.getElementById('contenedor-usuario');
        if (!contenedor) return;

        // 1. Pedir datos
        const respuesta = await fetch('http://localhost:3000/api/menu-usuario');
        const botones = await respuesta.json();

        // 2. Limpiar
        contenedor.innerHTML = '';

        // 3. Dibujar botones
        botones.forEach(boton => {
            const btnHTML = `
                <a href="${boton.enlace}" class="btn-accion">
                    <div class="icono-accion">
                        ${boton.icono_svg}
                    </div>
                    <span>${boton.texto}</span>
                </a>
            `;
            contenedor.innerHTML += btnHTML;
        });

    } catch (error) {
        console.error("Error cargando menú usuario:", error);
    }
}

// =========================================================
// 4. UTILIDADES
// =========================================================

function formatoMoneda(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(valor);
}

function verDetalle(id) {
    window.location.href = `detalle.html?id=${id}`;
}

function setText(id, texto) {
    const el = document.getElementById(id);
    if (el) el.textContent = texto;
}