const { ipcRenderer } = require("electron");
require("chart.js");
const $ = require("jquery");

ipcRenderer.on("chart:update", (event, args) => {
  console.log(args);

  var axisX = [];
  var axisY = [];

  $.each(args, function (key, value) {
    //controllo se key == scelta utente
    $.each(value, function (index, val) {
      if (axisX.length < value.length) axisX.push(val);
      else if (axisY.length < axisX.length) axisY.push(val);
    });
  });
  // console.log(axisX);
  // console.log(axisY);

  var point = {};
  var dataPoints = [];

  for (var i = 0; i < axisY.length; i++) {
    point = {
      x: axisX[i],
      y: axisY[i],
    };
    dataPoints.push(point);
  }
  console.log(dataPoints);

  var ctx = document.getElementById("myChart").getContext("2d");
  Chart.defaults.scale.gridLines.drawOnChartArea = false;
  Chart.defaults.global.legend.display = false;
  var scatterChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          // label: "Scatter data",
          data: dataPoints,
          backgroundColor: "#007fff",
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "pluto",
            },
            type: "linear",
            position: "bottom",
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "pippo",
            },
          },
        ],
      },
    },
  });
});
