//when DOM loads we want to start live update of the dashboard_data
window.addEventListener("DOMContentLoaded", startLiveUpdate);

//SHORT POLLING DATA- fetch updates every 2 sec
function startLiveUpdate() {
  setInterval(async () => {
    const response = await fetch("https://foobar-mandalorians.herokuapp.com/");
    const jsonData = await response.json();
    prepareOrders(jsonData);
    //console.log(jsonData);
  }, 2000);
}

//loop through upcoming orders and prepare objects for display
function prepareOrders(orders) {
  let upcomingOrder = orders.queue;
  TODO: console.log("ORDERS IN QUEUE:" + upcomingOrder.length);
  upcomingOrder.forEach((order) => {
    let id = order.id;
    let time = order.startTime;
    let beerName = order.order;
    console.log(order.order);
    displayUpcomingOrders(id, time, beerName);
  });
}

//display incoming orders
function displayUpcomingOrders(id, time, beerName) {
  // console.log(id);
  const orderId = document.querySelector(".id");
  orderId.innerHTML = `Order nr: ${id}`;

  const orderTime = document.querySelector(".time");
  orderTime.innerHTML = `Order time: ${time}`;

  const beerType = document.querySelector(".beer");
  beerType.innerHTML = `Beers: ${beerName}`;
}
