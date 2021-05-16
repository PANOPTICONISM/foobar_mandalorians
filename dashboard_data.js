//when DOM loads we want to start live update of the dashboard_data KRISTA
window.addEventListener("DOMContentLoaded", startLiveUpdate);

//SHORT POLLING- fetch updates every 3 sec KRISTA
function startLiveUpdate() {
  setInterval(async () => {
    const response = await fetch("https://foobar-mandalorians.herokuapp.com/");
    const jsonData = await response.json();
    prepareOrders(jsonData);
    //console.log(jsonData);
  }, 3000);
}
let displayArr = [];
//loop through upcoming orders and prepare objects for display KRISTA
function prepareOrders(orders) {
  let upcomingOrder = orders.queue;
  let queue = upcomingOrder.length;

  upcomingOrder.forEach((order) => {
    // let dataArr = Array.from(Object.values(order));
    //console.log(dataArr);

    //ccompare arrays and remove double
    // for (let i = 0; i < dataArr.length; i++) {
    //   if (displayArr.indexOf(dataArr[i]) === -1) {
    //     displayArr.push(dataArr[i]);
    //   }
    // }
    //console.log(displayArr);
    displayUpcomingOrders(order);
  });

  //TODO:call funcion to display queue
  console.log(`ORDERS IN QUEUE:${queue}`);
}

//display incoming orders with filtered values KRISTA
function displayUpcomingOrders(order) {
  let id = order.id;
  let time = order.startTime;
  let beerOrder = order.order;

  //clone template
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  //update elements with data
  const orderId = copy.querySelector(".id");
  orderId.textContent = `Order nr: ${id}`;

  //transform time to normal time
  let date = new Date(time);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let formattedTime = `${hours}:${minutes}:${seconds}`;

  const orderTimes = copy.querySelector(".time");
  orderTimes.innerHTML = `Order time: ${formattedTime}`;

  //compare if there is duplicates in beer array to display it differently, then create HTML list for beers and populate it KRISTA

  for (let i = 0; i < beerOrder.length; i++) {
    //Initial array

    // Duplicate array, it will hold unique val later
    let unique = [...new Set(beerOrder)];

    // This array counts duplicates READ MORE about SET
    let duplicates = unique.map((value) => [
      value,
      beerOrder.filter((beerName) => beerName === value).length,
    ]);
    console.log(duplicates[i].join(" "));
    const beerNames = document.createElement("li");
    beerNames.textContent = `${duplicates[i].join("  ")}x`;
    copy.querySelector(".beer").appendChild(beerNames);
  }

  // append clone to list
  document.querySelector("main").appendChild(copy);
}
