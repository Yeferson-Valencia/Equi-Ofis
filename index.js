// Importar la clase CarritoDeCompras
import { CarritoDeCompras } from './Carro-Compras.js';
import { Producto,  Tienda } from './Shop.js';

document.addEventListener('DOMContentLoaded', () => {
    const carrito = new CarritoDeCompras(); // Crear una instancia de CarritoDeCompras
    const tienda = new Tienda();

    // Cargar productos del almacenamiento local
    carrito.cargarProductosDelAlmacenamientoLocal();

    // Renderizar el carrito al cargar la página
    carrito.renderizarProductosEnCarritoYContador();

    // Cargar productos desde el archivo CSV y renderizar los productos estrella
    tienda.cargarProductosDesdeCSV('productos.csv')
        .then(() => {
            // Obtener los primeros 3 productos de la tienda
            const productosTienda = tienda.productos.slice(0, 3);

            // Obtener el contenedor de productos estrella
            const productosEstrellaContainer = document.getElementById('productos-estrella');

            // Iterar sobre los productos de la tienda y crear los elementos de tarjeta
            productosTienda.forEach(producto => {
                // Crear un div de columna
                const columna = document.createElement('div');
                columna.classList.add('col-12', 'col-md-4', 'mb-4');

                // Crear la tarjeta
                const tarjeta = document.createElement('div');
                tarjeta.classList.add('card', 'h-100');

                // Crear el enlace de la imagen
                const enlaceImagen = document.createElement('a');
                enlaceImagen.href = `shop-single.html?producto=${encodeURIComponent(JSON.stringify(producto))}`;

                // Crear la imagen
                const imagen = document.createElement('img');
                imagen.src = producto.imagen;
                imagen.classList.add('card-img-top');
                imagen.alt = 'Producto';

                // Añadir la imagen al enlace de la imagen
                enlaceImagen.appendChild(imagen);

                // Crear el cuerpo de la tarjeta
                const cuerpoTarjeta = document.createElement('div');
                cuerpoTarjeta.classList.add('card-body');

                // Crear el título del producto
                const tituloProducto = document.createElement('a');
                tituloProducto.href = `shop-single.html?producto=${encodeURIComponent(JSON.stringify(producto))}`;
                tituloProducto.classList.add('h2', 'text-decoration-none', 'text-dark');
                tituloProducto.textContent = producto.nombre;

                // Crear el texto de la tarjeta
                const textoTarjeta = document.createElement('p');
                // textoTarjeta.classList.add('card-text');
                // textoTarjeta.textContent = 'Los mas vendidos';

                // Crear el texto de reviews
                const textoReviews = document.createElement('p');
                textoReviews.classList.add('text-muted');
                textoReviews.textContent = `Los mas vendidos`;

                // Añadir los elementos al cuerpo de la tarjeta
                cuerpoTarjeta.appendChild(tituloProducto);
                cuerpoTarjeta.appendChild(textoTarjeta);
                cuerpoTarjeta.appendChild(textoReviews);

                // Añadir el enlace de la imagen y el cuerpo de la tarjeta a la tarjeta
                tarjeta.appendChild(enlaceImagen);
                tarjeta.appendChild(cuerpoTarjeta);

                // Añadir la tarjeta a la columna
                columna.appendChild(tarjeta);

                // Añadir la columna al contenedor de productos estrella
                productosEstrellaContainer.appendChild(columna);
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
});
