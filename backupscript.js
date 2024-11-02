//padding

pizzaJson.map((item, index) => {
  let pizzaItem = query(".models .pizza-item").cloneNode(true);

  //Preenchendo o item
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `${item.price.toFixed(2)} R$`;
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  //Modal
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    //Mostrando o modal
    query(".pizzaWindowArea").style.display = "flex";
    query(".pizzaWindowArea").style.opacity = 0;
    setTimeout(() => {
      query(".pizzaWindowArea").style.opacity = 1;
    }, 5);

    //Preenchendo o modal
    query(".pizzaBig img").src = item.img;
    query(".pizzaInfo h1").innerHTML = item.name;
    query(".pizzaInfo--desc").innerHTML = item.description;
    item.sizes.map((item, index) => {
      query(`.pizzaInfo--size[data-key="${index}"] span`).innerHTML = item;
    });
    query(".pizzaInfo--actualPrice").innerHTML = `${item.price.toFixed(2)} R$`;

    //Eventos
    query(".pizzaInfo--cancelButton").addEventListener("click", () => {
      query(".pizzaWindowArea").style.opacity = 0;
      setTimeout(() => {
        query(".pizzaWindowArea").style.display = "none";
      }, 500);
    });
    query(".pizzaInfo--addButton").addEventListener("click", addItem);
  });

  query(".pizza-area").appendChild(pizzaItem);
});

//padding
