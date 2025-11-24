// frontend/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Iniciando aplicación...");

    // Cargas Generales
    cargarConfiguracion();
    cargarMenuUsuario();
    cargarCategorias();
    cargarSliderDB();
    cargarBeneficios();
    cargarCategoriasVisuales();
    cargarFooter(); // <--- No olvides esta si ya la tienes

    // Carga inteligente según la página
    if (document.getElementById('contenedor-dinamico')) {
        cargarHomeDinamico();
    }
    
    if (document.getElementById('detalle-titulo')) {
        cargarDetalleProducto();
    }
});

// ---------------------------------------------------------
// 1. LOGO Y CONFIGURACIÓN
// ---------------------------------------------------------
async function cargarConfiguracion() {
    try {
        const icono = document.getElementById('logo-icono-db');
        const texto = document.getElementById('logo-texto-db');
        if (!icono || !texto) return;

        const res = await fetch('http://localhost:3000/api/configuracion');
        const data = await res.json();

        icono.innerHTML = data.logo_svg || '';
        const nombre = data.nombre_sitio || 'MercaAgro';
        const mitad = Math.ceil(nombre.length / 2);
        texto.innerHTML = `${nombre.slice(0, mitad)}<span class="agro-destacado">${nombre.slice(mitad)}</span>`;
    } catch (error) { console.error("❌ Error Config:", error); }
}

// ---------------------------------------------------------
// 2. MENÚ USUARIO
// ---------------------------------------------------------
async function cargarMenuUsuario() {
    try {
        const contenedor = document.getElementById('contenedor-usuario');
        if (!contenedor) return;
        const res = await fetch('http://localhost:3000/api/menu-usuario');
        const data = await res.json();
        contenedor.innerHTML = '';
        data.forEach(btn => {
            contenedor.innerHTML += `
                <a href="${btn.enlace}" class="btn-accion">
                    <div class="icono-accion">${btn.icono_svg}</div>
                    <span>${btn.texto}</span>
                </a>`;
        });
    } catch (error) { console.error("❌ Error Usuario:", error); }
}

// ---------------------------------------------------------
// 3. CATEGORÍAS (Menú y Dropdown)
// ---------------------------------------------------------
async function cargarCategorias() {
    try {
        const menu = document.getElementById('contenedor-menu');
        const dropdown = document.getElementById('dropdown-todas');
        if (!menu) return;

        const res = await fetch('http://localhost:3000/api/categorias');
        const data = await res.json();

        let htmlDropdown = '';
        data.forEach(cat => { htmlDropdown += `<li><a href="#">${cat.nombre}</a></li>`; });
        if (dropdown) dropdown.innerHTML = htmlDropdown;

        // Opcional: Agregar al menú horizontal
        data.forEach(cat => {
             // menu.innerHTML += `<li class="item-menu"><a href="#">${cat.nombre}</a></li>`;
        });
        menu.innerHTML += `<li class="item-menu destaque"><a href="#">Ofertas</a></li>`;

    } catch (error) { console.error("❌ Error Categorías:", error); }
}

// ---------------------------------------------------------
// 4. SLIDER PRINCIPAL
// ---------------------------------------------------------
let indiceSlide = 1;
async function cargarSliderDB() {
    try {
        const contenedor = document.getElementById('contenedor-slider');
        if (!contenedor) return;

        const res = await fetch('http://localhost:3000/api/banners');
        const banners = await res.json();
        if (banners.length === 0) return;

        let htmlSlides = '';
        let htmlDots = '<div class="puntos-container">';

        banners.forEach((banner, index) => {
            htmlSlides += `
                <div class="slide fade">
                    <img src="${banner.url_imagen}" class="imagen-banner">
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
        
        contenedor.innerHTML = htmlSlides + 
            `<a class="prev" onclick="window.moverSlide(-1)">❮</a>` +
            `<a class="next" onclick="window.moverSlide(1)">❯</a>` + 
            htmlDots;

        mostrarSlides(indiceSlide);
        setInterval(() => { window.moverSlide(1); }, 5000);

    } catch (error) { console.error("❌ Error Slider:", error); }
}

window.moverSlide = (n) => mostrarSlides(indiceSlide += n);
window.slideActual = (n) => mostrarSlides(indiceSlide = n);

function mostrarSlides(n) {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (slides.length === 0) return;
    if (n > slides.length) indiceSlide = 1;
    if (n < 1) indiceSlide = slides.length;
    for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
    for (let i = 0; i < dots.length; i++) dots[i].className = dots[i].className.replace(" active", "");
    slides[indiceSlide-1].style.display = "block";
    if (dots.length > 0) dots[indiceSlide-1].className += " active";
}

// ---------------------------------------------------------
// 5. BENEFICIOS Y CATEGORÍAS VISUALES
// ---------------------------------------------------------
async function cargarBeneficios() {
    try {
        const contenedor = document.getElementById('contenedor-beneficios');
        if (!contenedor) return;
        const res = await fetch('http://localhost:3000/api/beneficios');
        const data = await res.json();
        contenedor.innerHTML = '';
        data.forEach(item => {
            contenedor.innerHTML += `
                <div class="info-card">
                    <div class="icono-contenedor">${item.icono_svg}</div>
                    <div class="info-texto">
                        <div class="texto-info-titulo">${item.titulo}</div>
                        <div class="texto-info-desc">${item.descripcion}</div>
                    </div>
                </div>`;
        });
    } catch (error) { console.error("❌ Error Beneficios:", error); }
}

async function cargarCategoriasVisuales() {
    try {
        const contenedor = document.getElementById('contenedor-categorias-visuales');
        if (!contenedor) return;
        const res = await fetch('http://localhost:3000/api/categorias');
        const data = await res.json();
        contenedor.innerHTML = '';
        data.forEach(cat => {
            const img = cat.url_imagen || 'https://placehold.co/200';
            contenedor.innerHTML += `
                <a href="#" class="item-cat-visual">
                    <img src="${img}" class="circulo-img" alt="${cat.nombre}">
                    <span class="nombre-cat">${cat.nombre}</span>
                </a>`;
        });
    } catch (error) { console.error("❌ Error Cat Visuales:", error); }
}

// ---------------------------------------------------------
// 6. HOME DINÁMICO COMPLETO (Bloques + Promos + Suscripción)
// ---------------------------------------------------------
async function cargarHomeDinamico() {
    const contenedor = document.getElementById('contenedor-dinamico');
    if (!contenedor) return;

    try {
        // Cargar todo en paralelo
        const [resHome, resSus, resPromos] = await Promise.all([
            fetch('http://localhost:3000/api/home-completo'),
            fetch('http://localhost:3000/api/suscripcion'),
            fetch('http://localhost:3000/api/promociones')
        ]);

        const secciones = await resHome.json();
        const dataSus = await resSus.json();
        const promociones = await resPromos.json();

        // HTML Suscripción
        let htmlSuscripcion = '';
        if (dataSus.header) {
            let itemsHtml = dataSus.items.map(item => `
                <div class="item-beneficio">
                    <div class="img-beneficio">${item.icono}</div>
                    <p>${item.descripcion}</p>
                </div>`).join('');
            htmlSuscripcion = `
                <div class="contenedor-suscripcion" style="margin: 60px auto;">
                    <div class="banner-suscripcion">
                        <div class="suscripcion-header">
                            <div class="titulo-flex">
                                <span class="badge-pro">${dataSus.header.texto_badge}</span>
                                <h3>${dataSus.header.titulo}</h3>
                            </div>
                            <a href="${dataSus.header.enlace_boton}" class="btn-suscribirse">${dataSus.header.texto_boton}</a>
                        </div>
                        <div class="suscripcion-beneficios">${itemsHtml}</div>
                    </div>
                </div>`;
        }

        // HTML Promociones
        let htmlPromociones = '';
        if (promociones.length > 0) {
            htmlPromociones = '<div class="contenedor-promociones">';
            promociones.forEach(promo => {
                htmlPromociones += `
                    <a href="${promo.enlace_destino}" class="banner-promo">
                        <img src="${promo.url_imagen}" class="img-promo">
                        <div class="info-promo">
                            <div class="titulo-promo">${promo.titulo}</div>
                            <div class="subtitulo-promo">${promo.subtitulo}</div>
                            <span class="btn-promo">${promo.texto_boton}</span>
                        </div>
                    </a>`;
            });
            htmlPromociones += '</div>';
        }

        contenedor.innerHTML = ''; 

        secciones.forEach((seccion, index) => {
            // INYECTAR BANNERS INTERMEDIOS
            if (index === 1) contenedor.innerHTML += htmlPromociones;
            if (index === 2) contenedor.innerHTML += htmlSuscripcion;

            if (seccion.productos.length === 0) return;

            let tarjetasHTML = '';
            seccion.productos.forEach(animal => {
                const img = animal.url_imagen || 'https://placehold.co/400';
                tarjetasHTML += `
                    <div class="tarjeta-animal" onclick="window.location.href='detalle.html?id=${animal.id}'">
                        <div class="imagen-container">
                            <span class="etiqueta-flotante nuevo">DISPONIBLE</span>
                            <button class="btn-favorito" onclick="event.stopPropagation()">♥</button>
                            <img src="${img}" class="imagen-animal">
                        </div>
                        <div class="info-animal">
                            <div class="precio-row"><span class="precio">${formatoMoneda(animal.precio)}</span></div>
                            <div class="titulo">${animal.titulo}</div>
                            <div class="meta-data"><span class="ubicacion">📍 ${animal.ubicacion}</span></div>
                        </div>
                    </div>`;
            });

            contenedor.innerHTML += `
                <div class="bloque-seccion">
                    <h2 class="titulo-seccion">✨ ${seccion.titulo}</h2>
                    <div class="slider-wrapper">
                        <button class="btn-nav-productos prev-prod" onclick="scrollSeccion(this, -1)">❮</button>
                        <div class="grilla-animales">${tarjetasHTML}</div>
                        <button class="btn-nav-productos next-prod" onclick="scrollSeccion(this, 1)">❯</button>
                    </div>
                </div>`;
        });

    } catch (error) { console.error("❌ Error Home:", error); }
}

window.scrollSeccion = function(btn, dir) {
    const wrapper = btn.parentElement;
    const grilla = wrapper.querySelector('.grilla-animales');
    grilla.scrollBy({ left: dir * 300, behavior: 'smooth' });
}

// ---------------------------------------------------------
// 7. DETALLE PRODUCTO
// ---------------------------------------------------------
async function cargarDetalleProducto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`);
        if (!res.ok) throw new Error('Error');
        const animal = await res.json();

        setText('detalle-titulo', animal.titulo);
        setText('detalle-precio', formatoMoneda(animal.precio));
        setText('detalle-descripcion', animal.descripcion);
        setText('detalle-vendedor', animal.vendedor);
        setText('detalle-ubicacion', animal.ubicacion);
        
        const img = document.getElementById('detalle-imagen');
        if(img) img.src = animal.url_imagen || 'https://placehold.co/600';

    } catch (error) { console.error("❌ Error Detalle:", error); }
}

// 8. FOOTER
async function cargarFooter() {
    try {
        const cBusquedas = document.getElementById('footer-busquedas');
        const cLegales = document.getElementById('footer-legales');
        if (!cBusquedas) return;

        const res = await fetch('http://localhost:3000/api/footer');
        const enlaces = await res.json();

        cBusquedas.innerHTML = ''; cLegales.innerHTML = '';
        enlaces.forEach(link => {
            const html = `<a href="${link.enlace}">${link.texto}</a>`;
            if (link.seccion === 'busquedas') cBusquedas.innerHTML += html + ' - ';
            else cLegales.innerHTML += html;
        });
    } catch (error) { console.error("❌ Error Footer:", error); }
}

// UTILIDADES
function formatoMoneda(valor) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor);
}
function setText(id, text) { const el = document.getElementById(id); if(el) el.textContent = text; }