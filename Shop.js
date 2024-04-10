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



    // Método para actualizar los atributos del producto
    setProducto(nombre, clase, subclase, referenciaExterna, ruta, cantidad) {
        this.nombre = nombre;
        this.clase = clase;
        this.subclase = subclase;
        this.referenciaExterna = referenciaExterna;
        this.imagen = ruta;
        this.cantidad = cantidad;
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

    // Método para obtener todos los productos
    getProductos() {
        return this.productos;
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

    // Método para obtener los productos filtrados
    filtrarProductos(filtro) {
        if (!filtro) {
            return this.productos;
        }
        return this.productos.filter(producto => producto.clase === filtro || producto.subclase === filtro);
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
                        <img class="card-img-top rounded-0 img-fluid" src="${path}" style="max-width: 100%; max-height: 200px; height: auto;">
                        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            <ul class="list-unstyled">
                            <li><a href="shop-single.html?producto=${encodeURIComponent(JSON.stringify(producto))}" class="btn btn-success text-white mt-2 image-gallery-view"><i class="far fa-eye"></i></a></li>                                <li><a class="btn btn-success text-white mt-2 image-gallery-add-to-cart" href="#" data-producto="${i}"><i class="fas fa-cart-plus"></i></a></li>
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
}


document.addEventListener('DOMContentLoaded', () => {

    if(window.location.pathname === '/shop.html') {

    const tienda = new Tienda();

    // Cargar productos desde el archivo CSV al cargar la página
    tienda.cargarProductosDesdeCSV('productos.csv')
        .then(() => {

            //renderizar los productos en el carrito y actualizar el contador
            tienda.carritoDeCompras.cargarProductosDelAlmacenamientoLocal();
            tienda.carritoDeCompras.renderizarProductosEnCarritoYContador();

            // Renderizar los productos en la página inicial
            tienda.renderizarProductosEnPagina(1);

            // Event listener para los enlaces de clase
            const claseLinks = document.querySelectorAll('.clase-link');
            claseLinks.forEach(claseLink => {
                claseLink.addEventListener('click', () => {
                    const filtro = claseLink.textContent.trim(); // Obtener el valor del filtro (nombre de la clase)
                    tienda.aplicarFiltro(filtro);
                });
            });

            // Event listener para los enlaces de subclase
            const subclaseLinks = document.querySelectorAll('.subclase-link');
            subclaseLinks.forEach(subclaseLink => {
                subclaseLink.addEventListener('click', () => {
                    const filtro = subclaseLink.textContent.trim(); // Obtener el valor del filtro (nombre de la subclase)
                    tienda.aplicarFiltro(filtro);
                });
            });

            // Event listener para el botón de avanzar página
            const nextPageButton = document.getElementById('nextPage');
            nextPageButton.addEventListener('click', () => {
                tienda.avanzarPagina();
                tienda.carritoDeCompras.renderizarProductosEnCarritoYContador()
            });

            // Event listener para el botón de retroceder página
            const prevPageButton = document.getElementById('prevPage');
            prevPageButton.addEventListener('click', () => {
                tienda.retrocederPagina();
                tienda.carritoDeCompras.renderizarProductosEnCarritoYContador()

            });

            const productosFiltrados = tienda.filtrarProductos(tienda.filtroActual);
            document.querySelectorAll('.image-gallery-add-to-cart').forEach(button => {
                button.addEventListener('click', function(event) {
                    event.preventDefault();
                    const indiceProducto = this.getAttribute('data-producto');
                    const productoSeleccionado = productosFiltrados[indiceProducto];
                    tienda.carritoDeCompras.agregarProducto(productoSeleccionado)
                    tienda.carritoDeCompras.renderizarProductosEnCarritoYContador();
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        }); 
    }
});

