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
        this.rutaBaseImagenes = 'assets/Imagenes/'; // Ruta base para las imágenes
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
            if (this.carritoDeCompras.getProductos().length > 0) {
                carProductsList.innerHTML = '';
                this.carritoDeCompras.getProductos().forEach(producto => {
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
                        this.carritoDeCompras.quitarProducto(producto);
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
            const cantidadTotal = this.carritoDeCompras.getCantidadTotal();
            carritoCounter.textContent = cantidadTotal;
        };

        renderizarProductosEnCarrito();
        actualizarContador();
    }
    renderizarProductos(productos, filtro = null) {
        // Obtén el contenedor de productos
        const contenedor = document.querySelector('.col-lg-9');

        // Limpia el contenedor
        contenedor.innerHTML = '';

        // Filtra los productos según el filtro si está definido
        if (filtro) {
            productos = productos.filter(producto => producto.clase === filtro || producto.subclase === filtro);
        }
    
        // Calcula el número de columnas según el tamaño de la pantalla
        const numColumnas = 4; // Mostrar cuatro imágenes por fila
    
        // Calcula el número total de páginas
        const numPaginas = Math.ceil(productos.length / 12);
    
        // Determina la página actual
        let paginaActual = 1;
        const urlParams = new URLSearchParams(window.location.search);
        const pagina = parseInt(urlParams.get('pagina'));
        if (!isNaN(pagina) && pagina > 0 && pagina <= numPaginas) {
            paginaActual = pagina;
        }
    
        // Calcula el índice inicial y final de los productos para la página actual
        const inicio = (paginaActual - 1) * 12;
        const fin = Math.min(inicio + 12, productos.length);
    
        // Recorre los productos para la página actual
        let fila = document.createElement('div');
        fila.classList.add('row', 'mb-4');
        for (let i = inicio; i < fin; i++) {
            console.log(productos)
            const producto = productos[i];
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
                                    <li><a class="btn btn-success text-white mt-2 image-gallery-add-to-cart" href="#" onclick="addToCartAndRedirect(${JSON.stringify(producto)})"><i class="far fa-eye"></i></a></li>
                                    <li><a class="btn btn-success text-white mt-2 image-gallery-add-to-cart" href="#" onclick="addToCartAndRedirect(${JSON.stringify(producto)})"><i class="fas fa-cart-plus"></i></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="card-body">
                            <a href="shop-single.html?image=${encodeURIComponent(path)}&name=${encodeURIComponent(nombre)}" class="h3 text-decoration-none">${nombre}</a>
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
    
        // Implementa el cambio de página con los botones de navegación
        const prevPageButton = document.getElementById('prevPage');
        const nextPageButton = document.getElementById('nextPage');
    
        // Habilita o deshabilita los botones de navegación según la página actual
        prevPageButton.disabled = paginaActual === 1;
        nextPageButton.disabled = paginaActual === numPaginas;
    
        // Agrega los event listeners a los botones de navegación
        prevPageButton.addEventListener('click', () => {
            if (paginaActual > 1) {
                const nuevaPagina = paginaActual - 1;
                window.location.href = `shop.html?pagina=${nuevaPagina}`;
            }
        });
    
        nextPageButton.addEventListener('click', () => {
            if (paginaActual < numPaginas) {
                const nuevaPagina = paginaActual + 1;
                window.location.href = `shop.html?pagina=${nuevaPagina}`;
            }
        });
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    const tienda = new Tienda();
    tienda.cargarProductosDesdeCSV('productos.csv')
        .then(() => {
            // Resto del código sigue igual...
            tienda.renderizarProductos(tienda.getProductos());

            // Event listener para el enlace de clase
            const claseLink = document.querySelector('.clase-link');
            claseLink.addEventListener('click', () => {
                const filtro = claseLink.textContent.trim(); // Obtener el valor del filtro (nombre de la clase)
                tienda.renderizarProductos(tienda.getProductos(), filtro);
            });

            // Event listener para los enlaces de subclase
            const subclaseLinks = document.querySelectorAll('.subclase-link');
            subclaseLinks.forEach(subclaseLink => {
                subclaseLink.addEventListener('click', () => {
                    const filtro = subclaseLink.textContent.trim(); // Obtener el valor del filtro (nombre de la subclase)
                    tienda.renderizarProductos(tienda.getProductos(), filtro);
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
});
