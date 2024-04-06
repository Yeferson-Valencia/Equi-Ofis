// Variable global para el contador del carrito
let cartCounter = 0;

// Función para agregar un producto al carrito y actualizar el contador
function addToCartAndRedirect(imagePath, productName) {
    // Lógica para agregar el producto al carrito
    cartCounter += 1;

    // Actualizar el contador del carrito en el top-nav
    const cartCounterElement = document.getElementById('cart-counter');
    if (cartCounterElement) {
        cartCounterElement.textContent = cartCounter.toString();
    }

    // Redireccionar a la página de shop-single con la imagen y el nombre del producto
    const url = `shop-single.html?image=${encodeURIComponent(imagePath)}&name=${encodeURIComponent(productName)}`;
    window.location.href = url;
}
