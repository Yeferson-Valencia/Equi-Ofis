// Importar el carrito de compras de Carro-Compras.js
import { CarritoDeCompras } from './Carro-Compras.js';

export class Producto {
    constructor(nombre, clase, subclase, referenciaExterna, ruta, cantidad = 1) {
        this.nombre = nombre;
        this.clase = clase;
        this.subclase = subclase;
        this.referenciaExterna = referenciaExterna;
        this.imagen = ruta;
        this.cantidad = cantidad;
    }

    // Métodos para obtener los atributos del producto
    getProducto() {
        return {
            nombre: this.nombre,
            clase: this.clase,
            subclase: this.subclase,
            referenciaExterna: this.referenciaExterna,
            imagen: this.imagen,
            cantidad: this.cantidad
        };
    }

    getNombre(){
        return this.nombre;
    }

    getClase(){
        return this.clase;
    }

    getSubclase(){
        return this.subclase;
    }

    getImagen(){
        return this.imagen;
    }

}

export class Tienda {
    constructor() {
        this.productos = [];
        this.carritoDeCompras = new CarritoDeCompras();
        this.rutaBaseImagenes = 'assets/Imagenes/'; // Ruta base para las imágenes
        this.productosPorPagina = 12;
        this.paginaActual = 1;
        this.filtroActual = null;
    }

    // Método para manejar los eventos
    manejarEventos() {
        // Agregar eventos a los enlaces de clase y subclase
        const claseLinks = document.querySelectorAll('.clase-link');
        const subclaseLinks = document.querySelectorAll('.subclase-link');
        this.eventoFiltrarProductos(claseLinks);
        this.eventoFiltrarProductos(subclaseLinks);

        // Agregar evento al botón de avanzar página y retroceder la página
        const nextPageButton = document.getElementById('nextPage');
        const prevPageButton = document.getElementById('prevPage');
        this.eventoAvanzarPagina(nextPageButton);
        this.eventoRetrocederPagina(prevPageButton);

    }

    // Método para agregar eventos a los enlaces de filtro
    eventoFiltrarProductos(claseLinks) {
        claseLinks.forEach(claseLink => {
            claseLink.addEventListener('click', () => {
                const filtro = claseLink.textContent.trim(); // Obtener el valor del filtro (nombre de la clase)
                this.aplicarFiltro(filtro);
            });
        });
    }

    // Método para agregar evento al botón de avanzar página
    eventoAvanzarPagina(nextPageButton) {
        nextPageButton.addEventListener('click', () => {
            this.avanzarPagina();
        });
    }

    // Método para agregar evento al botón de retroceder página
    eventoRetrocederPagina(prevPageButton) {
        prevPageButton.addEventListener('click', () => {
            this.retrocederPagina();
        });
    }

    // Método para agregar evento a los productos filtrados
    eventoProductosFiltrados() {
        document.querySelectorAll('.image-gallery-add-to-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const indiceProducto = button.getAttribute('data-producto');
                const productosFiltrados = this.filtrarProductos(this.filtroActual);
                const productoSeleccionado = productosFiltrados[indiceProducto];
                this.carritoDeCompras.agregarProducto(productoSeleccionado);
                this.carritoDeCompras.renderizarProductosEnCarritoYContador();
            });
        });
    }

    // Método para cargar productos y eventos
    cargarProductosYEventos() {
        // Renderizar los productos en el carrito y actualizar el contador
        this.carritoDeCompras.cargarProductosDelAlmacenamientoLocal();
        this.carritoDeCompras.renderizarProductosEnCarritoYContador();

        // Renderizar los productos en la página inicial
        this.renderizarProductosEnPagina(1);

        // Manejar eventos
        this.manejarEventos();
    }

    // Método para aplicar el filtro
    aplicarFiltro(filtro) {
        this.filtroActual = filtro;
        this.renderizarProductosEnPagina(1, filtro);
    }

    // Método para avanzar a la siguiente página
    avanzarPagina() {
        const cantidadTotalPaginas = this.getCantidadTotalPaginas(this.filtroActual);
        if (this.paginaActual < cantidadTotalPaginas) {
            this.paginaActual++;
            this.renderizarProductosEnPagina(this.paginaActual, this.filtroActual);
        }
    }
    
    // Método para retroceder a la página anterior
    retrocederPagina() {
        if (this.paginaActual > 1) {
            this.paginaActual--;
            this.renderizarProductosEnPagina(this.paginaActual, this.filtroActual);
        }
    }

    // Método para obtener un producto por su nombre
    getProductoPorNombre(nombre) {
        return this.productos.find(producto => producto.nombre === nombre);
    }

    // Método para obtener la cantidad total de páginas según el filtro
    getCantidadTotalPaginas(filtro) {
        const productosFiltrados = this.filtrarProductos(filtro);
        return Math.ceil(productosFiltrados.length / this.productosPorPagina);
    }

    // Método para cargar productos desde un archivo CSV
    cargarProductosDesdeCSV(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo CSV');
                }
                return response.text();
            })
            .then(data => {
                const lines = data.split('\n').slice(1);
                this.productos = lines.map(line => {
                    const [nombre, clase, subclase, referenciaExterna, ruta] = line.split(',');
                    // Concatenar la ruta base de las imágenes con la ruta de la imagen del producto
                    const imagen = this.rutaBaseImagenes + ruta;
                    return new Producto(nombre, clase, subclase, referenciaExterna, imagen);
                });
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
            });
    }

    // Método para renderizar los productos en la página
    renderizarProductosEnPagina(pagina, filtro = null) {
        const contenedor = document.querySelector('.col-lg-9');
        contenedor.innerHTML = '';

        const productosFiltrados = this.filtrarProductos(filtro);
        const inicio = (pagina - 1) * this.productosPorPagina;
        const fin = Math.min(inicio + this.productosPorPagina, productosFiltrados.length);

        // Calcula el número de columnas según el tamaño de la pantalla
        const numColumnas = 4; // Mostrar cuatro imágenes por fila

        // Recorre los productos para la página actual
        let fila = document.createElement('div');
        fila.classList.add('row', 'mb-4');
        for (let i = inicio; i < fin; i++) {
            const producto = productosFiltrados[i];
            const path = producto.getImagen();
            const nombre = producto.getNombre();
        
            // Crea la tarjeta de producto
            const tarjeta = `
            <div class="col-md-${12 / numColumnas} mb-4"> <!-- Asegúrate de agregar la clase "mb-4" para crear un espacio entre las tarjetas -->
                <div class="card product-wap rounded-0" style="width: 100%; height: 100%;">
                    <div class="card">
                        <img class="card-img-top rounded-0 img-fluid" src="${path}">
                        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            <ul class="list-unstyled">
                                <li><a href="shop-single.html?producto=${encodeURIComponent(JSON.stringify(producto))}" class="btn btn-success text-white mt-2 image-gallery-view"><i class="far fa-eye"></i></a></li>                                
                                <li><a class="btn btn-success text-white mt-2 image-gallery-add-to-cart" href="#" data-producto="${i}"><i class="fas fa-cart-plus"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <a href="#" class="h3 text-decoration-none">${nombre}</a>
                        <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                            <li class="pt-2">
                                <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            `;
        
            fila.innerHTML += tarjeta;

            // Agrega la fila al contenedor cuando se llenen las columnas
            if ((i + 1 - inicio) % numColumnas === 0 || i === fin - 1) {
                contenedor.appendChild(fila);
                fila = document.createElement('div');
                fila.classList.add('row', 'mb-4');
            }
        }

        // Agregar eventos para los productos filtrados
        this.eventoProductosFiltrados();
    }

    // Método para obtener los productos filtrados
    filtrarProductos(filtro) {
        if (!filtro) {
            return this.productos;
        }
        return this.productos.filter(producto => producto.clase === filtro || producto.subclase === filtro);
    }


}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('/shop.html')) {
        const tienda = new Tienda();
        tienda.cargarProductosDesdeCSV('productos.csv')
            .then(() => {
                tienda.cargarProductosYEventos();
                tienda.carritoDeCompras.renderizarProductosEnCarritoYContador()

            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
            });
    }
});

