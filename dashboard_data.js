"use strict";
//when DOM loads we want to create DOM elements KRISTA
window.addEventListener("DOMContentLoaded", startLiveUpdate);

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
  document.querySelector(".serving-box").innerHTML = "";
  document.querySelector(".order-box").innerHTML = "";

  dashboardData.serving.forEach((serving) => {
    displayUpcomingServings(serving);
  });
  dashboardData.queue.forEach((order) => {
    displayUpcomingOrders(order);
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

//populate template create missing elements and display servings KRISTA
function displayUpcomingServings(serving) {
  //this is data for serving list
  let servingId = serving.id;
  let servingTime = serving.startTime;
  let beerServing = serving.order;

  //clone template
  const template = document.querySelector("#templ-serving").content;
  const copy = template.cloneNode(true);
  //update elements with data
  const orderId = copy.querySelector(".serving-id");
  orderId.textContent = `Order Nr: ${servingId}`;
  const time = copy.querySelector(".serving-time");
  time.textContent = `Order Time: ${currentTime(servingTime)}`;

  //create list
  const beerUl = document.createElement("ul");
  beerUl.setAttribute("class", "beer");
  copy.querySelector(".beer-type").appendChild(beerUl);
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
      console.log("beer is pouring");
    } else {
      //create beer list
      const beerNamesLi = document.createElement("li");
      //create span tag to fit in list
      const liSpan = document.createElement("span");
      //create img element
      const img = document.createElement("img");
      img.setAttribute("class", "order-img");
      //       //uses  fixname function to pass in specific val as param
      img.src = `${fixImgName(beerNameValue)}.png`;
      beerNamesLi.append(img);
      liSpan.textContent = `${beerNameValue.join("  ")}x`;
      beerNamesLi.append(liSpan);
      beerUl.append(beerNamesLi);
    }
  }
  document.querySelector(".serving-box").appendChild(copy);
}
function displayUpcomingOrders(order) {
  let orderId = order.id;
  let orderTime = order.startTime;
  let beerOrder = order.order;
  //clone template
  const template = document.querySelector("#templ-orders").content;
  console.log(template);
  const copy = template.cloneNode(true);
  //update elements with data
  const orderNrId = copy.querySelector(".order-id");
  orderNrId.textContent = `Order Nr: ${orderId}`;
  const time = copy.querySelector(".order-time");
  time.textContent = `Order Time: ${currentTime(orderTime)}`;
  //create list
  const beerUl = document.createElement("ul");
  beerUl.setAttribute("class", "beer");
  copy.querySelector(".beer-type").appendChild(beerUl);
  //compare if there is duplicates in beer array to display number, then create HTML list for beers and populate it KRISTA
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
      //create img element
      const img = document.createElement("img");
      img.setAttribute("class", "order-img");
      //uses  fixname function to pass in specific val as param
      img.src = `${fixImgName(beerNameValue)}.png`;
      beerNamesLi.append(img);
      liSpan.textContent = `${beerNameValue.join(" ")}x`;
      beerNamesLi.append(liSpan);
      beerUl.append(beerNamesLi);
    }
  }
  document.querySelector(".order-box").appendChild(copy);
}
