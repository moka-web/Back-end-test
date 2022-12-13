const FileContainer = require("../../contenedores/FileContainer");



class cartDaoFiles extends FileContainer {
    constructor() {
        super(`carts.json`);
    }

    deleteCartProduct = async (id, prodId) => {
        const cart = await this.getById(Number(id));
        const newCartArr = cart.products.filter(
            (prod) => prod.id !== Number(prodId)
        );
        cart.products = [...newCartArr];
        await this.updateItem(id, cart);
        return;
    };

    getCartProducts = async (id) => {
        const cart = await this.getById(Number(id));
        return cart.products;
    };

    //recibe el id del carrito y le pushea el producto 
    addCartProduct = async (id, prod) => {
        try {
            const cart = await this.getById(id);

            cart.products.push(prod);
            await this.modify(id, cart);
            return;
            
        } catch (error) {
            console.log(error.message)
        }
    };

   
}

module.exports = cartDaoFiles;
