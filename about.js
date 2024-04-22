// Importar la clase CarritoDeCompras
import { CarritoDeCompras } from './Carro-Compras.js';

document.addEventListener('DOMContentLoaded', () => {
    const carrito = new CarritoDeCompras(); // Crear una instancia de CarritoDeCompras

    // Cargar productos del almacenamiento local
    carrito.cargarProductosDelAlmacenamientoLocal();

    // Renderizar el carrito al cargar la página
    carrito.renderizarProductosEnCarritoYContador();

    // Variable para controlar si la ventana modal ha sido abierta
    let modalAbierto = false;

    // Abrir automáticamente la ventana modal al cargar la página
    const myModal = new bootstrap.Modal(document.getElementById('imageModal'), {
        keyboard: true
    });
    myModal.show();
    modalAbierto = true;

    // Funcionalidad para volver a abrir la ventana modal
    document.getElementById('openModalButton').addEventListener('click', function () {
        if (!modalAbierto) {
            myModal.show();
            modalAbierto = true;
        }
    });
});
