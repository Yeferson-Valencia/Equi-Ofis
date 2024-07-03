// Importar la clase CarritoDeCompras
import { CarritoDeCompras } from './Carro-Compras.js';

const carrito = new CarritoDeCompras(); // Crear una instancia de CarritoDeCompras

// Cargar productos del almacenamiento local
carrito.cargarProductosDelAlmacenamientoLocal();

// Renderizar el carrito al cargar la página
carrito.renderizarProductosEnCarritoYContador();

document.addEventListener('DOMContentLoaded', function () {
    // // Abrir automáticamente la ventana modal al cargar la página
    // var myModal = new bootstrap.Modal(document.getElementById('imageModal'), {
    //     keyboard: true
    // });
    // // myModal.show();

    // // Funcionalidad para volver a abrir la ventana modal
    // document.getElementById('openModalButton').addEventListener('click', function () {
    //     myModal.show();
    // });

    // Escuchar el evento de envío del formulario
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        // Obtener los valores del formulario
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;

        // Construir el mensaje de WhatsApp
        const whatsappMessage = `Estimado(a) señor(a), mi nombre es ${name}. Me dirijo a usted con el propósito de obtener información sobre: "${message}". Agradezco de antemano su atención y quedo a la espera de su respuesta en mi correo electrónico: ${document.getElementById('email').value}. Muchas gracias por su tiempo.`;

        // Determinar si es dispositivo móvil o de escritorio
        const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Construir el enlace de WhatsApp
        let url = '';
        if (esMovil) {
            // Si es un dispositivo móvil, abrir en la aplicación de WhatsApp
            url = `https://wa.me/573115288907?text=${encodeURIComponent(whatsappMessage)}`;
        } else {
            // Si es un dispositivo de escritorio, abrir en WhatsApp Web
            url = `https://web.whatsapp.com/send?phone=573115288907&text=${encodeURIComponent(whatsappMessage)}`;
        }

        // Abrir el enlace en una nueva ventana
        window.open(url, '_blank');
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
