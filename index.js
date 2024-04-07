class Producto {
    constructor(nombre, clase, subclase, referenciaExterna, ruta, cantidad = 0) {
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

class CarritoDeCompras {
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
        }
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
}

class Tienda {
    constructor() {
        this.productos = [];
        this.carritoDeCompras = new CarritoDeCompras();
        ;
    }

    cargarProductosSiNecesario(url) {
        if (this.carritoDeCompras.getProductos().length === 0) {
            return this.cargarProductosDesdeCSV(url);
        } else {
            return Promise.resolve();
        }
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
                this.productos = lines.map(line => {
                    const [nombre, clase, subclase, referenciaExterna, ruta] = line.split(',');
                    return new Producto(nombre, clase, subclase, referenciaExterna, ruta);
                });
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
            });
    }

    getProductos() {
        return this.productos;
    }

    getProductoPorNombre(nombre) {
        return this.productos.find(producto => producto.nombre === nombre);
    }

    renderizarProductosEnCarritoYContador() {
        const carProducts = document.querySelector('.car-products');
        const carritoIcon = document.getElementById('carrito-icon');
        const contadorCarrito = document.getElementById('cart-counter');

        contadorCarrito.textContent = this.carritoDeCompras.getCantidadTotal();

        if (this.carritoDeCompras.getProductos().length > 0) {
            carProducts.innerHTML = '';
            this.carritoDeCompras.getProductos().forEach(producto => {
                const productElement = document.createElement('div');
                productElement.classList.add('car-product');
                productElement.innerHTML = `
                    <div style="display: flex; align-items: center;">
                        <div class="product-image" style="flex: 1;">
                            <img src="assets/Imagenes/${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; max-width: 100%; max-height: 100%;">
                        </div>
                        <div class="product-name" style="flex: 2;">
                            <p>${producto.nombre}</p>
                        </div>
                        <div class="product-quantity" style="flex: 1; display: flex; align-items: center; justify-content: space-between;">
                            <button class="btn btn-sm btn-secondary decrease-quantity">-</button>
                            <span>${producto.cantidad}</span>
                            <button class="btn btn-sm btn-primary increase-quantity">+</button>
                        </div>
                    </div>
                `;
                carProducts.appendChild(productElement);

                const decreaseBtn = productElement.querySelector('.decrease-quantity');
                const increaseBtn = productElement.querySelector('.increase-quantity');
                const quantitySpan = productElement.querySelector('.product-quantity span');

                decreaseBtn.addEventListener('click', () => {
                    this.carritoDeCompras.quitarProducto(producto);
                    this.renderizarProductosEnCarritoYContador();
                });

                increaseBtn.addEventListener('click', () => {
                    producto.cantidad++;
                    quantitySpan.textContent = producto.cantidad;
                    contadorCarrito.textContent = this.carritoDeCompras.getCantidadTotal();
                });
            });
        } else {
            carProducts.innerHTML = '<p class="text-center">No hay artículos</p>';
        }

        carritoIcon.addEventListener('click', event => {
            event.preventDefault();
            carProducts.classList.toggle('active');
        });
    }

    mostrarProductosEnTienda(){

    }

    getPaginaActual() {
        return this.paginaActual;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tienda = new Tienda();
    tienda.cargarProductosSiNecesario('productos.csv')
        .then(() => {
            tienda.renderizarProductosEnCarritoYContador();
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
});
