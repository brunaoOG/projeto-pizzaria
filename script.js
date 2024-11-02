//GLOBAL 1

let cart = [];
let modalQt = 0;
let modalKey = 0;

//GLOBAL 2 - PRICE

let subtotal = 0;
let discount = 0;
let total = 0;

//GLOBAL 3 - HANDLES F

const query = (el) => document.querySelector(el);
const queryAll = (el) => document.querySelectorAll(el);

//READING THE JSON

pizzaJson.forEach((item, index) => {
  let pizzaItem = query(".models .pizza-item").cloneNode(true);
  pizzaItem.setAttribute("data-key", index);

  //Preenchendo o item
  fillShop(pizzaItem, item);

  //Modal
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    //Mostrando o modal
    toggleModal();

    //Preenchendo o modal
    fillModal(index);
  });

  query(".pizza-area").appendChild(pizzaItem);
});

//FILL FUNCTIONS

function fillShop(el, item) {
  el.querySelector(".pizza-item--name").innerHTML = item.name;
  el.querySelector(".pizza-item--price").innerHTML = `${item.price.toFixed(
    2
  )} R$`;
  el.querySelector(".pizza-item--img img").src = item.img;
  el.querySelector(".pizza-item--desc").innerHTML = item.description;
}
function fillModal(key) {
  //Resets
  modalQt = 1;
  modalKey = key;
  selectSize(query(".pizzaInfo--size[data-key='2']"));

  //HTML - Elementos
  {
    query(".pizzaBig img").src = pizzaJson[key].img;
    query(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    query(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    pizzaJson[key].sizes.map((item, index) => {
      query(`.pizzaInfo--size[data-key="${index}"] span`).innerHTML = item;
    });
    query(".pizzaInfo--actualPrice").innerHTML = `${pizzaJson[
      key
    ].price.toFixed(2)} R$`;

    query(".pizzaInfo--qt").innerHTML = modalQt;
  }
}

//CART MAIN FUNCTION

function addOnCart(item, index) {
  let key = item.id;
  let size = item.size === 0 ? "P" : item.size === 1 ? "M" : "G";

  subtotal += pizzaJson[key].price * item.qt;
  updatePrice();

  let cartItem = query(".cart--item").cloneNode(true);
  cartItem.setAttribute("data-key", key);

  cartItem.querySelector("img").src = pizzaJson[key].img;
  cartItem.querySelector(
    ".cart--item-nome"
  ).innerHTML = `${pizzaJson[key].name} (${size})`;
  cartItem.querySelector(".cart--item--qt").innerHTML = item.qt;

  cartItem
    .querySelector(".cart--item-qtmais ")
    .addEventListener("click", () => {
      addQt(item, key, cartItem);
    });
  cartItem
    .querySelector(".cart--item-qtmenos")
    .addEventListener("click", () => {
      decreaseQt(item, index, key, cartItem);
    });

  query(".cart").append(cartItem);
}

//CART ADITIONAL

function updatePrice() {
  discount = (subtotal / 10).toFixed(2);
  total = (subtotal - discount).toFixed(2);

  query(
    ".cart--totalitem.subtotal span:last-child"
  ).innerHTML = `R$ ${subtotal.toFixed(2)}`;

  query(
    ".cart--totalitem.desconto span:last-child"
  ).innerHTML = `R$ ${discount}`;

  query(
    ".cart--totalitem.total span:last-child      "
  ).innerHTML = `R$ ${total}`;
}
function addQt(item, key, cartItem) {
  item.qt++;
  cartItem.querySelector(".cart--item--qt").innerHTML = item.qt;
  subtotal += pizzaJson[key].price;
  updatePrice();
}
function decreaseQt(item, index, key, cartItem) {
  subtotal -= pizzaJson[key].price;
  item.qt--;

  if (item.qt > 0) {
    cartItem.querySelector(".cart--item--qt").innerHTML = item.qt;
    updatePrice();
  } else {
    let removed = query(`.cart--item[data-key='${item.id}']`);
    removed.parentNode.removeChild(removed);
    cart.splice(index, 1);
    console.log("caiu no else");

    query(".menu-openner span ").innerHTML = cart.length;
    updatePrice();

    if (!cart[0]) {
      hideCart();
    }
  }
}

//HTML STUFF

function selectSize(replace) {
  query(".pizzaInfo--size.selected").classList.remove("selected");
  replace.classList.add("selected");
}
function toggleModal() {
  let windowEl = query(".pizzaWindowArea");

  if (windowEl.classList.contains("closed")) {
    windowEl.classList.remove("closed");
    windowEl.classList.add("opened");

    windowEl.style.display = "flex";
    windowEl.style.opacity = 0;
    setTimeout(() => {
      windowEl.style.opacity = 1;
    }, 5);
  } else if (windowEl.classList.contains("opened")) {
    windowEl.classList.remove("opened");
    windowEl.classList.add("closed");

    windowEl.style.opacity = 1;
    setTimeout(() => {
      windowEl.style.opacity = 0;
    }, 5);
    setTimeout(() => {
      windowEl.style.display = "none";
    }, 500);
  }
}
function showCart() {
  query("aside").classList.add("show");
}
function hideCart() {
  query("aside").classList.remove("show");
  query("aside").style.left = "100vw";
}

//QUERYALL EVENTS

queryAll(".pizzaInfo--cancelButton,.pizzaInfo--cancelMobileButton").forEach(
  (item) => item.addEventListener("click", toggleModal)
);

queryAll(".pizzaInfo--size").forEach((item) =>
  item.addEventListener("click", (e) => {
    selectSize(e.currentTarget);
  })
);

//PIZZAINFO EVENTS

query(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt = modalQt + 1;
  query(".pizzaInfo--qt").innerHTML = modalQt;
  query(".pizzaInfo--actualPrice").innerHTML = `
    ${(pizzaJson[modalKey].price * modalQt).toFixed(2)} R$`;
});
query(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    query(".pizzaInfo--qt").innerHTML = modalQt;
    query(".pizzaInfo--actualPrice").innerHTML = `
    ${(pizzaJson[modalKey].price * modalQt).toFixed(2)} R$`;
  }
});

query(".pizzaInfo--addButton").addEventListener("click", () => {
  let sizeKey = parseInt(
    query(".pizzaInfo--size.selected").getAttribute("data-key")
  );

  let bool = cart.some((item) => {
    return item.id === modalKey && item.size === sizeKey
      ? true + (item.qt = item.qt + modalQt)
      : false;
  });

  if (!bool) {
    cart.push({
      id: modalKey,
      size: sizeKey,
      qt: modalQt,
    });
    addOnCart(cart[cart.length - 1], cart.length - 1);
    query(".menu-openner span ").innerHTML = cart.length;
  } else {
    let updatedQt = cart.filter((item) => item.id === modalKey);
    query(`.cart--item[data-key='${modalKey}'] .cart--item--qt`).innerHTML =
      updatedQt[0].qt;
  }

  showCart();
  toggleModal();
});

//CART-MOBILE EVENTS

query(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) query("aside").style.left = "0vw";
});
query(".menu-closer").addEventListener("click", hideCart);

query(".dark-light-toggle").addEventListener("click", () => {
  if (query(".selection").classList.contains("lightned")) {
    query(".selection").classList.remove("lightned");
    query(".selection").classList.add("darkned");

    query("body").classList.add("dark");
  } else if (query(".selection").classList.contains("darkned")) {
    query(".selection").classList.remove("darkned");
    query(".selection").classList.add("lightned");

    query("body").classList.remove("dark");
  }
});
