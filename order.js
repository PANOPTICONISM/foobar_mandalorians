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
  price.textContent = "DKK " + Math.floor(Math.random() * 100 + 10);
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
  // TODO: price
  // TODO: counter
  //add&remove order and send to basket, Krista
  const beerPlus = document.querySelectorAll(".plus");
  beerPlus.forEach((count) => {
    count.addEventListener("click", addToBasket);
  });
  const beerMinus = document.querySelectorAll(".minus");
  beerMinus.forEach((count) => {
    //console.log(count);
    count.addEventListener("click", removeFromBasket);
  });

  const alcoholPercentage = document.createElement("h5");
  alcoholPercentage.textContent = beer.alc + " %";

  topLayer.append(topfirstLayer);
  topfirstLayer.append(beerImage, topSecondLayer);
  topSecondLayer.append(beerName, beerType, middleLayer);
  middleLayer.append(alcoholPercentage, price);
  bottomLayer.append(readMore, clone);

  beerCard.append(topLayer, bottomLayer);

  document.querySelector(".beers").appendChild(beerCard);
}

// modal with details for each beer - maria
function openDetailedModal(beer) {
  console.log(beer);

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
let basket = {
  beerName: "",
  beerType: "",
  beerPrice: "",
  beerImg: "",
  beerCount: "",
};
//this function targets clicked elements to show in the list
function addToBasket(e) {
  const productCard = e.target.parentElement.parentElement;
  const beerLabel = productCard.parentNode.querySelector("h3").textContent;
  const beerCount = e.currentTarget.parentElement.children[1];
  const beerQuantity = beerCount.value++;
  if (beerLabel in basket) {
    basket[beerLabel].beerCount += 1;
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
  console.log(basket);
  showInBasket(beerLabel);
}

function showInBasket(beerLabel) {
  console.log(basket[beerLabel]);
  const item = basket[beerLabel];
  const cardSummary = document.querySelector(
    "#" + beerLabel.replace(/\s/g, "")
  );
  const price = `${parseInt(item.beerPrice.slice(-3))}`;
  const quantity = Number(`${item.beerCount}`);
  //document.querySelector(".price h6").textContent = price * quantity;
  const cardCopy = document.createElement("div");
  cardCopy.setAttribute("class", "cardItem");
  cardCopy.setAttribute("id", beerLabel.replace(/\s/g, ""));
  cardCopy.innerHTML = `<img src="${item.beerImg}"  class= "basketImg" alt="" />
    <div class="name_category">
          <h3>${item.beerName}</h3>
           <h4>${item.beerType}</h4>
           </div>
           <div class="counter">
             <input type="button" value="-" class="minus" />
            <input type="text" size="1" value="${
              item.beerCount
            }" class="basketCount" />
             <input type="button" value="+" class="plus" />
          </div>
        <div class="price">
          <h6>${price * quantity}</h6>
        </div>`;
  if (cardSummary != null) {
    cardSummary.remove();
  }
  document.querySelector(".summary").appendChild(cardCopy);
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
  //console.log(e.target);
  const beerCount = e.currentTarget.parentElement.children[1];
  beerCount.value--;
  if (beerCount.value <= 0) {
    beerCount.value = 0;
  }
  //removeFromBasket(beerLabel, beerType, beerPrice, beerImg);
}
