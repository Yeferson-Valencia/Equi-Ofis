// main.js
const productos = require('./productos.js');

const productosPorPagina = 10;
let paginaActual = 1;

function mostrarProductos() {
    // Obtén el contenedor de productos
    const contenedor = document.querySelector('.row');

    // Limpia el contenedor
    contenedor.innerHTML = '';

    // Calcula el índice de inicio y fin
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;

    // Obtiene los productos para la página actual
    const productosPagina = productos.slice(inicio, fin);

    // Crea y añade las tarjetas de productos
    for (let producto of productosPagina) {
        const tarjeta = `
            <div class="col-md-4">
                <div class="card mb-4 product-wap rounded-0">
                    <div class="card rounded-0">
                        <img class="card-img rounded-0 img-fluid" src="${producto.imagen}">
                        <div class="card-body">
                            <a href="shop-single.html" class="h3 text-decoration-none">${producto.nombre}</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += tarjeta;
    }
}

function mostrarPaginacion() {
    // Calcula el número total de páginas
    const totalPaginas = Math.ceil(productos.length / productosPorPagina);

    // Obtiene el contenedor de paginación
    const paginacion = document.querySelector('.pagination');

    // Limpia la paginación
    paginacion.innerHTML = '';

    // Crea y añade los botones de paginación
    for (let i = 1; i <= totalPaginas; i++) {
        const boton = `<li class="page-item"><a class="page-link" href="#" onclick="cambiarPagina(${i})">${i}</a></li>`;
        paginacion.innerHTML += boton;
    }
}

function cambiarPagina(numero) {
    paginaActual = numero;
    mostrarProductos();
    mostrarPaginacion();
}

// Muestra los productos y la paginación inicialmente
mostrarProductos();
mostrarPaginacion();