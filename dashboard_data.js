//when DOM loads we want to start live update of the dashboard_data KRISTA
window.addEventListener("DOMContentLoaded", startLiveUpdate);

//SHORT POLLING- fetch updates every 3 sec KRISTA
function startLiveUpdate() {
  setInterval(async () => {
    //TODO:fetch ONLY what you need
    const response = await fetch("https://foobar-mandalorians.herokuapp.com/");
    const jsonData = await response.json();
    prepareOrders(jsonData);
    //console.log(jsonData);
  }, 3000);
}

//loop through upcoming orders and prepare objects for display KRISTA
function prepareOrders(orders) {
  let upcomingOrder = orders.queue;
  let queue = upcomingOrder.length;
  //clear DOM elements
  document.querySelector("main").innerHTML = "";

  upcomingOrder.forEach((order) => {
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
  orderId.textContent = `Order Nr: ${id}`;

  //transform time to normal time
  let date = new Date(time);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let formattedTime = ` ${hours}:${minutes}:${seconds}`;

  const orderTimes = copy.querySelector(".time");
  orderTimes.innerHTML = `Order Time:  ${formattedTime}`;

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
    //create span tag to fit list in
    const span = document.createElement("span");
    copy.querySelector(".beer").appendChild(span);
    //fix beernames from array to be used for img
    let beerNameString = beerNameValue.toString();
    let toLowerCase = beerNameString.toLowerCase();
    let strConcat = toLowerCase.replace(/\s+/g, "");
    let strIndex = strConcat.indexOf(",");
    const img = document.createElement("img");
    let imgName = strConcat.substring(0, strIndex);
    img.src = `${imgName}.png`;
    copy.querySelector("span").appendChild(img);
    console.log(img);
    //create beer list
    const beerNames = document.createElement("li");
    beerNames.textContent = `${beerNameValue.join(" ")}x`;
    copy.querySelector("span").appendChild(beerNames);
  }

  // append clone to list
  document.querySelector("main").appendChild(copy);
}
