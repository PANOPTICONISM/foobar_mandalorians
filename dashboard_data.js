window.addEventListener("DOMContentLoaded", startLiveUpdate);

//time is in its own file
import {
  currentTime
} from "./helpers";
//chart is in its own file
import {
  chart
} from "./chart";

//fetch data every 3sec KRISTA
function startLiveUpdate() {
  setInterval(async () => {
    const response = await fetch("https://foobar-mandalorians.herokuapp.com/");
    const jsonData = await response.json();
    prepareData(jsonData);
  }, 2000);
}

//prepare data and call all the functions from here KRISTA
function prepareData(dashboardData) {
  //clear cards
  document.querySelector(".serving-box").innerHTML = "";
  document.querySelector(".order-box").innerHTML = "";
  //clear chart canvas
  chart.data.labels = [];
  //chart.data.datasets[0].data = [];
  const beerArr = chart.data.datasets[0].data.length;
  if (beerArr > 100) {
    console.log("update beer data");
    chart.data.datasets[0].data = [];
  }
  dashboardData.storage.forEach((beer) => {
    let label = beer.name;
    //TODO: calculate reverse, so 1=biggestnum
    let data = beer.amount + Math.floor(Math.random() * 3);
    addData(chart, label, data);
  });
  dashboardData.serving.forEach((serving) => {
    displayUpcomingServings(serving);
  });

  queueDynamic(dashboardData.queue);
  dashboardData.queue.forEach((order) => {
    displayUpcomingOrders(order);
  });

  let queue = dashboardData.queue.length;
  showQueueLength(queue);

  let time = dashboardData.timestamp;
  showCurrentTime(time);
}

//update chart data KRISTA
function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

//queue length KRISTA
function showQueueLength(queueLength) {
  // console.log(`ORDERS IN QUEUE:${queueLength}`);
}

// showint timestamp as time KRISTA
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
  orderId.textContent = `Order Nr - ${servingId}`;
  const time = copy.querySelector(".serving-time");
  time.textContent = currentTime(servingTime);
  const tableNr = copy.querySelector(".table .number");
  const lastDigit = serving.id.toString().slice(-1);
  tableNr.textContent = Number(lastDigit) + 1;

  //create beer list
  const beerUl = document.createElement("ul");
  beerUl.setAttribute("class", "beer");
  copy.querySelector(".beer-type").appendChild(beerUl);

  //count beer name and display it as a number
  let count = 1;
  for (let i = 0; i < beerServing.length; i++) {
    if (beerServing[i] !== beerServing[i + 1]) {
      //console.log(beerServing[i + 1]);
      let beerNameValue = `${beerServing[i]}`;
      let beerCount = `${count}`;
      //console.log(count);
      if (beerNameValue === undefined) {
        console.log("beer is pouring");
      } else {
        //create beer list
        const beerNamesLi = document.createElement("li");
        //create span tag to fit in list
        const liSpan = document.createElement("span");
        //create img element
        const img = document.createElement("img");
        img.setAttribute("class", "beers");
        //uses  fixname function to pass in specific val as param
        img.src = `${beerServing[i].toLowerCase().replace(/\s/g, "")}.png`;
        //this div now displays number of beers ordered
        const imageBox = document.createElement("div");
        imageBox.setAttribute("class", "image_box");
        const beerInfo = document.createElement("div");
        beerInfo.setAttribute("class", "beer_info");
        const beerAmount = document.createElement("span");
        beerAmount.setAttribute("class", "amount");
        beerAmount.innerHTML = `${beerCount}X`;
        imageBox.append(img);
        imageBox.append(beerAmount);
        liSpan.textContent = `${beerNameValue}`;
        const beerType = document.createElement("span");
        if (beerNameValue === "Fairy Tale Ale" || beerNameValue === "GitHop" || beerNameValue === "Hoppile Ever After") {
          beerType.textContent = "IPA";
        } else if (beerNameValue === "El Hefe") {
          beerType.textContent = "Hefewizen";
        } else if (beerNameValue === "Hollaback Lager") {
          beerType.textContent = "Oktoberfest";
        } else if (beerNameValue === "Mowintime") {
          beerType.textContent = "European Lager";
        } else if (beerNameValue === "Row 26") {
          beerType.textContent = "Stout";
        } else if (beerNameValue === "Ruined Childhood" || beerNameValue === "Sleighride") {
          beerType.textContent = "Belgian Specialty Ale";
        } else if (beerNameValue === "Steampunk") {
          beerType.textContent = "California Common";
        } else {
          console.log("not me")
        }
        beerInfo.append(liSpan);
        beerInfo.append(beerType);
        beerNamesLi.append(imageBox);
        beerNamesLi.append(beerInfo);
        beerUl.append(beerNamesLi);
      }
    } else {
      count++;
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
  const copy = template.cloneNode(true);
  //update elements with data
  const orderNrId = copy.querySelector(".order-id");
  orderNrId.textContent = `Order Nr: ${orderId}`;
  const time = copy.querySelector(".order-time");
  time.textContent = currentTime(orderTime);
  const tableNr = copy.querySelector(".table .number");
  const lastDigit = order.id.toString().slice(-1);
  tableNr.textContent = Number(lastDigit) + 1;
  // create list
  const beerUl = document.createElement("ul");
  beerUl.setAttribute("class", "beer");
  copy.querySelector(".beer-type").appendChild(beerUl);
  //count beer name and display it as a number
  let count = 1;
  for (let i = 0; i < beerOrder.length; i++) {
    if (beerOrder[i] !== beerOrder[i + 1]) {
      //console.log(beerServing[i + 1]);
      let beerNameValue = `${beerOrder[i]}`;
      let beerCount = `${count}`;
      //console.log(count);
      if (beerNameValue === undefined) {
        console.log("waiting for orders");
      } else {
        //create beer list
        const beerNamesLi = document.createElement("li");
        //create span tag to fit in list
        const liSpan = document.createElement("span");
        //create img element
        const img = document.createElement("img");
        img.setAttribute("class", "beers");
        //uses  fixname function to pass in specific val as param
        img.src = `${beerOrder[i].toLowerCase().replace(/\s/g, "")}.png`;
        //this div now displays number of beers ordered
        const imageBox = document.createElement("div");
        imageBox.setAttribute("class", "image_box");
        const beerInfo = document.createElement("div");
        beerInfo.setAttribute("class", "beer_info");
        const beerAmount = document.createElement("span");
        beerAmount.setAttribute("class", "amount");
        beerAmount.innerHTML = `${beerCount}X`;
        imageBox.append(img);
        imageBox.append(beerAmount);
        liSpan.textContent = `${beerNameValue}`;
        const beerType = document.createElement("span");
        if (beerNameValue === "Fairy Tale Ale" || beerNameValue === "GitHop" || beerNameValue === "Hoppile Ever After") {
          beerType.textContent = "IPA";
        } else if (beerNameValue === "El Hefe") {
          beerType.textContent = "Hefewizen";
        } else if (beerNameValue === "Hollaback Lager") {
          beerType.textContent = "Oktoberfest";
        } else if (beerNameValue === "Mowintime") {
          beerType.textContent = "European Lager";
        } else if (beerNameValue === "Row 26") {
          beerType.textContent = "Stout";
        } else if (beerNameValue === "Ruined Childhood" || beerNameValue === "Sleighride") {
          beerType.textContent = "Belgian Specialty Ale";
        } else if (beerNameValue === "Steampunk") {
          beerType.textContent = "California Common";
        } else {
          console.log("not me")
        }
        beerInfo.append(liSpan);
        beerInfo.append(beerType);
        beerNamesLi.append(imageBox);
        beerNamesLi.append(beerInfo);
        beerUl.append(beerNamesLi);
      }
    } else {
      count++;
    }
  }
  document.querySelector(".order-box").appendChild(copy);
}

// queue size and bar - maria
function queueDynamic(q) {
  const queueNumber = document.querySelector(".queue-number span");
  queueNumber.textContent = q.length;

  const bar = document.querySelector(".inner_bar");
  bar.style.width = q.length + "0px";
}