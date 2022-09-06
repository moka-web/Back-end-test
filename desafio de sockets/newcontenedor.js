
class container  {
    constructor(options , table){
        this.knex = options,
        this.table = table
    }


    save = (object)=>{
        let save = this.knex(this.table).insert(object)
        .then((res)=>{
            console.log(res)
        })
        .catch((e)=>{
            console.error(e)
        })

        return save
    }

    getAll = async ()=>{
        let result = [];
        await this.knex(this.table).select('*')
        .then((res) => (result = [...res]))
        .catch((e)=>{console.error(e)})
        .finally(()=>this.knex.destroy)

        return result
        
    }


    getById = async (id)=>{
        let result;
        await this.knex(this.table).select("*")
        .where("id",id)
        .then((res)=>(result = res))
        .catch((e)=>{
            console.error(e)
        })
        .finally(()=>{
            this.knex.destroy
        })

        return result
    }

    deleteById = (id)=>{
        let objectdelete = this.knex(this.table).where({ id: id})
        .del()

        return this.knex(this.table).select('*')
    }

    deleteAll = ()=>{
        let deleted = this.knex(this.table).del()

        return deleted
    }

    update = async ()=>{

       await this.knex(this.table).where({ 'id' : id})
       .update({ name , price , stock });

       return {
        mensaje : 'producto actualizado',
        name,
        price,
        stock
       }

    }


}

module.exports = container;