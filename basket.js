//add&remove order and send to basket, Krista

//everything to do with basket starts here Krista
const basket = {};
//this function targets clicked elements to show in the list
export function addToBasket(e) {
  const productCard = e.target.parentElement.parentElement;
  const beerName = productCard.parentNode.querySelector("h3").textContent;
  //remove whitespaces from beerLabel to use it beerLabe as an ID
  const beerLabel = beerName.replace(/\s/g, "");
  const beerCount = e.target.parentElement.children[1];

  beerCount.value++;
  if (beerLabel in basket) {
    basket[beerLabel].beerCount += 1;
    // beerCount.value = basket[beerLabel].beerCount;
  } else {
    let basketItem = {
      beerName: beerName,
      beerType: productCard.parentNode.querySelector("h4").textContent,
      beerPrice: productCard.parentNode.querySelector("p").textContent,
      beerImg: productCard.parentNode.querySelector("img").src,
      beerCount: 1,
    };
    basket[beerLabel] = basketItem;
  }

  showInBasket(beerLabel);
  // console.log(basket[beerLabel].beerName, basket[beerLabel].beerCount);
  //post orders to app
  // postOrder(basket[beerLabel].beerName, basket[beerLabel].beerCount);
  console.log(basket[beerLabel]);
}

//create HTML elements and render correctly in basket
function showInBasket(beerLabel) {
  const item = basket[beerLabel];
  const price = `${parseInt(item.beerPrice.slice(-3))}`;
  const quantity = Number(`${item.beerCount}`);
  //console.log(quantity);
  const cardCopy = document.createElement("div");
  cardCopy.setAttribute("class", "cardItem");
  //TODO: beerLabel replace white space removed
  cardCopy.setAttribute("id", beerLabel);
  cardCopy.innerHTML = `<img src="${item.beerImg}"  class= "basketImg" alt="" />
    <div class="name_category">
          <h3>${item.beerName}</h3>
           <h4>${item.beerType}</h4>
           </div>
           <div class="counter">
             <input type="button" value="-" class="minusBasket" />
            <input type="text" size="1" value="${quantity}" class="basketCount" />
             <input type="button" value="+" class="plusBasket" />
          </div>
        <div class="price">
          <h6>${price * quantity}</h6>
        </div>`;

  //console.log(item.beerCount);
  //select beer by its ID= beername, it is beerLabel without white space
  const cardBeerName = document.querySelector(
    "#" + beerLabel.replace(/\s/g, "")
  );
  //if same beer clicked >1 add up only price and quantyty, not whole new beer order card
  if (cardBeerName != null) {
    cardBeerName.remove();
  }

  document.querySelector(".summary").appendChild(cardCopy);
  //with btns from the basket adjust price and items
  const beerPlus = document.querySelectorAll(".plusBasket");
  beerPlus.forEach((count) => {
    count.addEventListener("click", editBasketPlus);
  });
  const beerMinus = document.querySelectorAll(".minusBasket");
  beerMinus.forEach((count) => {
    count.addEventListener("click", editBasketMinus);
  });

  showTotalPrice();
}

//edit items already in basket on +
function editBasketPlus(e) {
  const beerLabel = e.target.parentElement.parentElement.id;
  let beerCount = e.target.parentElement.children[1];
  beerCount.value++;
  //get  data from object and adjust object
  if (beerLabel in basket) {
    basket[beerLabel].beerCount += 1;
    e.target.parentElement.parentElement.querySelector("h6").textContent =
      Number(basket[beerLabel].beerCount) * Number(basket[beerLabel].beerPrice);
  }
  console.log(basket);
  showTotalPrice();
}

//edit items already in basket on -
function editBasketMinus(e) {
  const beerLabel = e.target.parentElement.parentElement.id;
  const beerCount = e.target.parentElement.children[1];
  const price = e.target.parentElement.parentElement.querySelector("h6");
  beerCount.value--;
  if (beerLabel in basket && basket[beerLabel].beerCount > 1) {
    basket[beerLabel].beerCount -= 1;

    price.textContent =
      Number(basket[beerLabel].beerCount) * Number(basket[beerLabel].beerPrice);
  } else {
    console.log("delete me");
    const beerLabelCard = e.target.parentElement.parentElement;
    beerLabelCard.remove();
  }
  showTotalPrice();
}

function showTotalPrice() {
  const total = [];
  let price = document.querySelectorAll("h6");
  price.forEach((beerPrice) => {
    let priceString = beerPrice.textContent;
    //get last three characters of string
    let price = priceString.slice(-3);
    //turn string into number and push to array total
    total.push(Number(price));
  });
  //console.log(total);
  //reduce mUST take two params- accumulator what we are returning and current what we are looping through, and also startin point a number
  const totalPrice = total.reduce((total, beerItem) => {
    total += beerItem;
    return total;
  }, 0);
  // console.log(totalPrice);
  document.querySelector("#total").innerHTML = `${totalPrice}`;
}

export function removeFromBasket(e) {
  const productCard = e.target.parentElement.parentElement;
  const beerLabel = productCard.parentNode.querySelector("h3").textContent;
  const beerCount = e.target.parentElement.children[1];
  beerCount.value--;
  //value in minus box is not going under 0
  if (beerCount.value <= 0) {
    beerCount.value = 0;
    beerCount.disabled = true;
  }

  //subtract 1 from what is current number of beers
  if (beerLabel in basket) {
    basket[beerLabel].beerCount -= 1;
  }
  //if beers = 0, remove that specific beer form basket and also from object and update price
  if (beerLabel in basket && basket[beerLabel].beerCount == 0) {
    let beerInBasket = document.querySelector(
      "#" + beerLabel.replace(/\s/g, "")
    );
    beerInBasket.remove();
    delete basket[beerLabel];
    showTotalPrice();
  }
  showInBasket(beerLabel);
}

function postOrder(beer, amount) {
  const orderData = [{ name: beer, amount: amount }];

  console.log(orderData);

  const postData = JSON.stringify(orderData);
  console.log(postData);
  fetch("https://foobar-mandalorians.herokuapp.com/order", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",

      //"cache-control": "no-cache",
    },
    body: postData,
  })
    .then((res) => res.json())
    .then((orderData) => console.log(orderData));
}
