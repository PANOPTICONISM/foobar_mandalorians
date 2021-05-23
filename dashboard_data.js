import Chart from "chart.js/auto";
("use strict");
window.addEventListener("DOMContentLoaded", startLiveUpdate);

//chart data holders
let data = [];
let label = [];

// chart object
let chart = new Chart(myChart, {
  //type of charts
  type: "line",
  //type: "radar",
  //type: "bar",
  // type: "polarArea",

  //data on X-axis
  data: {
    labels: label,
    //data on Y-axis and their respective labels
    datasets: [
      {
        data: data,
        //make it dynamic??
        backgroundColor: [
          "orange",
          " pink",
          "bisque",
          "teal",
          "green",
          "lightblue",
          "red",
          "lightgreen",
          "yellow",
          "black",
        ],
        borderColor: ["orange"],
        borderWidth: 1,
        //do you want to fill below the line
        fill: false,
        lineTension: 0,
        pointRadius: 10,
        stepped: false,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        maintainAspectRatio: false,
        gridLines: {
          display: false,
        },
      },
    },

    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 1,
        to: 0,
        loop: true,
      },
    },

    plugins: {
      title: {
        display: true,
        text: "POPULAR NOW",
        color: "orange",
        font: {
          size: 18,
        },
      },
      legend: {
        display: false,
      },
    },
  },
});

//fix beernames from array to be used for img on orders/servings KRISTA
function fixImgName(arr) {
  const beerNameString = arr.toString();
  const toLowerCase = beerNameString.toLowerCase();
  let strConcat = toLowerCase.replace(/\s+/g, "");
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

//fetch data every 2sec KRISTA
function startLiveUpdate() {
  setInterval(async () => {
    const response = await fetch("https://foobar-mandalorians.herokuapp.com/");
    const jsonData = await response.json();
    prepareData(jsonData);
  }, 2000);
}

//prepare data and call all the functions from here KRISTA
function prepareData(dashboardData) {
  //clearr cards
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
    label = beer.name;
    data = beer.amount + Math.floor(Math.random() * 3);
    addData(chart, label, data);
  });
  dashboardData.serving.forEach((serving) => {
    displayUpcomingServings(serving);
  });
  dashboardData.queue.forEach((order) => {
    displayUpcomingOrders(order);
  });

  dashboardData.storage.forEach((beer) => {
    console.log(beer.name);
    console.log(beer.amount);
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
  console.log(`ORDERS IN QUEUE:${queueLength}`);
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
  orderId.textContent = `Order Nr: ${servingId}`;
  const time = copy.querySelector(".serving-time");
  time.textContent = `Order Time: ${currentTime(servingTime)}`;

  //create beer list
  const beerUl = document.createElement("ul");
  beerUl.setAttribute("class", "beer");
  copy.querySelector(".beer-type").appendChild(beerUl);

  //MOVE TO ORDERS
  let count = 1;
  for (let i = 0; i < beerServing.length; i++) {
    if (beerServing[i] !== beerServing[i + 1]) {
      let value = `${beerServing[i]} ${count}`;
      // //push this to beer labels
      // beerLabels.push(beerServing[i]);
      // //push this to beer number arr
      // beerOrderNumbers.push(count);
      let beerNameValue = value;
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
        beerNamesLi.append(img);
        liSpan.textContent = `${beerNameValue}x`;
        beerNamesLi.append(liSpan);
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
      img.setAttribute("class", "beers");
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
