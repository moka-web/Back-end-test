import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import crypto from "crypto";
import cors from "cors";
const schema = buildSchema(`
  type Product {
    id: ID!
    name: String,
    price: Int,
    stock: Int,
    thumbnail: String,
  }
  input ProductInput {
    name: String,
    price: Int,
    stock: Int,
    thumbnail: String,
  }
  type Query {
    getProduct(id: ID!): Product,
    getProducts(campo: String, valor: String): [Product],
  }
  type Mutation {
    createProduct(datos: ProductInput): Product
    updateProduct(id: ID!, datos: ProductInput): Product,
    deleteProduct(id: ID!): Product,
  }
`);

class Product {
  constructor(id, { name, price, stock, thumbnail }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.thumbnail = thumbnail;
  }
}

const productMap = {};

function getProducts({ campo, valor }) {
  const product = Object.values(productMap);
  console.log(product);
  if (campo && valor) {
    return product.filter((p) => p[campo] == valor);
  } else {
    return product;
  }
}

function getProduct({ id }) {
  if (!productMap[id]) {
    throw new Error("Product not found.");
  }
  return productMap[id];
}

function createProduct({ datos }) {
  const id = crypto.randomBytes(10).toString("hex");
  const newProduct = new Product(id, datos);
  productMap[id] = newProduct;
  return newProduct;
}

function updateProduct({ id, datos }) {
  if (!productMap[id]) {
    throw new Error("Product not found");
  }
  //Parte que modifique
  productMap[id] = { ...productMap[id], ...datos };
  return productMap[id];
}

function deleteProduct({ id }) {
  if (!productMap[id]) {
    throw new Error("Product not found");
  }
  const productBorrada = productMap[id];
  delete productMap[id];
  return productBorrada;
}


const app = express();

app.use(express.static("public"));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: {
      getProduct,
      getProducts,
      createProduct,
      updateProduct,
      deleteProduct,
    },
    graphiql: true,
  })
);

const PORT = 8080;
app.listen(PORT, () => {
  const msg = `Servidor corriendo en puerto: ${PORT}`;
  console.log(msg);
});
