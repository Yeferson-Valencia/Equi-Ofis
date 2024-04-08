// Importar la clase CarritoDeCompras
import { CarritoDeCompras } from './Carro-Compras.js';
import { Producto } from './Shop.js';

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
    const { nombre, clase, subclase, referenciaExterna, imagen } = productoJSON;
    console.log(productoJSON);
    const producto = new Producto(nombre, clase, subclase, referenciaExterna, imagen);
    
    // Seleccionar los elementos del DOM donde quieres mostrar la información del producto
    const imagenProducto = document.querySelector('#product-detail');
    const nombreProducto = document.querySelector('#product-name');
    const varValue = document.getElementById('var-value');
    const cantidadProducto = document.getElementById('product-quanity');

    // Establecer el contenido de los elementos al valor correspondiente del producto
    imagenProducto.src = producto.imagen; // Corrección: Utilizar directamente el atributo 'imagen'
    nombreProducto.textContent = producto.nombre; // Corrección: Acceder directamente al atributo 'nombre'
    cantidadProducto.textContent = producto.cantidad; // Corrección: Acceder directamente al atributo 'cantidad'
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');

    // Event listener para el botón de menos
    btnMinus.addEventListener('click', () => {
        producto.cantidad--;
        actualizarCantidad();
    });

    // Event listener para el botón de más
    btnPlus.addEventListener('click', () => {
        producto.cantidad++;
        actualizarCantidad();
    });

    // Función para actualizar la cantidad en el DOM
    function actualizarCantidad() {
        varValue.textContent = producto.cantidad;
        cantidadProducto.value = producto.cantidad;
        btnMinus.disabled = producto.cantidad === 0; // Deshabilitar botón de menos cuando la cantidad es cero
    }

    // Llamar a la función para inicializar la cantidad
    actualizarCantidad();

    //Agregar producto al carrito 

    const btnAgregarAlCarrito = document.getElementById('btn-add-to-cart');
});
