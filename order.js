import "./sass/customer.scss";

("use strict");

// load on start - maria
window.addEventListener("DOMContentLoaded", fetchData);

// fetch data from api - maria
async function fetchData() {
  const beertypes = "https://foobar-mandalorians.herokuapp.com/beertypes";
  const response = await fetch(beertypes);
  const data = await response.json();

  filterData(data);
}

let allBeers = [];
// divide our data - maria
function filterData(beers) {
  allBeers = beers;
  beers.forEach(eachBeerCard);
  groupFilters();
  filterClicked();
  checkoutButton();
}

// array of all beertypes - maria
function groupFilters() {
  let filterArr = [];
  for (let i = 0; i < allBeers.length; i++) {
    let result = filterArr.push("all", allBeers[i].category);
  }
  cleanFilters(filterArr);
}

// clean array from repetitive categories - maria
function cleanFilters(categories) {
  function isUnique(a, b) {
    return categories.indexOf(a) == b;
  }
  const cleanRepetitiveFilters = categories.filter(isUnique);

  appendFilters(cleanRepetitiveFilters);
}

// create and append filters to dom - maria
function appendFilters(filter) {
  filter.forEach((f) => {
    const filterOption = document.createElement("button");
    filterOption.setAttribute("class", "filter");
    filterOption.textContent = f;
    document.querySelector(".filters").appendChild(filterOption);
  });
  let allButton = document.querySelector(".filters").firstElementChild;
  allButton.setAttribute("class", "filter active_filter");
}

// filters in action - maria
function filterClicked() {
  const filter = document.querySelectorAll(".filter");
  filter.forEach((btn) => btn.addEventListener("click", sortItems));
}

function sortItems(e) {
  const filteredBeers = allBeers.filter(isBeertype);

  function isBeertype(beer) {
    if (
      e.target.textContent === beer.category ||
      e.target.textContent === "all"
    ) {
      return true;
    } else {
      return false;
    }
  }

  // change active button upon click
  const activeFilter = document.querySelector(".active_filter");
  if (activeFilter !== null) {
    activeFilter.classList.remove("active_filter");
  }
  e.target.classList.toggle("active_filter");

  return rebuildList(filteredBeers);
}

// rebuild beer list options upon clicked filter - maria
function rebuildList(newList) {
  document.querySelector(".beers").innerHTML = "";
  newList.forEach(eachBeerCard);
}

// insert data into the DOM - maria
function eachBeerCard(beer) {
  // create a box for each beer, with a class named card
  const beerCard = document.createElement("div");
  beerCard.setAttribute("class", "card");

  // create and insert the api data into the right elements
  const topLayer = document.createElement("div");
  topLayer.setAttribute("class", "top_layer");
  const topfirstLayer = document.createElement("div");
  topfirstLayer.setAttribute("class", "first_layer");
  const topSecondLayer = document.createElement("div");
  topSecondLayer.setAttribute("class", "second_layer");
  const beerName = document.createElement("h3");
  beerName.textContent = beer.name;
  const beerImage = document.createElement("img");
  beerImage.src = beer.label;
  beerImage.setAttribute("alt", beerName.textContent);

  const middleLayer = document.createElement("div");
  middleLayer.setAttribute("class", "middle_layer");
  const price = document.createElement("p");
  //TODO: "DKK"removed
  price.textContent = Math.floor(Math.random() * 100 + 10);
  const beerType = document.createElement("h4");
  beerType.textContent = beer.category;

  const bottomLayer = document.createElement("div");
  bottomLayer.setAttribute("class", "bottom_layer");
  const readMore = document.createElement("button");
  readMore.setAttribute("class", "read_more");
  readMore.textContent = "read more";
  readMore.addEventListener("click", (res) => {
    openDetailedModal(beer);
  });
  const clone = document.querySelector("#counter").content.cloneNode(true);
  clone.querySelector(".counter");
  const alcoholPercentage = document.createElement("h5");
  alcoholPercentage.textContent = beer.alc + " %";

  topLayer.append(topfirstLayer);
  topfirstLayer.append(beerImage, topSecondLayer);
  topSecondLayer.append(beerName, beerType, middleLayer);
  middleLayer.append(alcoholPercentage, price);
  bottomLayer.append(readMore, clone);

  beerCard.append(topLayer, bottomLayer);

  document.querySelector(".beers").appendChild(beerCard);

  //add&remove order and send to basket, Krista
  const beerPlus = document.querySelectorAll(".plus");
  beerPlus.forEach((count) => {
    count.addEventListener("click", addToBasket);
  });
  const beerMinus = document.querySelectorAll(".minus");
  beerMinus.forEach((count) => {
    count.addEventListener("click", removeFromBasket);
  });
}

// modal with details for each beer - maria
function openDetailedModal(beer) {
  const clone = document.querySelector("#b_modal").content.cloneNode(true);

  const beerImage = clone.querySelector(".modal_inner_readmore img");
  beerImage.src = beer.label;
  const beerName = clone.querySelector(".modal_inner_readmore h3");
  beerName.textContent = beer.name;
  const beerType = clone.querySelector(".modal_inner_readmore h4");
  beerType.textContent = beer.category;
  const beerDescription = clone.querySelector(".desc p");
  beerDescription.textContent = beer.description.flavor;
  const beerTaste = clone.querySelector(".headline p");
  beerTaste.textContent = beer.description.appearance;

  document.querySelector("main section").appendChild(clone);

  const modal = document.querySelector("#beer_modal");
  modal.style.display = "block";
  const body = document.querySelector("body");
  const modalContainer = document.querySelector("#beer_modal .modal_container");
  body.style.overflow = "hidden";
  window.onclick = function (e) {
    if (e.target == modalContainer) {
      body.style.overflow = "auto";
      modal.remove();
    }
  };
  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", () => {
    body.style.overflow = "auto";
    modal.remove();
  });
}

// checkout
function checkoutButton() {
  const buttonClicked = document.querySelector(".checkout");
  buttonClicked.addEventListener("click", displayCheckout);
}

function displayCheckout() {
  const clone = document.querySelector("#checkout").content.cloneNode(true);

  const modalCheckout = clone.querySelector("#order_modal");
  modalCheckout.style.display = "block";

  document.querySelector("main section").appendChild(clone);

  const modalContainer = document.querySelector(
    "#order_modal .modal_container_b"
  );
  const body = document.querySelector("body");
  body.style.overflow = "hidden";
  window.onclick = function (e) {
    if (e.target == modalContainer) {
      body.style.overflow = "auto";
      modalCheckout.remove();
      console.log(modalCheckout);
    }
  };
}

//everything to do with basket starts here Krista
const basket = {};

//this function targets clicked elements to show in the list
function addToBasket(e) {
  const productCard = e.target.parentElement.parentElement;
  const beerName = productCard.parentNode.querySelector("h3").textContent;
  //remove whitespaces from beerLabel to use it beerLabe as an ID
  const beerLabel = beerName.replace(/\s/g, "");
  const beerCount = e.target.parentElement.children[1];
  console.log(beerCount.value);
  beerCount.value++;
  if (beerLabel in basket) {
    basket[beerLabel].beerCount += 1;
    // beerCount.value = basket[beerLabel].beerCount;
  } else {
    let basketItem = {
      beerName: beerLabel,
      beerType: productCard.parentNode.querySelector("h4").textContent,
      beerPrice: productCard.parentNode.querySelector("p").textContent,
      beerImg: productCard.parentNode.querySelector("img").src,
      beerCount: 1,
    };
    basket[beerLabel] = basketItem;
  }

  showInBasket(beerLabel);
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
    console.log(basket[beerLabel].beerCount);
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

function removeFromBasket(e) {
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
console.log(basket);
