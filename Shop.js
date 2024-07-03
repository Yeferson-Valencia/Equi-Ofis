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
        // Intentar obtener el filtro de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        this.filtroActual = parametrosURL.get('filtro') || null;   
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
                const indiceProducto = button.getAttribute('data-producto');
                const productosFiltrados = this.filtrarProductos(this.filtroActual);
                const productoSeleccionado = productosFiltrados[indiceProducto];
                this.carritoDeCompras.agregarProducto(productoSeleccionado);
                this.carritoDeCompras.renderizarProductosEnCarritoYContador();
                event.preventDefault();
            });
        });
    }

    // Método para cargar productos y eventos
    cargarProductosYEventos() {
        // Renderizar los productos en el carrito y actualizar el contador
        this.carritoDeCompras.cargarProductosDelAlmacenamientoLocal();
        this.carritoDeCompras.renderizarProductosEnCarritoYContador();
        if(this.filtroActual){
            this.renderizarProductosEnPagina(1, this.filtroActual);
        }else{
        // Renderizar los productos en la página inicial
        this.renderizarProductosEnPagina(1);
        }


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
        const numColumnas = 4; // Cambiamos el número de columnas a 4
        
        // Utilizamos un fragmento para optimizar la manipulación del DOM
        const fragmento = document.createDocumentFragment();
        
        // Recorremos los productos para la página actual
        for (let i = inicio; i < fin; i++) {
            const producto = productosFiltrados[i];
            const path = producto.getImagen();
            const nombre = producto.getNombre();
        
            // Creamos la tarjeta de producto
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('col-md-' + (12 / numColumnas), 'mb-4', 'd-flex', 'align-items-stretch', 'grid-item');
        
            const contenidoTarjeta = `
                <div class="card product-wap rounded-0 flex-fill d-flex flex-column"> 
                    <div class="card h-100 d-flex flex-column"> 
                        <div class="flex-grow-1">
                            <img class="card-img-top rounded-0 img-fluid w-100" src="${path}" style="object-fit: cover; width: 100%; height: 100%;"> 
                        </div>
                        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center"> 
                            <ul class="list-unstyled"> 
                                <li><a href="shop-single.html?producto=${encodeURIComponent(JSON.stringify(producto))}" class="btn btn-success text-white mt-2 image-gallery-view"><i class="far fa-eye"></i></a></li> 
                                <li><a class="btn btn-success text-white mt-2 image-gallery-add-to-cart" href="#" data-producto="${i}"><i class="fas fa-cart-plus"></i></a></li> 
                            </ul> 
                        </div> 
                    </div> 
                </div>
            `;
            tarjeta.innerHTML = contenidoTarjeta;
        
            // Agregamos la tarjeta al fragmento
            fragmento.appendChild(tarjeta);
        }
        
        // Agregamos el fragmento al contenedor
        contenedor.appendChild(fragmento);
        
        // Inicializamos Masonry después de que todas las imágenes se hayan cargado
        imagesLoaded(contenedor, function() {
            // Inicializamos Masonry.js después de un pequeño retraso
            setTimeout(function() {
                var masonry = new Masonry(contenedor, {
                    itemSelector: '.grid-item',
                    columnWidth: contenedor.offsetWidth / numColumnas, // establecemos el ancho de la columna en función del ancho del contenedor y el número de columnas
                    gutter: 20 // Espacio entre los elementos
                });
            }, 100); // retraso de 100 milisegundos
        });
        
        // Agregamos eventos para los productos filtrados
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
        console.log(tienda.filtroActual)
        tienda.cargarProductosDesdeCSV('productos.csv')
            .then(() => {
                tienda.cargarProductosYEventos();
                tienda.carritoDeCompras.renderizarProductosEnCarritoYContador()
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
            });
    }
    const filtro = document.querySelectorAll('.filtro');

    //Ir a la pagina de productos y usar el filtro
    filtro.forEach(filtro => {
    filtro.addEventListener('click', () => {
        const fil = filtro.textContent.trim(); // Obtener el valor del filtro (nombre de la clase)
        // Modificar la URL para incluir el filtro como un parámetro de consulta
        window.location.href = `shop.html?filtro=${encodeURIComponent(fil)}`;
        });
    });
});

