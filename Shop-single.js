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

        // Establecer el contenido de los elementos al valor correspondiente del producto
        imagenProducto.src = this.producto.imagen; // Corrección: Utilizar directamente el atributo 'imagen'
        nombreProducto.textContent = this.producto.nombre; // Corrección: Acceder directamente al atributo 'nombre'
        cantidadProducto.textContent = this.producto.cantidad; // Corrección: Acceder directamente al atributo 'cantidad'
        const btnMinus = document.getElementById('btn-minus');
        const btnPlus = document.getElementById('btn-plus');

        // Event listener para el botón de menos
        btnMinus.addEventListener('click', () => {
            this.producto.cantidad--;
            actualizarCantidad();
        });

        // Event listener para el botón de más
        btnPlus.addEventListener('click', () => {
            this.producto.cantidad++;
            actualizarCantidad();
        });

        // Función para actualizar la cantidad en el DOM
        function actualizarCantidad() {
            varValue.textContent = producto.cantidad;
            cantidadProducto.value = producto.cantidad;

            const productoEnCarrito = carrito.getProductoPorNombre(producto.nombre);
            if (productoEnCarrito !== null) {
                const cantidadEnCarrito = productoEnCarrito.cantidad;
                if (cantidadEnCarrito > 0) {
                    btnMinus.disabled = false; // Habilitar botón de menos si la cantidad en el carrito es mayor a cero
                } else {
                    if (parseInt(varValue.textContent) === 0) {
                        btnMinus.disabled = true; // Deshabilitar botón de menos si la cantidad en el carrito es cero pero para valores negativos
                    } else {
                        btnMinus.disabled = false; // Habilitar botón de menos si la cantidad en el carrito es cero
                    }
                }

                if (-cantidadEnCarrito === parseInt(varValue.textContent)) {
                    btnMinus.disabled = true; // Deshabilitar botón de menos si la cantidad en el carrito es igual a la cantidad del producto en negativo
                }
            } else {
                console.log('No hay productos en el carrito');
            }
        }

        // Llamar a la función para inicializar la cantidad
        actualizarCantidad();

        // Agregar producto al carrito 
        const btnCompras = document.getElementById('btnCompras');
        btnCompras.addEventListener('click', (event) => {
            event.preventDefault();
            if (producto.cantidad === 0) {
                producto.cantidad = 1;
                carrito.agregarProducto(producto);
                actualizarCantidad();
                carrito.renderizarProductosEnCarritoYContador();
            } else {
                carrito.agregarProducto(producto);
                carrito.renderizarProductosEnCarritoYContador();
                producto.cantidad = carrito.getProductoPorNombre(producto.nombre).cantidad;
                actualizarCantidad();
                carrito.renderizarProductosEnCarritoYContador();
            }
        });

    }

    enviarProductosPorWhatsApp() {
        const whatsappButton = document.getElementById('whatsappButton');

        whatsappButton.addEventListener('click', () => {
            // Obtener la cantidad total de productos en el carrito
            const cantidadTotal = this.carrito.getCantidadTotal(); // Utiliza la instancia del carrito pasada al constructor

            // Comprobar si hay productos en el carrito
            if (cantidadTotal === 0) {
                alert('No hay productos en el carrito.');
                return; // Salir de la función si no hay productos en el carrito
            }

            let mensaje = "Hola, me gustaría conocer más detalles sobre estos productos:\n\n";

            // Agregar cada producto al mensaje
            this.carrito.productos.forEach(producto => {
                mensaje += `- Producto: ${producto.nombre} | Cantidad: ${producto.cantidad}\n`;
            });

            // Determinar si es dispositivo móvil o de escritorio
            const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // Construir el enlace de WhatsApp
            let url = '';
            if (esMovil) {
                // Si es un dispositivo móvil, abrir en la aplicación de WhatsApp
                url = `https://wa.me/573115288907?text=${encodeURIComponent(mensaje)}`;
            } else {
                // Si es un dispositivo de escritorio, abrir en WhatsApp Web
                url = `https://web.whatsapp.com/send?phone=573115288907&text=${encodeURIComponent(mensaje)}`;
            }

            // Abrir el enlace en una nueva ventana
            window.open(url, '_blank');
        });
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
        productoMostrar.enviarProductosPorWhatsApp();

    } else {
        const productoDefault = new Producto('sept_prodEspecializados_03', 'Puestos de Trabajo', 'Puestos de Trabajo', '', 'assets/Imagenes/Puestos de Trabajo/sept_prodEspecializados_03.jpg ');
        const productoMostrar = new shopSingle(productoDefault, carrito);
        productoMostrar.main(carrito, productoDefault);
        productoMostrar.enviarProductosPorWhatsApp();
    }
});
