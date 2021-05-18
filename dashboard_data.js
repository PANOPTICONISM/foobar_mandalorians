"use strict";
//when DOM loads we want to start live update of the dashboard_data KRISTA
window.addEventListener("DOMContentLoaded", startLiveUpdate);

//SHORT POLLING- fetch updates every 2 sec KRISTA
function startLiveUpdate() {
  setInterval(async () => {
    const response = await fetch("https://foobar-mandalorians.herokuapp.com/");
    const jsonData = await response.json();
    prepareData(jsonData);
  }, 2000);
}

//clear the list, loop through upcoming orders/serving, find queue length and call display all updates KRISTA
function prepareData(dashboardData) {
  //clear DOM
  //document.querySelector("main").innerHTML = "";
  dashboardData.serving.forEach((serving) => {
    displayUpcomingServings(serving);
  });
  dashboardData.queue.forEach((order) => {
    displayUpcomingOrders(order);
  });
  let queue = dashboardData.queue.length;
  showQueueLength(queue);
}

function showQueueLength(queueLength) {
  console.log(`ORDERS IN QUEUE:${queueLength}`);
}

//create elements and display servings
function displayUpcomingServings(serving) {
  //this is data for serving list
  let servingId = serving.id;
  let servingTime = serving.startTime;
  let beerServing = serving.order;
  //console.log(beerServing.length);

  //clone template
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  //create section#serving
  const sectionServings = document.createElement("section");
  sectionServings.setAttribute("id", "serving");
  document.querySelector("main").appendChild(sectionServings);
  //create servings h2
  const servingsTitle = document.createElement("h2");
  servingsTitle.textContent = "ready to pick up";

  //create div servings
  const servingsDiv = document.createElement("div");
  servingsDiv.setAttribute("class", "servings");
  sectionServings.append(servingsTitle, servingsDiv);

  //create div serving-id
  const servingsDivId = document.createElement("div");
  servingsDivId.setAttribute("class", "serving-id");
  servingsDiv.append(servingsDivId);

  //create p order-id
  const servingsId = document.createElement("p");
  servingsId.setAttribute("class", "serving-id");
  servingsId.innerHTML = `Order Nr: ${servingId}`;

  //create p time-id
  //transform time to human readable time
  const date = new Date(servingTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedTime = ` ${hours}:${minutes}:${seconds}`;
  const servingTimeId = document.createElement("p");
  servingTimeId.setAttribute("class", "time-id");
  servingTimeId.innerHTML = `Serving Time:  ${formattedTime}`;

  //create div beer-type
  const beerType = document.createElement("div");
  beerType.setAttribute("class", "beer-type");
  //append paragraphs
  servingsDivId.append(servingsId, servingTime, beerType);
  const beerUl = document.createElement("ul");
  beerUl.setAttribute("class", "beer");
  beerType.append(beerUl);
  //compare if there is duplicates in beer array to display it differently, then create HTML list for beers and populate it KRISTA
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
      //create span tag to fit list in
      const liSpan = document.createElement("span");

      //fix beernames from array to be used for img
      let beerNameString = beerNameValue.toString();
      let toLowerCase = beerNameString.toLowerCase();
      let strConcat = toLowerCase.replace(/\s+/g, "");
      let strIndex = strConcat.indexOf(",");
      //create img element
      const img = document.createElement("img");
      let imgName = strConcat.substring(0, strIndex);
      img.src = `${imgName}.png`;
      beerNamesLi.append(img);
      liSpan.textContent = `${beerNameValue.join(" ")}x`;
      beerNamesLi.append(liSpan);
      beerUl.append(beerNamesLi);
    }
  }
  // append clone to list
  document.querySelector("main").appendChild(copy);
}

function displayUpcomingOrders(order) {
  //this is data for upcoming orders list
  const ordersId = order.id;
  const ordersTime = order.startTime;
  const beerOrder = order.order;

  //clone template
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  //create section#orders
  const sectionOrders = document.createElement("section");
  sectionOrders.setAttribute("id", "orders");
  document.querySelector("main").appendChild(sectionOrders);
  //create orders h2
  const ordersTitle = document.createElement("h2");
  ordersTitle.textContent = "upcoming orders";

  //create div orders
  const ordersDiv = document.createElement("div");
  ordersDiv.setAttribute("class", "orders");
  sectionOrders.append(ordersTitle, ordersDiv);

  //create div order-id
  const ordersDivId = document.createElement("div");
  ordersDivId.setAttribute("class", "orders-id");
  ordersDiv.append(ordersDivId);

  //create p order-id
  const orderId = document.createElement("p");
  orderId.setAttribute("class", "order-id");
  orderId.innerHTML = `Order Nr: ${ordersId}`;

  //create p time-id
  //transform time to human readable time
  const date = new Date(ordersTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedTime = ` ${hours}:${minutes}:${seconds}`;
  const orderTimeId = document.createElement("p");
  orderTimeId.setAttribute("class", "time-id");
  orderTimeId.innerHTML = `Order Time:  ${formattedTime}`;

  //create div beer-type
  const beerType = document.createElement("div");
  beerType.setAttribute("class", "beer-type");
  //append paragraphs
  ordersDivId.append(orderId, orderTimeId, beerType);
  const beerUl = document.createElement("ul");
  beerUl.setAttribute("class", "beer");
  beerType.append(beerUl);
  //compare if there is duplicates in beer array to display it differently, then create HTML list for beers and populate it KRISTA
  for (let i = 0; i < beerOrder.length; i++) {
    // Duplicate array, it will hold unique val later
    let unique = [...new Set(beerOrder)];
    // This array counts duplicates READ MORE about SET
    let duplicates = unique.map((value) => [
      value,
      beerOrder.filter((beerName) => beerName === value).length,
    ]);
    //console.log(duplicates[i]);
    let beerNameValue = duplicates[i];
    if (beerNameValue === undefined) {
      console.log("waiting for orders");
    } else {
      //create beer list
      const beerNamesLi = document.createElement("li");
      //create span tag to fit list in
      const liSpan = document.createElement("span");

      //fix beernames from array to be used for img
      let beerNameString = beerNameValue.toString();
      let toLowerCase = beerNameString.toLowerCase();
      let strConcat = toLowerCase.replace(/\s+/g, "");
      let strIndex = strConcat.indexOf(",");
      //create img element
      const img = document.createElement("img");
      let imgName = strConcat.substring(0, strIndex);
      img.src = `${imgName}.png`;
      beerNamesLi.append(img);
      liSpan.textContent = `${beerNameValue.join(" ")}x`;
      beerNamesLi.append(liSpan);
      beerUl.append(beerNamesLi);
    }
  }

  // append clone to list
  document.querySelector("main").appendChild(copy);
}
