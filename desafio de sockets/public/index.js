const socket = io();

socket.on("connection", () => {
  console.log("Te has conectado");
});

//Envio de Form
function submitProduct(e) {
  e.preventDefault();
  const form = document.getElementById("form");

  let newProduct = {
    name: document.getElementById("title").value,
    price: parseInt(document.getElementById("price").value),
    stock: document.getElementById("thumbnail").value,
  };

  socket.emit("producto", newProduct);

  form.reset();
  return false;
}

function submitMenssage(e) {
  e.preventDefault();
  const form = document.getElementById("form-chat");
  const email = document.getElementById("email").value;
  const mensaje = document.getElementById("mensaje").value;
  let fecha = new Date();
  fecha = `${fecha.getDate()}/${
    fecha.getMonth() + 1
  }/${fecha.getFullYear()} ${fecha.getHours()}:${
    fecha.getMinutes().toString().length == 1
      ? `0${fecha.getMinutes()}`
      : fecha.getMinutes()
  }:${
    fecha.getSeconds().toString().length == 1
      ? `0${fecha.getSeconds()}`
      : fecha.getSeconds()
  }`;
  const mensajeCompleto = { email, fecha, mensaje };
  socket.emit("mensaje", mensajeCompleto);
  form.reset();
  return false;
}

socket.on("producto-row", (data) => {
  const tbody = document.querySelector("tbody");
  const tr = document.createElement("tr");
  // td title
  const tdTitle = document.createElement("td");
  tdTitle.classList.add("text-center");
  tdTitle.textContent = data.name;
  // td price
  const tdPrice = document.createElement("td");
  tdPrice.classList.add("text-center");
  tdPrice.textContent = data.price;
  // td stock
  const tdStock= document.createElement("td");
  tdStock.classList.add("text-center");
  tdStock.textContent = data.stock;
  
  // append child
  tr.appendChild(tdTitle);
  tr.appendChild(tdPrice);
  tr.appendChild(tdStock);
  tbody.appendChild(tr);
});

socket.on("chat", (data) => {
  const divchat = document.getElementById("chat");
  console.log(data);
  const chat = data.reduce(
    (acu, act) =>
      (acu += `<p style="margin:5px;"><span class="fw-bold" style="color:blue;">${act.email}</span><span style="color:brown;"> [${act.fecha}]</span><span class="fst-italic" style="color:green;"> : ${act.mensaje}</span></p>`),
    ""
  );
  divchat.innerHTML = chat;
});