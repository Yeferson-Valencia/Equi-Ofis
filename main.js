// URL del archivo CSV
const url = 'productos.csv';

// Hacer una solicitud fetch para obtener el archivo CSV
fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo CSV');
    }
    return response.text();
  })
  .then(data => {
    // Divide los datos por líneas y crea un array de productos, omitiendo la primera línea que contiene los nombres de las columnas
    const lines = data.split('\n').slice(1); // Omitir la primera línea
    const productos = lines.map(line => {
      const [nombre, clase, subclase, referenciaExterna, ruta] = line.split(',');
      return { Nombre: nombre, Clase: clase, Subclase: subclase, Referencia_Externa: referenciaExterna, Ruta: ruta };
    });

    // Función para mostrar los productos en tarjetas y la paginación con botones de flechas
    function mostrarProductos(productos, paginaActual) {
        // Obtén el contenedor de productos
        const contenedor = document.querySelector('.col-lg-9');

        // Limpia el contenedor
        contenedor.innerHTML = '';

        // Filtra los productos por categoría si existe una categoría seleccionada
        const categoriaSeleccionada = document.querySelector('.category-link.active');
        const productosFiltrados = categoriaSeleccionada ? productos.filter(producto => producto.Clase === categoriaSeleccionada.textContent) : productos;

        // Calcula el número de columnas según el tamaño de la pantalla
        const numColumnas = 3; // Mostrar tres imágenes por fila

        // Calcula el índice inicial y final de los productos para la página actual
        const inicio = (paginaActual - 1) * 12;
        const fin = Math.min(inicio + 12, productosFiltrados.length);

        // Recorre los productos para la página actual
        let fila = document.createElement('div');
        fila.classList.add('row', 'mb-4');
        for (let i = inicio; i < fin; i++) {
            const producto = productosFiltrados[i];
            const path = 'assets/Imagenes/' + producto.Ruta;
            const nombre = producto.Nombre;

            // Crea la tarjeta de producto
            const tarjeta = `
                <div class="col-md-${12 / numColumnas}">
                    <div class="card mb-4 product-wap rounded-0" style="width: 100%; height: 100%;">
                        <div class="card rounded-0">
                            <img class="card-img rounded-0 img-fluid" src="${path}" style="max-width: 100%; max-height: 200px; height: auto;">
                            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                <ul class="list-unstyled">
                                    <li><a class="btn btn-success text-white" href="shop-single.html"><i class="far fa-heart"></i></a></li>
                                    <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="far fa-eye"></i></a></li>
                                    <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="fas fa-cart-plus"></i></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="card-body">
                            <a href="shop-single.html" class="h3 text-decoration-none">${nombre}</a>
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

        // Calcula el número total de páginas
        const numPaginas = Math.ceil(productosFiltrados.length / 12);

        // Habilita o deshabilita los botones de navegación según la página actual
        prevPageButton.disabled = paginaActual === 1;
        nextPageButton.disabled = paginaActual === numPaginas;

        // Agrega los event listeners a los botones de navegación
        prevPageButton.addEventListener('click', () => {
            if (paginaActual > 1) {
                mostrarProductos(productosFiltrados, paginaActual - 1);
            }
        });

        nextPageButton.addEventListener('click', () => {
            if (paginaActual < numPaginas) {
                mostrarProductos(productosFiltrados, paginaActual + 1);
            }
        });
    }

    // Llama a la función para mostrar los productos
    mostrarProductos(productos, 1); // Mostrar la primera página por defecto

    // Obtener los elementos de la lista de categorías
    const categoryLinks = document.querySelectorAll('.category-link');

    // Agregar event listener a cada elemento de la lista
    categoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Evitar el comportamiento predeterminado del enlace
            event.preventDefault();

            // Eliminar la clase 'active' de todos los enlaces de categoría
            categoryLinks.forEach(link => link.classList.remove('active'));

            // Agregar la clase 'active' al enlace de categoría seleccionado
            link.classList.add('active');

            // Llamar a la función para mostrar los productos filtrados por la categoría seleccionada en la página 1
            mostrarProductos(productos, 1);
        });
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
