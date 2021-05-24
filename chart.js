import Chart from "chart.js/auto";

let data = [];
let label = [];
// chart object
export let chart = new Chart(myChart, {
  //type of charts
  type: "line",
  //data on X-axis
  data: {
    labels: label,
    //data on Y-axis and their labels
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
