class usuario {


    constructor(nombre,apellido,libros,mascota){
        this.nombre=nombre,
        this.apellido=apellido,
        this.libros=[libros],
        this.mascotas=[mascota]
    }

    getFullName(){
       console.log(this.nombre + " " + this.apellido) 
    }

    addMascotas(mascota){
        this.mascotas.push(mascota)
    }

    countMascotas(){
        console.log(this.mascotas.length) 
    }

    addBook(nombre,autor){
        this.libros.push({
            nombre : nombre,
            autor : autor,
        })

    }

    getBookNames(){
    let bookNames = [] 
    this.libros.forEach((e)=>{bookNames.push(e.nombre)})
    console.log(bookNames);

    }
}

const usuario1= new usuario("tomas","juarez",{nombre:"The black cat",autor:"Edgar Allan Poe"},"perro");


usuario1.addBook("Las aventuras de Sherlock Holmes" , "Arthur Conan Doyle");
usuario1.addMascotas("rinoceronte");
usuario1.getFullName();
usuario1.countMascotas();
usuario1.getBookNames();
