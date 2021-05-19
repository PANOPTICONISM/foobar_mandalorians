"use strict";
//when DOM loads we want to create DOM elements KRISTA
window.addEventListener("DOMContentLoaded", createElements);

function createElements() {
  //create sections
  const servingSection = document.createElement("section");
  servingSection.setAttribute("id", "serving");
  const orderSection = document.createElement("section");
  orderSection.setAttribute("id", "order");

  //create h2s
  const servingsTitle = document.createElement("h2");
  servingsTitle.textContent = "ready for pick up";
  servingSection.append(servingsTitle);
  const ordersTitle = document.createElement("h2");
  ordersTitle.textContent = "upcoming orders";
  orderSection.append(ordersTitle);

  //create chart elements
  const chartContainer = document.createElement("div");
  chartContainer.setAttribute("class", "chart-container");
  chartContainer.innerHTML = "CHART GOES HERE";
  //create canvas element
  const myChart = document.createElement("canvas");
  myChart.setAttribute("id", "my-chart");
  chartContainer.appendChild(myChart);
  //append to main
  document
    .querySelector("main")
    .append(servingSection, orderSection, chartContainer);
  startLiveUpdate();
}

//fix beernames from array to be used for img on orders/servings KRISTA
function fixImgName(arr) {
  const beerNameString = arr.toString();
  const toLowerCase = beerNameString.toLowerCase();
  const strConcat = toLowerCase.replace(/\s+/g, "");
  const strIndex = strConcat.indexOf(",");
  const imgName = strConcat.substring(0, strIndex);
  return imgName;
}

//Time function KRISTA
function currentTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedTime = ` ${hours}:${minutes}:${seconds}`;
  return formattedTime;
}

//SHORT POLLING- fetch updates every 2sec KRISTA
function startLiveUpdate() {
  setInterval(async () => {
    const response = await fetch("https://foobar-mandalorians.herokuapp.com/");
    const jsonData = await response.json();
    prepareData(jsonData);
  }, 2000);
}

//loop through upcoming orders/servings, find queue length and call updates functions KRISTA
function prepareData(dashboardData) {
  //clear DOM
  //document.querySelector("main").innerHTML = "";

  dashboardData.serving.forEach((serving) => {
    displayUpcomingServings(serving);
  });
  dashboardData.queue.forEach((order) => {
    //displayUpcomingOrders(order);
  });
  let queue = dashboardData.queue.length;
  showQueueLength(queue);

  let time = dashboardData.timestamp;
  showCurrentTime(time);
}

//queue length KRISTA
function showQueueLength(queueLength) {
  console.log(`ORDERS IN QUEUE:${queueLength}`);
}

// showint timestamp as time
function showCurrentTime(time) {
  document.querySelector(".time").textContent = currentTime(time);
}

//create HTML elements and display servings KRISTA
function displayUpcomingServings(serving) {
  //this is data for serving list
  let servingId = serving.id;
  let servingTime = serving.startTime;
  let beerServing = serving.order;

  //create div card-box
  const cardBoxDivs = document.createElement("div");
  cardBoxDivs.setAttribute("class", "card-box");

  //create div servings
  const infoCardDiv = document.createElement("div");
  infoCardDiv.setAttribute("class", "info-card");
  cardBoxDivs.append(infoCardDiv);

  //create p order-id
  const servingsId = document.createElement("p");
  servingsId.setAttribute("class", "serving-id");
  servingsId.innerHTML = `Order Nr: ${servingId}`;
  //create p time-id
  const servingTimeId = document.createElement("p");
  servingTimeId.setAttribute("class", "time-id");
  servingTimeId.innerHTML = `Order Time:  ${currentTime(servingTime)}`;
  infoCardDiv.append(servingsId, servingTimeId);

  //create div beer-type
  const beerType = document.createElement("div");
  beerType.setAttribute("class", "beer-type");
  //append paragraphs
  cardBoxDivs.append(servingsId, servingTimeId, beerType);
  const beerUl = document.createElement("ul");
  beerUl.setAttribute("class", "beer");
  beerType.append(beerUl);
  //compare if there is duplicates in beer array to display duplicate as number, then create HTML list for beers and populate it KRISTA
  for (let i = 0; i < beerServing.length; i++) {
    // Duplicate array, it will hold unique val later
    let unique = [...new Set(beerServing)];
    // This array counts duplicates READ MORE about SET
    let duplicates = unique.map((value) => [
      value,
      beerServing.filter((beerName) => beerName === value).length,
    ]);
    //console.log(duplicates[i]);
    let beerNameValue = duplicates[i];
    if (beerNameValue === undefined) {
      console.log("waiting for orders");
    } else {
      //create beer list
      const beerNamesLi = document.createElement("li");
      //create span tag to fit in list
      const liSpan = document.createElement("span");
      //create img element
      const img = document.createElement("img");
      //uses global fixname function to pass in specific val as param
      img.src = `${fixImgName(beerNameValue)}.png`;
      beerNamesLi.append(img);
      liSpan.textContent = `${beerNameValue.join("  ")}x`;
      beerNamesLi.append(liSpan);
      beerUl.append(beerNamesLi);
    }
  }
  document.querySelector("#serving").append(cardBoxDivs);
}

// function displayUpcomingOrders(order) {
//   //console.log(order);
//   //this is data for upcoming orders list
//   const ordersId = order.id;
//   const ordersTime = order.startTime;
//   const beerOrder = order.order;

//   //create section#orders
//   const sectionOrders = document.createElement("section");
//   sectionOrders.setAttribute("id", "orders");
//   document.querySelector("main").appendChild(sectionOrders);
//

//   //create div orders
//   const ordersDiv = document.createElement("div");
//   ordersDiv.setAttribute("class", "orders");
//   sectionOrders.append(ordersDiv);

//   //create div order-id
//   const ordersDivId = document.createElement("div");
//   ordersDivId.setAttribute("class", "orders-id");
//   ordersDiv.append(ordersDivId);

//   //create p order-id
//   const orderId = document.createElement("p");
//   orderId.setAttribute("class", "order-id");
//   orderId.innerHTML = `Order Nr: ${ordersId}`;

//   //create p time-id
//   const orderTimeId = document.createElement("p");
//   orderTimeId.setAttribute("class", "time-id");
//   orderTimeId.innerHTML = `Order Time:  ${formattedTime(ordersTime)}`;

//   //create div beer-type
//   const beerType = document.createElement("div");
//   beerType.setAttribute("class", "beer-type");
//   //append paragraphs
//   ordersDivId.append(orderId, orderTimeId, beerType);
//   const beerUl = document.createElement("ul");
//   beerUl.setAttribute("class", "beer");
//   beerType.append(beerUl);
//   //compare if there is duplicates in beer array to display it differently, then create HTML list for beers and populate it KRISTA
//   for (let i = 0; i < beerOrder.length; i++) {
//     // Duplicate array, it will hold unique val later
//     let unique = [...new Set(beerOrder)];
//     // This array counts duplicates READ MORE about SET
//     let duplicates = unique.map((value) => [
//       value,
//       beerOrder.filter((beerName) => beerName === value).length,
//     ]);
//     //console.log(duplicates[i]);
//     let beerNameValue = duplicates[i];
//     if (beerNameValue === undefined) {
//       console.log("waiting for orders");
//     } else {
//       //create beer list
//       const beerNamesLi = document.createElement("li");
//       //create span tag to fit list in
//       const liSpan = document.createElement("span");
//       //create img element
//       const img = document.createElement("img");
//       img.src = `${imgName(beerNameValue)}.png`;
//       beerNamesLi.append(img);
//       liSpan.textContent = `${beerNameValue.join(" ")}x`;
//       beerNamesLi.append(liSpan);
//       beerUl.append(beerNamesLi);
//     }

//     //create span tag to fit list in
//     const span = document.createElement("span");
//     copy.querySelector(".beer").appendChild(span);
//     // images
//     let beerNameString = beerNameValue.toString();
//     let toLowerCase = beerNameString.toLowerCase();
//     let strConcat = toLowerCase.replace(/\s+/g, "");
//     let strIndex = strConcat.indexOf(",");
//     const img = document.createElement("img");
//     let imgName = strConcat.substring(0, strIndex);
//     img.src = `${imgName}.png`;
//     copy.querySelector("span").appendChild(img);
//     console.log(img);
//     //create beer list
//     const beerNames = document.createElement("li");
//     beerNames.textContent = `${beerNameValue.join(" ")}x`;
//     copy.querySelector("span").appendChild(beerNames);
//   }

//   // append clone to list
//   document.querySelector("main").appendChild(copy);
// }
