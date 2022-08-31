const fs = require("fs")

class contenedor {
    
     constructor(file,){
        this.file=file
     }

     save= async (object)=>{
        try {
            let data = await fs.promises.readFile(this.file,"utf-8")
            let parsedData

            try {
                parsedData = await JSON.parse(data)
            } catch (error) {
                parsedData = []
            }
            if(parsedData.length > 0){
                object.id = parsedData[parsedData.length-1].id + 1;
                parsedData.push(object)
                await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
                console.log(object.id) 
            } else{
                parsedData = []
                object.id = 1
                parsedData.push(object)
                await fs.promises.writeFile(this.file, JSON.stringify(parsedData, null, 2))
                console.log(object.id)
            }

        } catch (error) {
            console.log(error)
        }

     }

     getById= async (id)=>{
         try {
             let data = await fs.promises.readFile(this.file,"utf-8");
             let parsedData = await JSON.parse(data)
             if(parsedData.find(e=>e.id === id)) {
              return parsedData.find(e=>e.id === id)
             } else {
                console.log('el elemento no existe')
             }
             
         } catch (error) {
             console.error(error)
             
         }

     }

     getAll= async()=>{
         try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parsedData = await JSON.parse(data)
           return parsedData 
         } catch (error) {
             console.error(error)
         }

     }

     deleteById= async (id)=>{
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parseData = await JSON.parse(data)
            if (parseData.some(e=>e.id === id)) {
                let obj = parseData.find(e=>e.id===id)
                let objPosition = parseData.indexOf(obj)
                parseData.splice(objPosition,1)
                fs.promises.writeFile(this.file, JSON.stringify(parseData, null, 2))
                console.log('el objeto fue eliminado')
            }
            
        } catch (error) {
            console.error(error)
        }
            
        
     }
     deleteAll= async()=>{
        try {
            await fs.promises.writeFile(this.file, JSON.stringify([]))
            console.log('el contenedor esta vacio')
            
        } catch (error) {
            console.error(error)
        }
     }

     getRandomProduct = async()=>{
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parseData = await JSON.parse(data)
            let randomIndex = Math.floor(Math.random()*parseData.length)
            let randomProduct = parseData[randomIndex]
            return randomProduct
            
        } catch (error) {
            console.log(error)
        }
     }

     updateProduct= async(id,obj)=>{
        try {
            let data = await fs.promises.readFile(this.file, "utf-8")
            let parseData = await JSON.parse(data)
            let productIndex = parseData.findIndex(products=> products.id === id)

            if (parseData[productIndex]) {
                parseData[productIndex] = { ...parseData[productIndex],...obj}
                await fs.promises.writeFile(this.file, JSON.stringify(parseData, null, 2))
            } else{
                console.error("no se encontro el producto que quieres actualizar")
            }
          return parseData[productIndex]
        } catch (error) { 
        }
     }
     
}

module.exports = contenedor

const originals = {
    name: "Adidas Originals",
    price: 30000,
    thumbnail: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7ed0855435194229a525aad6009a0497_9366/Zapatillas_Superstar_Blanco_EG4958_01_standard.jpgd"
}
const jordans = {
    name: "Air Jordan 4 Retro Kaws",
    price: 100000,
    thumbnail: "https://cdn-images.farfetch-contents.com/12/95/91/37/12959137_13486346_1000.jpg"
}
const airForce = {
    name: "Nike Air-Force",
    price: 25000,
    thumbnail: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7ed0855435194229a525aad6009a0497_9366/Zapatillas_Superstar_Blanco_EG4958_01_standard.jpgd"
}

const archivo = new contenedor ("archivo.txt");

//archivo.deleteAll();
//archivo.save(airForce);
//archivo.save(originals)
//archivo.save(jordans)
//archivo.getAll()
