// Importar la clase CarritoDeCompras
import { CarritoDeCompras } from './Carro-Compras.js';
import { Producto } from './Shop.js';

class shopSingle {
    constructor(producto, carrito) {
        this.producto = producto;
        this.carrito = carrito;
    }

    main(carrito, producto) {
        // Seleccionar los elementos del DOM donde quieres mostrar la información del producto
        const imagenProducto = document.querySelector('#product-detail');
        const nombreProducto = document.querySelector('#product-name');
        const varValue = document.getElementById('var-value');
        const cantidadProducto = document.getElementById('product-quanity');
        const btnMinus = document.getElementById('btn-minus');
    
        // Establecer el contenido de los elementos al valor correspondiente del producto
        imagenProducto.src = producto.imagen; // Utilizar directamente el atributo 'imagen' del producto
        nombreProducto.textContent = producto.nombre; // Acceder directamente al atributo 'nombre' del producto
        varValue.textContent = producto.cantidad; // Mostrar la cantidad actual del producto
        cantidadProducto.value = producto.cantidad; // Asignar la cantidad actual del producto al input
    
        // Event listener para el botón de menos
        btnMinus.addEventListener('click', () => {
            if (producto.cantidad > 0) {
                producto.cantidad--;
                actualizarCantidad();
            }
        });
    
        // Event listener para el botón de más
        const btnPlus = document.getElementById('btn-plus');
        btnPlus.addEventListener('click', () => {
            producto.cantidad++;
            actualizarCantidad();
        });
    
        // Función para actualizar la cantidad en el DOM
        function actualizarCantidad() {
            varValue.textContent = producto.cantidad;
            cantidadProducto.value = producto.cantidad;
    
            // Actualizar estado del botón de menos
            btnMinus.disabled = (producto.cantidad === 0);
    
            // Actualizar cantidad en el carrito
            const productoEnCarrito = carrito.getProductoPorNombre(producto.nombre);
            if (productoEnCarrito) {
                productoEnCarrito.cantidad = producto.cantidad;
            } else {
                console.log('No hay productos en el carrito');
            }
            carrito.renderizarProductosEnCarritoYContador();
        }
    
        // Agregar producto al carrito
        const btnCompras = document.getElementById('btnCompras');
        btnCompras.addEventListener('click', (event) => {
            event.preventDefault();
            if (producto.cantidad > 0) {
                carrito.agregarProducto(producto);
                actualizarCantidad();
            } else {
                console.log('No se puede agregar un producto con cantidad 0 al carrito.');
            }
        });
    
        // Llamar a la función para inicializar la cantidad
        actualizarCantidad();
    }
    


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
                return lines.map(line => {
                    const [nombre, clase, subclase, referenciaExterna, ruta] = line.split(',');
                    // Concatenar la ruta base de las imágenes con la ruta de la imagen del producto
                    const imagen = 'assets/Imagenes/' + ruta;
                    return new Producto(nombre, clase, subclase, referenciaExterna, imagen);
                });
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
                throw error;
            });
    }

    renderizarProductosRelacionados() {
        try {
            const clase = this.producto.clase;
            const subclase = this.producto.subclase;
            const carouselContainer = document.querySelector('#carousel-related-product .carousel-inner');

            // Obtener productos relacionados
            this.cargarProductosDesdeCSV('productos.csv')
                .then(productos => {
                    // Filtrar productos relacionados por clase y subclase
                    const productosFiltrados = productos.filter(producto => {
                        return producto.clase === clase || producto.subclase === subclase;
                    });

                    // Crear el HTML para los productos relacionados
                    let html = '';
                    productosFiltrados.forEach(producto => {
                        html += `
                            <div class="carousel-item">
                                <div class="p-2 pb-3">
                                    <div class="product-wap card rounded-0">
                                        <div class="card rounded-0">
                                            <img class="card-img rounded-0 img-fluid" src="${producto.imagen}">
                                            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                                <ul class="list-unstyled">
                                                    <li><a class="btn btn-success text-white" href="shop-single.html"><i class="far fa-heart"></i></a></li>
                                                    <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="far fa-eye"></i></a></li>
                                                    <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="fas fa-cart-plus"></i></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <a href="shop-single.html" class="h3 text-decoration-none">${producto.nombre}</a>
                                            <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });

                    // Insertar el HTML en el contenedor del carrusel
                    carouselContainer.innerHTML = html;

                    // Inicializar el carrusel de productos relacionados con Slick Carousel
                    $('#carousel-related-product').slick({
                        infinite: true,
                        arrows: true,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        dots: false,
                        responsive: [{
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3
                                }
                            },
                            {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ]
                    });
                })
                .catch(error => {
                    console.error('Error al cargar productos desde CSV:', error);
                });
        } catch (error) {
            console.error('Error en el método renderizarProductosRelacionados:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const carrito = new CarritoDeCompras(); // Crear una instancia de CarritoDeCompras

    // Cargar productos del almacenamiento local
    carrito.cargarProductosDelAlmacenamientoLocal();

    // Renderizar el carrito al cargar la página
    carrito.renderizarProductosEnCarritoYContador();
    carrito.enviarProductosPorWhatsApp(); // Inicializar la funcionalidad de enviar productos por WhatsApp

    // Obtener el valor del parámetro producto de la URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productoString = urlParams.get('producto');

    // Decodificar la información del producto desde formato JSON
    const productoJSON = JSON.parse(decodeURIComponent(productoString));
    if (productoJSON != null) {
        const producto = new Producto(productoJSON.nombre, productoJSON.clase, productoJSON.subclase, productoJSON.ReferecnaiaExterna, productoJSON.imagen, productoJSON.cantidad)
        const productoMostrar = new shopSingle(producto, carrito);
        productoMostrar.main(carrito, producto);

    } else {
        const productoDefault = new Producto('sept_prodEspecializados_03', 'Puestos de Trabajo', 'Puestos de Trabajo', '', 'assets/Imagenes/Puestos de Trabajo/sept_prodEspecializados_03.jpg ');
        const productoMostrar = new shopSingle(productoDefault, carrito);
        productoMostrar.main(carrito, productoDefault);
    }
});
