//when DOM loads we want to start live update of the dashboard_data KRISTA
window.addEventListener("DOMContentLoaded", startLiveUpdate);

//SHORT POLLING DATA- fetch updates every 2 sec KRISTA
function startLiveUpdate() {
  setInterval(async () => {
    const response = await fetch("https://foobar-mandalorians.herokuapp.com/");
    const jsonData = await response.json();
    prepareOrders(jsonData);
    //console.log(jsonData);
  }, 2000);
}

//loop through upcoming orders and prepare objects for display KRISTA
function prepareOrders(orders) {
  let upcomingOrder = orders.queue;
  let queue = upcomingOrder.length;

  upcomingOrder.forEach((order) => {
    let ids = order.id;
    let times = order.startTime;
    let beerOrders = order.order;
    //call function to display updates
    displayUpcomingOrders(ids, times, beerOrders);
  });

  //TODO:call funcion to display queue
  console.log(`ORDERS IN QUEUE:${queue}`);
}

//display incoming orders KRISTA
function displayUpcomingOrders(ids, times, beerOrders) {
  console.log(ids);
  console.log(times);
  console.log(beerOrders);
  const orderId = document.querySelector(".id");
  orderId.textContent = `Order nr: ${ids}`;

  const orderTimes = document.querySelector(".time");
  orderTimes.innerHTML = `Order time: ${times}`;

  const beerOrder = document.querySelector(".beer");
  beerOrder.innerHTML = `Beers: ${beerOrders}`;
}
