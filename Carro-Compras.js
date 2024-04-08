// Importar de Shop la clase Producto
import { Producto } from './Shop.js';

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
            this.productos[index].cantidad++;
        } else {
            const nuevoProducto = new Producto(
                producto.nombre,
                producto.clase,
                producto.subclase,
                producto.referenciaExterna,
                producto.imagen,
                1
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
    

    // Guardar productos en el almacenamiento local
    guardarProductos() {
        localStorage.setItem('productos', JSON.stringify(this.productos));
    }

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
        if (this.productos.length === 0) {
            return 0;
        }
        return this.productos.reduce((total, producto) => total + producto.cantidad, 0);
    }

    // Método para renderizar los productos en el carrito y actualizar el contador
    renderizarProductosEnCarritoYContador() {
        const carritoIcon = document.getElementById('carrito-icon');
        const carritoCounter = document.getElementById('cart-counter');
        const carProducts = document.querySelector('.car-products');

        carritoIcon.addEventListener('click', event => {
            event.preventDefault();
            carProducts.classList.toggle('active');
        });

        const renderizarProductosEnCarrito = () => {
            const carProductsList = document.querySelector('.car-products');
            if (this.getProductos().length > 0) {
                carProductsList.innerHTML = '';
                this.getProductos().forEach(producto => {
                    const productElement = document.createElement('div');
                    productElement.classList.add('car-product');
                    productElement.innerHTML = `
                        <div style="display: flex; align-items: center;">
                            <div class="product-image" style="flex: 1;">
                                <img src="${producto.getImagen()}" alt="${producto.getNombre()}" style="width: 50px; height: 50px; max-width: 100%; max-height: 100%;">
                            </div>
                            <div class="product-name" style="flex: 2;">
                                <p>${producto.getNombre()}</p>
                            </div>
                            <div class="product-quantity" style="flex: 1; display: flex; align-items: center; justify-content: space-between;">
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
                        renderizarProductosEnCarrito();
                        actualizarContador();
                    });

                    increaseBtn.addEventListener('click', () => {
                        producto.cantidad++;
                        quantitySpan.textContent = producto.cantidad;
                        actualizarContador();
                    });
                });
            } else {
                carProductsList.innerHTML = '<p class="text-center">No hay artículos</p>';
            }
        };

        const actualizarContador = () => {
            const cantidadTotal = this.getCantidadTotal();
            carritoCounter.textContent = cantidadTotal;
        };

        renderizarProductosEnCarrito();
        actualizarContador();
        this.guardarProductos();
    }
}