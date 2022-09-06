const {sqlitedb} = require("./options/sqlite3.js");
const knexsqlite = require("knex")(sqlitedb);

 knexsqlite.schema.createTableIfNotExists("mensajes", function (table)  {
        table.increments();
        table.string("email");
        table.string("mensaje");
        table.string("fecha");})
        .then(() => {console.log("todo bien");})
        .catch((err) => {console.log(err);throw new Error(err);})
        .finally(() => {
          knex.destroy()
        });


 const {mysql_db} = require("./options/mysql.js")
 const knexmysql =  require("knex")(mysql_db);


 knexmysql.schema.createSchemaIfNotExists("products", function(table){
  table.increments("id_products");
      table.string("name");
      table.integer("price");
      table.integer("stock");
 })
 .then(()=>{
  console.log('tabla creada')
 })
 .catch((err) => {console.log(err);throw new Error(err);})
 .finally(()=>{
  knexmysql.destroy()
 });