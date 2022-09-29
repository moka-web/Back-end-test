
const  {generarProducto} = require('../utils/generadorDeProductos');
const {generarId}= require('../utils/generadorDeIds')

class apiMock{
    popular(cant = 5) {
        const nuevos = [];
        for (let i = 0; i < cant; i++) {
          const nuevoProducto = generarProducto(generarId());
          nuevos.push(nuevoProducto);
        }
        return nuevos;
      }
}

module.exports = apiMock