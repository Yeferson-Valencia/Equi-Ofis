import { CarritoDeCompras } from './Carro-Compras.js';
import { Producto, Tienda } from './Shop.js';

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
            // Obtener tres productos aleatorios de la tienda
            const productosTienda = tienda.productos.sort(() => Math.random() - 0.5).slice(0, 3);

            // Obtener el contenedor de productos estrella
            const productosEstrellaContainer = document.getElementById('productos-estrella');

            // Frases de los más vendidos
            const frasesMasVendidos = ['Ambientes Corporativos', 'Mobiliario Ergonómico', 'Espacios Colaborativos'];

            // Iterar sobre los productos de la tienda y crear los elementos de tarjeta
            productosTienda.forEach((producto, index) => {
                // Crear la tarjeta
                const tarjeta = document.createElement('div');
                tarjeta.classList.add('col-12', 'col-md-4', 'mb-4');

                // Crear el enlace de la imagen
                const enlaceImagen = document.createElement('a');
                enlaceImagen.href = `shop-single.html?producto=${encodeURIComponent(JSON.stringify(producto))}`;

                // Crear la imagen
                const imagen = document.createElement('img');
                imagen.src = producto.imagen;
                imagen.classList.add('card-img-top', 'img-fluid');
                imagen.alt = 'Producto';
                imagen.style.height = '300px'; // Ajustar la altura de la imagen

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

                // Crear el texto de reviews
                const textoReviews = document.createElement('p');
                textoReviews.classList.add('text-muted');
                textoReviews.textContent = frasesMasVendidos[index]; // Usar la frase correspondiente al producto

                // Añadir los elementos al cuerpo de la tarjeta
                cuerpoTarjeta.appendChild(textoReviews);

                // Añadir el enlace de la imagen y el cuerpo de la tarjeta a la tarjeta
                tarjeta.appendChild(enlaceImagen);
                tarjeta.appendChild(cuerpoTarjeta);

                // Añadir la tarjeta al contenedor de productos estrella
                productosEstrellaContainer.appendChild(tarjeta);
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });

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
