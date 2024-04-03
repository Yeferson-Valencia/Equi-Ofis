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
    // Divide los datos por líneas y crea un array de productos
    const lines = data.split('\n');
    const productos = lines.map(line => {
      const [nombre, clase, subclase, referenciaExterna, ruta] = line.split('\t');
      return { Nombre: nombre, Clase: clase, Subclase: subclase, Referencia_Externa: referenciaExterna, Ruta: ruta };
    });

    // Llama a la función para mostrar los productos
    //mostrarProductos(productos);
    console.log(productos);
  })
  .catch(error => {
    console.error('Error:', error);
});