const { min } = require("moment");

const productos = [
    { id:1, nombre:'Escuadra', precio:323.45 },
    { id:2, nombre:'Calculadora', precio:234.56 },
    { id:3, nombre:'Globo Terráqueo', precio:45.67 },
    { id:4, nombre:'Paleta Pintura', precio:456.78 },
    { id:5, nombre:'Reloj', precio:67.89 },
    { id:6, nombre:'Agenda', precio:78.90 }]


    const productsNames = ()=>{
        
        productos.forEach(element => {
        //nombreProducto = element.nombre + ' ,';
        //console.log(newString + nombreProducto)
        //aca hay algo raro
        //repasar for each 
            let newString = ''
            console.log(newString + element.nombre +' ,')
        });
    }

    //productsNames()
    const precioTotal = () =>{
       console.log( productos.reduce((prev,product)=>prev + product.precio,0 )) //en funciones flecha de una sola linea y return implicito las llaves bloquean la ejecucion ! 
    }

    const precioPromedio =()=>{
        let precios = [];
        productos.forEach(element => {
            precios.push(element.precio)
        });

        let precioFinal = precios.reduce((prev,num)=>prev+num ,0 )
        let precioPromedio = precioFinal / precios.length;
        console.log(precioPromedio)
    }



    const findMinor = ()=>{
        let precios = [];
    
        productos.forEach(element => {
            precios.push(element.precio)
        });

        let minimo = precios[0] ;

        for (let i = 1; i < precios.length; i++) {
            
            if (precios[i] < minimo ) {
                minimo = precios[i]
            }
        }
        console.log(minimo)
    }

    const findMayor = ()=>{
        let precios = [];

        productos.forEach(element => {
            precios.push(element.precio)
        });

        let mayor = precios[0]  
        
        for (let i= 0; i < precios.length; i++) {
            if (precios[i] > mayor) {
                mayor = precios[i]                
            }
        }

        console.log(mayor)

    }

    const resultado = {
        a: productsNames(),
        b:precioTotal(),
        c: precioPromedio(),
        d: findMinor(),
        e: findMayor()
    }

    productsNames();
    precioTotal();
    precioPromedio();
    findMinor()
    findMayor()
    console.log(resultado);

    //console.log(productos.reduce((prev,product)=>{prev + product.precio},0))

    
