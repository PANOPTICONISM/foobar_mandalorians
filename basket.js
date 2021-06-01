"use strict";

import { lastStr } from "./helpers";
import { nameId } from "./helpers";
//everything to do with basket starts here Krista
export let basket = {};
export let orderData = [];
document.querySelector(".amount_beers").classList.add("hide");

//this function targets clicked elements to show in the list
export function addToBasket(e) {
  const productCard = e.target.parentElement.parentElement;
  const beerName = productCard.parentNode.querySelector("h2").textContent;
  const beerLabel = nameId(beerName);
  const beerCount = e.target.parentElement.children[1];
  beerCount.value++;

  if (beerLabel in basket) {
    basket[beerLabel].beerCount += 1;
  } else {
    let basketItem = {
      beerName: beerName,
      beerType: productCard.parentNode.querySelector("h3").textContent,
      beerPrice: productCard.parentNode.querySelector("p").textContent,
      beerImg: productCard.parentNode.querySelector("img").src,
      beerCount: 1,
    };
    //set key to our basket object, and add values
    basket[beerLabel] = basketItem;
  }

  //beerCart interactivity
  document.querySelector(".amount_beers").classList.remove("hide");
  document.querySelector(".checkout_beer").classList.add("shake");
  document.querySelector(".amount_beers").innerHTML = "✓";
  showInBasket(beerLabel);
}

//create HTML elements and render in basket according to data
function showInBasket(beerLabel) {
  const item = basket[beerLabel];
  //TODO: catc errored
  if (item === undefined) {
    console.log("you have 0 beers, item removed");
  }
  const priceStr = lastStr(item.beerPrice);
  const price = Number(priceStr);
  const quantity = Number(item.beerCount);
  const cardCopy = document.createElement("div");
  cardCopy.setAttribute("class", "cardItem");
  //set ID to html elements same as obj key- it is for basket manipulation
  cardCopy.setAttribute("id", beerLabel);
  cardCopy.innerHTML = `<div class ="beer-card">
  <img src="${item.beerImg}"  class= "basketImg" alt="" />
    <div class="name_category">
          <h2>${item.beerName}</h2>
           <h3>${item.beerType}</h3>
           </div>
           </div>
           <div class="counter">
           <input type="button" value="-" class="minusBasket" />
          <input type="text" size="1" value="${quantity}" class="basketCount" />
           <input type="button" value="+" class="plusBasket" />
        </div>  
        <div class="price">
          <h6>DKK ${price * quantity}</h6>
        </div>
       `;

  const cardBeerName = document.querySelector("#" + nameId(beerLabel));
  //if same beer clicked >1 add up only price and quantyty to basket, not whole new beer order card
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

//edit items already in basket on +btn
function editBasketPlus(e) {
  const beerLabel = e.target.parentElement.parentElement.id;
  const beerCount = e.target.parentElement.children[1];
  const calcPrice = e.target.parentElement.parentElement.querySelector("h6");
  beerCount.value++;
  //get  data from object and adjust object
  if (beerLabel in basket) {
    basket[beerLabel].beerCount += 1;
    const priceStr = lastStr(basket[beerLabel].beerPrice);
    const price = Number(basket[beerLabel].beerCount) * Number(priceStr);
    calcPrice.textContent = `DKK ${price}`;
  }
  showTotalPrice();
}

//edit items already in basket on -
function editBasketMinus(e) {
  const beerLabel = e.target.parentElement.parentElement.id;
  const beerCount = e.target.parentElement.children[1];
  const calcPrice = e.target.parentElement.parentElement.querySelector("h6");
  beerCount.value--;
  if (beerLabel in basket && basket[beerLabel].beerCount > 1) {
    basket[beerLabel].beerCount -= 1;
    const priceStr = lastStr(basket[beerLabel].beerPrice);
    const price = Number(basket[beerLabel].beerCount) * Number(priceStr);
    calcPrice.textContent = `DKK ${price}`;
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
    let price = lastStr(priceString);
    //turn string into number and push to array total
    total.push(Number(price));
  });
  //reduce takes two params- accumulator what we are returning and current what we are looping through, and also starting point which is here 0
  const totalPrice = total.reduce((total, beerItemNr) => {
    total += beerItemNr;
    return total;
  }, 0);
  document.querySelector("#total").innerHTML = `DKK ${totalPrice}`;
}

export function removeFromBasket(e) {
  const productCard = e.target.parentElement.parentElement;
  const beerName = productCard.parentNode.querySelector("h2").textContent;
  const beerLabel = nameId(beerName);
  console.log(beerLabel);
  const beerCount = e.currentTarget.parentElement.children[1];
  beerCount.value--;
  document.querySelector(".amount_beers").innerHTML = "✓ ";
  //prevent value in minus box to go under 0
  if (beerCount.value < 1) {
    beerCount.value = 0;
    beerCount.disabled = true;
    document.querySelector(".checkout_beer").classList.remove("shake");
    document.querySelector(".amount_beers").classList.add("hide");
  }
  //subtract 1 from what is current number of beers
  if (beerLabel in basket) {
    basket[beerLabel].beerCount -= 1;
  }
  //if beers = 0, remove that specific beer form basket and also from object and update price
  if (beerLabel in basket && basket[beerLabel].beerCount == 0) {
    const beerInBasket = document.querySelector("#" + nameId(beerLabel));
    console.log(beerInBasket);
    beerInBasket.remove();
    //thorws undefined in console because it is removed from object, and we are calling showInBasket()
    delete basket[beerLabel];
    showTotalPrice();
  }
  showInBasket(beerLabel);
}

//post data to server
export function postOrder(e) {
  // e is on form
  e.preventDefault();
  orderData = [];
  const keys = Object.keys(basket);
  keys.forEach((key) => {
    orderData.push({
      name: basket[key].beerName,
      amount: basket[key].beerCount,
    });
  });

  const postData = JSON.stringify(orderData);
  console.log(orderData);
  fetch("https://foobar-mandalorians.herokuapp.com/order", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: postData,
  })
    .then((res) => res.json())
    .then((postData) => console.log(postData));
}
