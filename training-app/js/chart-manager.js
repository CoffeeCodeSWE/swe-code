const {ipcRenderer} = require('electron');
const {Chart} = require('chart.js');
const $ = require('jquery');
let json_data = null;
let chart = null;

$(document).ready(() => {

  let y_select = $('#y-select');
  let x_select = $('#x-select');

  y_select.on('change', () => getParamAndUpdate());
  x_select.on('change', () => getParamAndUpdate());
});
ipcRenderer.on('chart:update', (event, args) => {
  $(document).ready(() => {
    json_data = args;

    let keys = Object.keys(json_data);

    let y_select = $('#y-select');
    let x_select = $('#x-select');
    x_select.html('');
    y_select.html('');

    let auto_sel_index = 0;
    keys.forEach((k) => {
      let xsel = $('<option></option>', {text: k, value: k});
      let ysel = $('<option></option>', {text: k, value: k});

      if (auto_sel_index === 0)
        xsel.attr('selected', true);
      else if (auto_sel_index === 1)
        ysel.attr('selected', true);

      x_select.append(xsel);
      y_select.append(ysel);
      auto_sel_index++;
    });

    let xLabel = keys[0];
    let x = json_data[xLabel];

    let yLabel = keys[1];
    let y = json_data[yLabel];

    initChart(x, y, xLabel, yLabel);
  });
});


function initChart(x, y, xLabel, yLabel) {
  let dataPoints = [];
  for (let i = 0; i < x.length; i++) {
    dataPoints.push({
      x: x[i],
      y: y[i]
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
  Chart.defaults.scale.gridLines.drawOnChartArea = true;
  Chart.defaults.global.legend.display = false;

  chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          // label: "Scatter data",
          data: dataPoints,
          backgroundColor: '#007fff',
        },
      ],
    },
    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true
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
              beginAtZero: true
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

  let y_select = $('#y-select').val();
  let x_select = $('#x-select').val();
  initChart(json_data[x_select], json_data[y_select], x_select, y_select);
}
