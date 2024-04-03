const csv = require('csv-parser');
const fs = require('fs');

const resultados = [];

fs.createReadStream('productos.csv')
  .pipe(csv())
  .on('data', (data) => resultados.push(data))
  .on('end', () => {

    //Exportar funciones
    module.exports.buscarProducto = buscarProducto;
    module.exports.buscarClase = buscarClase;

    //Exportar resultados
    module.exports.resultados = resultados;

  });

// Función para buscar un producto específico
function buscarProducto(nombreProducto) {
  let producto = resultados.find(producto => producto.Nombre === nombreProducto);
  return producto;
}

// Función para buscar una clase de productos
function buscarClase(claseProducto) {
  let productosClase = resultados.filter(producto => producto.Clase === claseProducto);
  return productosClase;
}

