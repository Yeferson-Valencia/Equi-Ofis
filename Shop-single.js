import { CarritoDeCompras } from './Carro-Compras.js';
import { Producto } from './Shop.js';

class ShopSingle {
    constructor(producto, carrito) {
        this.producto = producto;
        this.carrito = carrito;
        this.productos = [];
        this.currentIndex = 0;
        this.imagenProducto = document.querySelector('#product-detail');
        this.varValue = document.getElementById('var-value');
        this.btnMinus = document.getElementById('btn-minus');
        this.btnPlus = document.getElementById('btn-plus');
        this.btnPrev = document.getElementById('btn-prev');
        this.btnNext = document.getElementById('btn-next');

        this.btnMinus.addEventListener('click', this.onMinusClick.bind(this));
        this.btnPlus.addEventListener('click', this.onPlusClick.bind(this));
        this.btnPrev.addEventListener('click', this.onPrevClick.bind(this));
        this.btnNext.addEventListener('click', this.onNextClick.bind(this));
    }

    async main() {
        try {
            if (this.productos.length === 0) {
                this.productos = await this.cargarProductosDesdeCSV('productos.csv');
            }
            this.actualizarInterfaz();
        } catch (error) {
            console.error('Error al cargar y filtrar los productos:', error);
        }
    }

    actualizarInterfaz() {
        const producto = this.productos[this.currentIndex];
        this.imagenProducto.src = producto.imagen;
        this.varValue.textContent = producto.cantidad;
        this.btnMinus.disabled = (producto.cantidad === 0);
    }

    onMinusClick() {
        if (this.productos[this.currentIndex].cantidad > 0) {
            this.productos[this.currentIndex].cantidad--;
            this.actualizarInterfaz();
            this.actualizarCantidad();
        }
    }

    onPlusClick() {
        this.productos[this.currentIndex].cantidad++;
        this.actualizarInterfaz();
        this.actualizarCantidad();
    }

    onPrevClick() {
        this.currentIndex = (this.currentIndex - 1 + this.productos.length) % this.productos.length;
        this.actualizarInterfaz();
    }

    onNextClick() {
        this.currentIndex = (this.currentIndex + 1) % this.productos.length;
        this.actualizarInterfaz();
    }

    async cargarProductosDesdeCSV(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo CSV');
            }
            const data = await response.text();
            const lines = data.split('\n').slice(1);
            return lines.map(line => {
                const [nombre, clase, subclase, referenciaExterna, ruta] = line.split(',');
                const imagen = 'assets/Imagenes/' + ruta;
                return new Producto(nombre, clase, subclase, referenciaExterna, imagen);
            });
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            throw error;
        }
    }

    actualizarCantidad() {
        const producto = this.productos[this.currentIndex];
        const productoEnCarrito = this.carrito.getProductoPorNombre(producto.nombre);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad = producto.cantidad;
        } else {
            console.log('No hay productos en el carrito');
            this.carrito.agregarProducto(producto);
        }
        this.carrito.renderizarProductosEnCarritoYContador();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const carrito = new CarritoDeCompras();
    carrito.cargarProductosDelAlmacenamientoLocal();
    carrito.renderizarProductosEnCarritoYContador();
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productoString = urlParams.get('producto');

    let producto;
    if (productoString != null) {
        const productoJSON = JSON.parse(decodeURIComponent(productoString));
        producto = new Producto(productoJSON.nombre, productoJSON.clase, productoJSON.subclase, productoJSON.ReferenciaExterna, productoJSON.imagen, productoJSON.cantidad);
    } else {
        producto = new Producto('sept_prodEspecializados_03', 'Puestos de Trabajo', 'Puestos de Trabajo', '', 'assets/Imagenes/Puestos de Trabajo/sept_prodEspecializados_03.jpg');
    }

    const shop = new ShopSingle(producto, carrito);
    await shop.main();
});
