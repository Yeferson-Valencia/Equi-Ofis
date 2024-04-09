// Importar la clase CarritoDeCompras
import { CarritoDeCompras } from './Carro-Compras.js';
import { Producto } from './Shop.js';

export class shopSingle{
    constructor(producto){
        this.producto = producto 
    }

    main(carrito, producto){

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

        //Agregar producto al carrito 

        const btnCompras  = document.getElementById('btnCompras');
        btnCompras.addEventListener('click', (event) => {
            event.preventDefault();
            if (producto.cantidad === 0) {
                producto.cantidad = 1;
                carrito.agregarProducto(producto);
                actualizarCantidad();
                carrito.renderizarProductosEnCarritoYContador();

            }else{
                carrito.agregarProducto(producto);
                carrito.renderizarProductosEnCarritoYContador();
                producto.cantidad = carrito.getProductoPorNombre(producto.nombre).cantidad;
                actualizarCantidad();
                carrito.renderizarProductosEnCarritoYContador();
            }
        });
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
    console.log(productoJSON)
    if (productoJSON != null){

        const producto = new Producto(productoJSON.nombre, productoJSON.clase, productoJSON.subclase, productoJSON.ReferecnaiaExterna, productoJSON.imagen, productoJSON.cantidad)
        const productoMostrar = new shopSingle(producto)
        productoMostrar.main(carrito, producto)

    }else{
        const productoDefault = new Producto('sept_prodEspecializados_03', 'Puestos de Trabajo', 'Puestos de Trabajo', '', 'assets/Imagenes/Puestos de Trabajo/sept_prodEspecializados_03.jpg') 
        const productoMostrar = new shopSingle(productoDefault)
        productoMostrar.main(carrito, productoDefault)
    }
});

//Falta eliminar producto del carrito cuando su cantidad sea 0