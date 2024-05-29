// Importar de Shop la clase Producto
import { Producto, Tienda } from './Shop.js';

export class CarritoDeCompras {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto) {
        if (!producto) {
            console.error('No se pasó un producto para agregar al carrito');
            return;
        }

        const index = this.productos.findIndex(p => p.nombre === producto.nombre);

        if (index !== -1) {
            this.productos[index].cantidad+=producto.cantidad;
        } else {
            const nuevoProducto = new Producto(
                producto.nombre,
                producto.clase,
                producto.subclase,
                producto.referenciaExterna,
                producto.imagen,
                producto.cantidad,
            );
            this.productos.push(nuevoProducto);
            this.guardarProductos();
        }
    }

    cargarProductosDelAlmacenamientoLocal() {
        const productosEnAlmacenamiento = localStorage.getItem('productos');
        if (productosEnAlmacenamiento) {
            const productosParseados = JSON.parse(productosEnAlmacenamiento);
            this.productos = productosParseados.map(producto => {
                return new Producto(
                    producto.nombre,
                    producto.clase,
                    producto.subclase,
                    producto.referenciaExterna,
                    producto.imagen,
                    producto.cantidad
                );
            });
        }
    }

    actualizarContador() {
        const contador = document.getElementById('cart-counter');
        contador.textContent = this.getCantidadTotal();
    }
    

    // Guardar productos en el almacenamiento local
    guardarProductos() {
        localStorage.setItem('productos', JSON.stringify(this.productos));
    }

    //Actualizar la cantidad de productos en el carrito del local storage

    quitarProducto(producto) {
        if (!producto) {
            console.error('No se pasó un producto para quitar del carrito');
            return;
        }

        const index = this.productos.findIndex(p => p.nombre === producto.nombre);

        if (index !== -1) {
            if (this.productos[index].cantidad > 1) {
                this.productos[index].cantidad--;
            } else {
                this.productos.splice(index, 1);
            }
        } else {
            console.error('El producto no existe en el carrito');
        }
        this.guardarProductos();
    }

    getProductos() {
        return this.productos;
    }

    getCantidadTotal() {
        // Inicializar la cantidad total en 0
        let cantidadTotal = 0;
    
        // Recorrer la matriz de productos y sumar las cantidades de cada producto
        this.productos.forEach(producto => {
            cantidadTotal += producto.cantidad;
        });
    
        // Retornar la cantidad total calculada
        return cantidadTotal;
    }
    

    getProductoPorNombre(nombre) {
        if (!nombre) {
            console.log('No se pasó un nombre de producto para buscar en el carrito');
            return null;
        } else if (this.productos.length === 0) {
            console.log('No hay productos en el carrito');
            return null;
        } else {
            const productoEncontrado = this.productos.find(producto => producto.nombre === nombre);
            return productoEncontrado ? productoEncontrado : null;
        }
    }

    getProductoPorImagen(imagen){
        if (!imagen) {
            console.log('No se pasó un nombre de producto para buscar en el carrito');
            return null;
        } else if (this.productos.length === 0) {
            console.log('No hay productos en el carrito');
            return null;
        } else {
            const productoEncontrado = this.productos.find(producto => producto.imagen === imagen);
            return productoEncontrado ? productoEncontrado : null;
        }
    }

    enviarProductosPorWhatsApp() {
        
        const whatsappButtons = document.querySelectorAll('.send-whatsapp');

        whatsappButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Obtener la cantidad total de productos en el carrito
                const cantidadTotal = this.getCantidadTotal(); // Utiliza la instancia del carrito pasada al constructor
    
                // Comprobar si hay productos en el carrito
                if (cantidadTotal === 0) {
                    alert('No hay productos en el carrito.');
                    return; // Salir de la función si no hay productos en el carrito
                }
    
                let mensaje = "Hola, me gustaría conocer más detalles sobre estos productos:\n\n";
    
                // Agregar cada producto al mensaje
                this.productos.forEach(producto => {
                    //Modificar ruta base segun la url
                    let baseUrl;
    
                    // Verificar si estamos en un entorno local o en un entorno de producción
                    if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
                        // Entorno local
                        baseUrl = window.location.origin + "/Escritorio/Equi-ofis/";
                    } else {
                        // Entorno de producción (GitHub Pages)
                        baseUrl = window.location.origin + "/Equi-Ofis/";
                    }
                    
                    const linkProducto = `${baseUrl}shop-single.html?producto=${encodeURIComponent(JSON.stringify(producto))}`;                
                    mensaje += `- Producto: ${producto.nombre} | Cantidad: ${producto.cantidad} | Enlace: ${linkProducto}\n`;
                });
    
                // Determinar si es dispositivo móvil o de escritorio
                const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
                // Construir el enlace de WhatsApp
                let url = '';
                if (esMovil) {
                    // Si es un dispositivo móvil, abrir en la aplicación de WhatsApp
                    url = `https://wa.me/573178544869?text=${encodeURIComponent(mensaje)}`;
                } else {
                    // Si es un dispositivo de escritorio, abrir en WhatsApp Web
                    url = `https://web.whatsapp.com/send?phone=573178544869&text=${encodeURIComponent(mensaje)}`;
                }
    
                // Abrir el enlace en una nueva ventana
                window.open(url, '_blank');
            });
        });
    }

    renderizarProductosEnCarrito() {
        const carProductsList = document.querySelector('.car-products');
        if (this.getProductos().length > 0) {
            carProductsList.innerHTML = '';
            const whatsappButtonContainer = document.createElement('div');
            whatsappButtonContainer.classList.add('whatsapp-button-container');
            whatsappButtonContainer.id = 'boton-whatsapp';
            whatsappButtonContainer.style.marginTop = '10px';
            whatsappButtonContainer.style.textAlign = 'center';
            const whatsappButton = document.createElement('button');
            whatsappButton.classList.add('btn', 'btn-sm', 'btn-success', 'send-whatsapp');
            whatsappButton.textContent = 'Enviar por WhatsApp';
            whatsappButtonContainer.appendChild(whatsappButton);
    
            this.getProductos().forEach((producto, index) => {
                if (index < 5) { // Limitar a mostrar solo los primeros cinco productos
                    const productElement = document.createElement('div');
                    productElement.classList.add('car-product');
                    productElement.innerHTML = `
                        <div class="product-container" style="display: flex; align-items: center;">
                            <div class="product-image" style="flex: 1; margin-left: 10px;"> <!-- Agregar margen izquierdo -->
                                <img src="${producto.getImagen()}" alt="${producto.getNombre()}" style="width: 50px; height: 50px; max-width: 100%; max-height: 100%;">
                            </div>
                            <div class="product-details" style="flex: 2;">
                                <p class="product-name" style="text-align: center;">${producto.subclase}</p>
                            </div>
                            <div class="product-quantity" style="flex: 1; display: flex; align-items: center; justify-content: flex-end;">
                                <button class="btn btn-sm btn-secondary decrease-quantity">-</button>
                                <span>${producto.cantidad}</span>
                                <button class="btn btn-sm btn-primary increase-quantity">+</button>
                            </div>
                        </div>
                    `;
                    carProductsList.appendChild(productElement);
    
                    const decreaseBtn = productElement.querySelector('.decrease-quantity');
                    const increaseBtn = productElement.querySelector('.increase-quantity');
                    const quantitySpan = productElement.querySelector('.product-quantity span');
    
                    decreaseBtn.addEventListener('click', () => {
                        this.quitarProducto(producto);
                        this.renderizarProductosEnCarrito();
                        this.actualizarContador();
                    });
    
                    increaseBtn.addEventListener('click', () => {
                        producto.cantidad++;
                        quantitySpan.textContent = producto.cantidad;
                        this.actualizarContador();
                    });
                }
            });
    
            carProductsList.appendChild(whatsappButtonContainer);
    
            // Agregar scroll si hay más de cinco productos
            if (this.getProductos().length > 5) {
                carProductsList.style.overflowY = 'scroll';
                carProductsList.style.maxHeight = '250px'; // Ajustar la altura máxima según tus necesidades
            } else {
                carProductsList.style.overflowY = 'auto';
                carProductsList.style.maxHeight = 'none';
            }
    
            // Llamar a la función para enviar productos por WhatsApp después de agregar el botón al DOM
            this.enviarProductosPorWhatsApp();
    
        } else {
            carProductsList.innerHTML = '<p class="text-center">No hay artículos</p>';
        }
    }
    
    
    // Método para renderizar el contador del carrito
    renderizarContador() {
        const carritoCounter = document.getElementById('cart-counter');
        const cantidadTotal = this.getCantidadTotal();
        carritoCounter.textContent = cantidadTotal;
    }

    // Método para renderizar productos en el carrito y actualizar el contador
    renderizarProductosEnCarritoYContador() {
        this.renderizarProductosEnCarrito();
        this.renderizarContador();
        this.guardarProductos();
        this.actualizarEstadoCarritoIcon();
    }
    
    actualizarEstadoCarritoIcon() {
        const carritoIcon = document.getElementById('carrito-icon');
        // Suponiendo que tienes una función que devuelve la cantidad de productos en el carrito
        const cantidadProductos = this.getProductos().length;
    
        if (cantidadProductos > 0) {
            carritoIcon.disabled = false; // Habilita el botón si hay productos
        } else {
            carritoIcon.disabled = true; // Deshabilita el botón si el carrito está vacío
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const carritoIcon = document.getElementById('carrito-icon');

    carritoIcon.addEventListener('click', event => {
        event.preventDefault();
        document.querySelector('.car-products').classList.toggle('active');
    });

    // Asumiendo que tienes una instancia de tu clase de manejo del carrito llamada `miCarrito`
    if (window.location.pathname.endsWith('/shop.html')) {
        const tienda = new Tienda();
        tienda.cargarProductosDesdeCSV('productos.csv')
            .then(() => {
                tienda.cargarProductosYEventos();
                tienda.carritoDeCompras.renderizarProductosEnCarritoYContador();
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
            });
    }
});
