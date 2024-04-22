// Importar la clase CarritoDeCompras
import { CarritoDeCompras } from './Carro-Compras.js';

const carrito = new CarritoDeCompras(); // Crear una instancia de CarritoDeCompras

// Cargar productos del almacenamiento local
carrito.cargarProductosDelAlmacenamientoLocal();

// Renderizar el carrito al cargar la página
carrito.renderizarProductosEnCarritoYContador();

document.addEventListener('DOMContentLoaded', function () {
    // Abrir automáticamente la ventana modal al cargar la página
    var myModal = new bootstrap.Modal(document.getElementById('imageModal'), {
        keyboard: true
    });
    myModal.show();

    // Funcionalidad para volver a abrir la ventana modal
    document.getElementById('openModalButton').addEventListener('click', function () {
        myModal.show();
    });
});