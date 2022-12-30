const fs = require("fs");
const logger = require("../../config/winston");

class FileContainer {
    constructor(filename) {
        this.filename = `${__dirname}/${filename}`;
    }
 // ???????
    saveItems = async (newArr) => {
        try {
            await fs.promises.writeFile(
                this.filename,
                JSON.stringify(newArr, null, 2)
            );
        } catch (err) {
            throw new Error(err);
        }
    };

    getAll = async () => {
       
        let arr;
        try {
            const file = await fs.promises.readFile(this.filename, "utf-8");
            if (!file) arr = [];
            else arr = JSON.parse(file);
        } catch (err) {
           logger.error(err)
        }
        return arr;
    };

    getById = async (id) => {
        try {
        let arr = await this.getAll(this.filename);
        let item = arr.find((o) => o._id == id);
        return item;
        } catch (error) {
            logger.error(error)
        }
        
    };

    save = async (item) => {
        const itemArr = await this.getAll(this.filename);
        const lastId = itemArr.length > 0 ? itemArr[itemArr.length - 1].id : 0;
        item.id = lastId + 1;
        item.created_at = Date.now();
        itemArr.push(item);
        this.saveItems(itemArr);
        return item.id;
    };

    modify = async (id, newItem) => {
        try {
            const itemArr = await this.getAll();
           
            const newArr = itemArr.map((item) => {
                if (id !== item._id) return item;
                else {
                    return Object.assign(item, newItem);
                }
            });
            this.saveItems(newArr);
            return;
        } catch (error) {
            logger.error(error.message)
        }
      
    };

    deleteById= async (id) => {
        const itemArr = await this.getItems();
        const newArr = itemArr.filter((item) => item.id !== Number(id));
        this.saveItems(newArr);
        return;
    };
}

module.exports = FileContainer;
