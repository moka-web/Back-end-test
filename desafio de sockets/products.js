const Router = require("koa-router");
const router = new Router({ prefix: "/products" });
module.exports = { products: router };

let products = [
  {
    id: "101",
    name: "Pelota",
    price: 100,
    stock: 10,
    thumbnail: "www.google.com/pelota",
  },
  {
    id: "102",
    name: "Heladera",
    price: 1500,
    stock: 100,
    thumbnail: "www.google.com/heladera",
  },
];

/* API REST Get All */
router.get("/", (ctx) => {
  ctx.body = {
    status: "success",
    message: products,
  };
});

/* API REST Get x ID */
router.get("/:id", (ctx) => {
  const id = ctx.params.id;
  const productById = products.find((product) => product.id === id);
  if (productById) {
    ctx.body = productById;
  } else {
    ctx.response.status = 404;
    ctx.body = {
      status: "error!",
      message: "product Not Found with that id!",
    };
  }
});

/* API REST Post */
router.post("/", (ctx) => {
 
  if (
    !ctx.request.body.name ||
    !ctx.request.body.price ||
    !ctx.request.body.stock ||
    !ctx.request.body.thumbnail
  ) {
    ctx.response.status = 400;
    ctx.body = {
      status: "error",
      message: "Please enter the all the inputs",
    };
  } else {
    products.push({
      id: parseInt(products[products.length - 1].id) + 1,
      name: ctx.request.body.name,
      price: ctx.request.body.author,
      stock: ctx.request.body.stock,
      thumbnail: ctx.request.body.thumbnail,
    });
    ctx.response.status = 201;
    ctx.body = {
      status: "success",
      message: `New product added with id: ${
        parseInt(products[products.length - 1].id) + 1
      } & name: ${ctx.request.body.name}`,
    };
  }
});

// /* API REST Put */
router.put("/:id", (ctx) => {
  // Check if any of the data field not empty
  console.log(typeof ctx.params.id);
  const id = ctx.params.id;
  const index = products.findIndex((product) => product.id == id);
  console.log(index);

  if (products[index]) {
    products[index] = {
      ...products[index],
      ...ctx.request.body,
    };
    ctx.response.status = 201;
    ctx.body = { message: "Products Updated", product: products[index] };
  } else {
    ctx.response.status = 404;
    ctx.body = {
      status: "error!",
      message: "product Not Found with that id!",
    };
  }
});
// /* API REST Delete */
router.delete("/:id", (ctx) => {
  const id = ctx.params.id;
  // const index = products.findIndex((product) => product.id == id);
  // products.splice(index, 1);
  // ctx.response.status = 200;

  const productToDelete = products.find((product) => product.id === id);

  if (productToDelete) {
    products = products.filter((product) => product.id !== id);
    ctx.response.status = 200;
    ctx.body = {
      status: "success",
      message: `product deleted with id: ${id}`,
    };
  } else {
    ctx.response.status = 404;
    ctx.body = {
      status: "error!",
      message: "product Not Found with that id!",
    };
  }
});