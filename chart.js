import Chart from "chart.js/auto";
const myChart = document.querySelector("#myChart");
let label = ["beer3", "beer4", "beer5"];
let data = [132, 122, 305];

//create chart first
let chart = new Chart(myChart, {
  //type of charts
  type: "line",
  type: "pie",
  type: "radar",
  type: "bar",
  type: "doughnut",
  //type: "polarArea",
  type: "bar",

  //data horizontal
  data: {
    labels: label,
    //labels: ["Popular Beers"],
    datasets: [
      {
        label: "Popular Beers",
        //data vertical
        data: data,
        backgroundColor: [
          "orange",
          "blue",
          "rgba(54, 162, 235, 0.2)",
          // "rgba(255, 206, 86, 0.2)",
          // "rgba(75, 192, 192, 0.2)",
          // "rgba(153, 102, 255, 0.2)",
          // "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "black",
          // "rgba(255, 99, 132, 1)",
          // "rgba(54, 162, 235, 1)",
          // "rgba(255, 206, 86, 1)",
          // "rgba(75, 192, 192, 1)",
          // "rgba(153, 102, 255, 1)",
          // "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 1,
        to: 0,
        loop: true,
      },
    },
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
      maintainAspectRatio: false,
    },
  },
});

function addData(chart, label, data) {
  console.log(chart);
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

// function removeData(chart) {
//   chart.data.labels.pop();
//   chart.data.datasets.forEach((dataset) => {
//     dataset.data.pop();
//   });
//   chart.update();
// }

addData(chart, label, data);
