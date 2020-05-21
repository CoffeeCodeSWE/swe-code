const { ipcRenderer } = require('electron');
const { Chart } = require('chart.js');
const $ = require('jquery');
let jsonData = null;
let chart = null;

$(document).ready(() => {
  let ySelect = $('#y-select');
  let xSelect = $('#x-select');

  ySelect.on('change', () => getParamAndUpdate());
  xSelect.on('change', () => getParamAndUpdate());
});
ipcRenderer.on('chart:update', (event, args) => {
  $(document).ready(() => {
    jsonData = args;

    let keys = Object.keys(jsonData);

    let ySelect = $('#y-select');
    let xSelect = $('#x-select');
    xSelect.html('');
    ySelect.html('');

    let autoSelIndex = 0;
    keys.forEach((k) => {
      let xSel = $('<option></option>', { text: k, value: k });
      let ysel = $('<option></option>', { text: k, value: k });

      if (autoSelIndex === 0) xSel.attr('selected', true);
      else if (autoSelIndex === 1) ysel.attr('selected', true);

      xSelect.append(xSel);
      ySelect.append(ysel);
      autoSelIndex++;
    });

    let xLabel = keys[0];
    let x = jsonData[xLabel];

    let yLabel = keys[1];
    let y = jsonData[yLabel];

    initChart(x, y, xLabel, yLabel);
  });
});

function initChart(x, y, xLabel, yLabel) {
  let dataPoints = [];
  let colorPoints = createColorsArray(y);
  for (let i = 0; i < x.length; i++) {
    dataPoints.push({
      x: x[i],
      y: y[i],
    });
  }

  if (chart !== null) {
    chart.data.datasets[0].data = dataPoints;
    chart.options.scales.xAxes[0].scaleLabel.labelString = xLabel;
    chart.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
    chart.update();
    return;
  }

  let ctx = document.getElementById('data-chart').getContext('2d');
  Chart.defaults.scale.gridLines.drawOnChartArea = false;
  Chart.defaults.global.legend.display = false;

  chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          // label: "Scatter data",
          data: dataPoints,
          backgroundColor: colorPoints,
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },

            scaleLabel: {
              display: true,
              labelString: xLabel,
            },
            type: 'linear',
            position: 'bottom',
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: yLabel,
            },
          },
        ],
      },
    },
  });
}

function getParamAndUpdate() {
  let ySelect = $('#y-select').val();
  let xSelect = $('#x-select').val();
  initChart(jsonData[xSelect], jsonData[ySelect], xSelect, ySelect);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createColorsArray(target) {
  let arrayOfColors = [];
  let arrayUntilNow = [];

  arrayOfColors.push(getRandomColor());

  if (target.length > 1)
    for (let i = 1; i < target.length; i++) {
      arrayUntilNow = target.slice(0, i);
      if (arrayUntilNow.includes(target[i]) === false) {
        arrayOfColors.push(getRandomColor());
      } else {
        arrayOfColors.push(arrayOfColors[arrayUntilNow.indexOf(target[i])]);
      }
    }
  return arrayOfColors;
}
