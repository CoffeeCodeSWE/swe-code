const $ = require('jquery');
const Swal = require('sweetalert2');
require('chart.js');

module.exports = class View {
  constructor() {
    this.fileInput = $('#csv-file');
    this.predInput = $('#pred-file');
    this.predCheck = $('#have-pred');
    this.selectVars = $('#select-vars');
    this.selectTarget = $('#select-target');
    this.content = $('#content');
    this.trainingForm = $('#training-form');
    this.notesInput = $('#notes');

    this.chartField = {};
    this.chartField.xSelect = $('#x-select');
    this.chartField.ySelect = $('#y-select');
    this.chartField.tSelect = $('#t-select');
    this.chartField.div = $('#div-chart');

    this.chart = null;
    this.color = false;

    $('#div-model input:radio').change(() => {
      if (this.getModel() === 'rl') {
        this.color = false;
        this.chartField.tSelect.attr('disabled','disabled');
      } else {
        this.color = true;
        this.chartField.tSelect.removeAttr('disabled');
      }
      this.updateChart();
    });

    this.predCheck.change((e) => {
      if (e.target.checked) {
        this.predInput.removeAttr('hidden');
      } else {
        this.predInput.attr('hidden', 'hidden');
      }
    });

    this.chartField.xSelect.change(() => this.updateChart());
    this.chartField.ySelect.change(() => this.updateChart());
    this.chartField.tSelect.change(() => this.updateChart());
  }

  bindFileChange(handler) {
    this.fileInput.change((e) => {
      let path = e.target.files[0].path;
      handler(path);
    });
  }

  bindLoadPredictor(handler) {
    this.predInput.change((e) => {
      let path = e.target.files[0].path;
      handler(path);
    });

  }

  bindFormSubmit(handler) {
    this.trainingForm.submit((e) => {
      e.preventDefault();

      let data = {
        variables: this.getVars(),
        target: this.getTarget()
      };

      if (data.variables.includes(data.target)) {
        this.showError('Target cannot be in variables list');
        return;
      }

      if (data.variables.length === 0) {
        this.showError('Select at least one valid variable');
        return;
      }

      if (data.target === null) {
        this.showError('Select a target');
        return;
      }

      let meta = {
        notes: this.getNotes(),
        model: this.getModel()
      };

      handler(data, meta);
    });
  }

  buildPage(json) {
    this.json = json;

    this.initSelectTarget(json);
    this.initVars(json);
    this.initChartSelect(json);
    this.updateChart();
    this.showContent();
    this.showChart();
  }

  showContent() {
    this.content.removeAttr('hidden');
  }

  showChart() {
    this.chartField.div.removeAttr('hidden');
  }

  hideContent() {
    this.content.attr('hidden', 'hidden');
  }

  hideChart() {
    this.chartField.div.attr('hidden', 'hidden');
  }

  initSelectTarget(json) {
    this.selectTarget.html('<option hidden disabled selected value> -- select an option --</option>');

    Object.keys(json).forEach((k) => {

      this.addTarget(k);
    });
  }

  initVars(json) {
    Object.keys(json).forEach((k) => {

      if (this.json[k].some(isNaN)) return;

      this.addVar(k);
    });
  }

  addVar(key) {
    let divElem = $('<div></div>', {class: 'form-check'});
    let inputElem = $('<input />', {id: key, type: 'checkbox', class: 'form-check-input'});
    let labelElem = $('<label></label>', {text: key, for: key});
    divElem.append(inputElem);
    divElem.append(labelElem);
    this.selectVars.append(divElem);
  }

  addSelectTo(field, key) {
    let optionElem = $('<option></option>', {text: key, value: key});
    field.append(optionElem);
  }

  addTarget(key) {
    this.addSelectTo(this.selectTarget, key);
  }

  getTarget() {
    return this.selectTarget.val();
  }

  getVars() {
    let vars = [];

    $('#select-vars input:checkbox:checked').each((e, item) => {
      vars.push(item.id);
    });
    return vars;
  }

  setNotes(notes) {

    this.notesInput.text(notes);
  }

  showError(message) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  }


  reset() {
    this.hideContent();
    this.hideChart();
    this.selectVars.html('');
    this.selectTarget.html('');
    this.chartField.xSelect.html('');
    this.chartField.ySelect.html('');
    this.chartField.tSelect.html('');
    this.notesInput.val('');
  }

  getNotes() {
    return this.notesInput.val();
  }

  getModel() {
    return $('#div-model input:radio:checked').val().toLowerCase();
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  createChartData(x, y, target) {
    let arrayUntilNow = [];

    let datasets = [];

    target.forEach((k) => {
      if (!arrayUntilNow.includes(k)) {
        arrayUntilNow.push(k);
        datasets.push({});
        let curr = datasets[datasets.length - 1];
        curr.label = k;
        curr.data = [];
        curr.backgroundColor = this.getRandomColor();

        for (let i = 0; i < x.length; i++) {
          if (target[i] !== k) continue;

          curr.data.push({x: x[i], y: y[i]});
        }
      }

    });
    return datasets;
  }

  initChartSelect(json) {
    this.addSelectTo(this.chartField.tSelect, 'None');

    Object.keys(json).forEach((k) => {
      this.addSelectTo(this.chartField.tSelect, k);
      if (this.json[k].some(isNaN)) return;

      this.addSelectTo(this.chartField.xSelect, k);
      this.addSelectTo(this.chartField.ySelect, k);
    });

    this.chartField.ySelect.children(2).attr('selected', 'selected');
  }

  updateChart() {
    let xLabel = this.getChartX();
    let yLabel = this.getChartY();
    let t = this.getChartTargetArray();
    this.setChartData(this.json[xLabel], this.json[yLabel], t, xLabel, yLabel);
  }

  getChartX() {
    return this.chartField.xSelect.val();
  }

  getChartY() {
    return this.chartField.ySelect.val();
  }

  getChartTargetArray() {
    let t = this.chartField.tSelect.val();
    return t !== 'None' && this.color ? this.json[t] : Array(this.json[Object.keys(this.json)[0]].length).fill(0);
  }

  setChartData(x, y, target, xLabel, yLabel) {
    let datasets = this.createChartData(x, y, target);


    if (this.chart !== null) {
      this.chart.data.datasets = datasets;
      this.chart.options.scales.xAxes[0].scaleLabel.labelString = xLabel;
      this.chart.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
      this.chart.options.legend.display = datasets.length > 1;
      this.chart.update();

      return;

    }


    let ctx = document.getElementById('data-chart').getContext('2d');
    Chart.defaults.scale.gridLines.drawOnChartArea = false;
    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: datasets,
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

    this.chart.options.legend.display = datasets.length > 1;
    this.chart.update();
  }
};
