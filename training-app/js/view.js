const $ = require('jquery');
const Swal = require('sweetalert2');
require('chart.js');

module.exports = class View {

  /*
  * constructor()
  * Inizializza l'oggetto view con gli opportuni eventi
  * @param{object} model : oggetto di riferimento del Mdel
  * @param{object} view : oggetto di riferimento dellaView
  */
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
        this.chartField.tSelect.attr('disabled', 'disabled');
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

  /*
  * bindFileChange(handler)
  * Quando si verifica l'input di un file, viene registrato il path e fatto partire un handler(path) al controller
  * @param{object} handler : tipo di handler
  */
  bindFileChange(handler) {
    this.fileInput.change((e) => {
      let path = e.target.files[0].path;
      handler(path);
    });
  }

  /*
  * bindLoadPredictor(handler)
  * Quando si verifica l'input di un file predittore, viene registrato il path e fatto partire un handler(path) al controller
  * @param{object} handler : tipo di handler
  */
  bindLoadPredictor(handler) {
    this.predInput.change((e) => {
      let path = e.target.files[0].path;
      handler(path);
    });

  }

  /*
  * bindFormSubmit(handler)
  * Quando l'utente clicca sul pulsante submit esso registra le opzioni scelte e attiva un handler(data, meta) del controller
  * @param{object} handler : tipo di handler
  */
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

<<<<<<< HEAD
  bindRlLine(handler) {
    document.getElementById('data-chart').addEventListener('rl-line', (e) => {
      e = e.detail;
      console.log(e)
      handler(e.keys, e.meta);
    });
  }

  addRlLine(coeff, min, max) {
    console.log(coeff.predictor)

    let data = [{
      x: min,
      y: +coeff.predictor.coefficents[this.getChartX()] * min + coeff.predictor.intercept
    }, {
      x: max,
      y: +coeff.predictor.coefficents[this.getChartX()] * max + coeff.predictor.intercept
    }];
    console.log(data)
    this.chart.data.datasets.push({
      data: data,
      type: 'line',
      fill:false,
      borderColor: this.getRandomColor()
    });

    this.chart.update();
  }



=======
  /*
  * buildPage(json)
  * Crea la pagina della view
  * @param{object} json : file json
  */
>>>>>>> f217873fc509dbf8a14f2b9b1b418d8443016de2
  buildPage(json) {
    this.json = json;

    this.initSelectTarget(json);
    this.initVars(json);
    this.initChartSelect(json);
    this.updateChart();
    this.showContent();
    this.showChart();
  }

  /*
  * showContent()
  * Mostra il contenuto della pagina
  */
  showContent() {
    this.content.removeAttr('hidden');
  }

  /*
  * showChart()
  * Mostra i grafici della pagina
  */  
  showChart() {
    this.chartField.div.removeAttr('hidden');
  }

  /*
  * hideContent()
  * Nasconde il contenuto della pagina
  */   
  hideContent() {
    this.content.attr('hidden', 'hidden');
  }

  /*
  * hideChart()
  * Nasconde i grafici della pagina
  */
  hideChart() {
    this.chartField.div.attr('hidden', 'hidden');
  }

  /*
  * initSelectTarget(json)
  * Verifica l'interimento della variabile target da parte dell'utente
  * @param{object} json : file json
  */
  initSelectTarget(json) {
    this.selectTarget.html('<option hidden disabled selected value> -- select an option --</option>');

    Object.keys(json).forEach((k) => {

      this.addTarget(k);
    });
  }

  /*
  * initVars(json)
  * Definisce le variabili scelte dall'utente
  * @param{object} json : file json
  */
  initVars(json) {
    Object.keys(json).forEach((k) => {

      if (this.json[k].some(isNaN)) return;

      this.addVar(k);
    });
  }

  /*
  * addVar(key)
  * Aggiunge la variabile key al form
  * @param{object} key : nome della variabile
  */
  addVar(key) {
    let divElem = $('<div></div>', {class: 'form-check'});
    let inputElem = $('<input />', {id: key, type: 'checkbox', class: 'form-check-input'});
    let labelElem = $('<label></label>', {text: key, for: key});
    divElem.append(inputElem);
    divElem.append(labelElem);
    this.selectVars.append(divElem);
  }

  /*
  * addSelectTo(field, key)
  * Aggiunge una variabile selezionata alle opzioni
  * @param{object} field : dove inserire l'opzione
  * @param{object} key : nome della variabile
  */
  addSelectTo(field, key) {
    let optionElem = $('<option></option>', {text: key, value: key});
    field.append(optionElem);
  }

  /*
  * addTarget(key)
  * Aggiungere la variabile target
  * @param{object} key : nome della variabile
  */
  addTarget(key) {
    this.addSelectTo(this.selectTarget, key);
  }

  /*
  * getTarget()
  * Ritorna la variable target
  * @return{object} selectTarget.val() : variabile target
  */  
  getTarget() {
    return this.selectTarget.val();
  }

  /*
  * getVars()
  * Ritorna la variable selezionate
  * @return{object} vars : variabili selezionate
  */
  getVars() {
    let vars = [];

    $('#select-vars input:checkbox:checked').each((e, item) => {
      vars.push(item.id);
    });
    return vars;
  }

  /*
  * setNotes(notes)
  * Setta le note inserite
  * @param{object} notes : note scritte dall'utente nella form
  */
  setNotes(notes) {

    this.notesInput.text(notes);
  }

  /*
  * showError(message)
  * Mostra l'errore relativo al message
  * @param{object} message : messaggio d'errore
  */  
  showError(message) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  }


  /*
  * reset()
  * Resetta la pagina della view
  */ 
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

  /*
  * getNotes()
  * Ritorna le note inserite
  * @return{object} notesInput.val() : note inserite
  */ 
  getNotes() {
    return this.notesInput.val();
  }

  /*
  * getModel()
  * Ritorna il modello selezionato
  * @return{object} model : modello selezionato
  */  
  getModel() {
    return $('#div-model input:radio:checked').val().toLowerCase();
  }

  /*
  * getRandomColor()
  * ritorna un colore casuale
  * @return{object} color : colore casuale
  */  
  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /*
  * createChartData(x, y, target)
  * Crea il grafico nella view e ritorna i dati illustrati
  * @return{object} datasets : dati illustrati
  */ 
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

  /*
  * initChartSelect(json)
  * Inizializza il grafico con i dati selezionati
  * @param{object} json : file json
  */
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

  /*
  * updateChart()
  * Aggiorna il grafico
  */
  updateChart() {
    let xLabel = this.getChartX();
    let yLabel = this.getChartY();
    let t = this.getChartTargetArray();
    this.setChartData(this.json[xLabel], this.json[yLabel], t, xLabel, yLabel, this.getModel());
  }

  /*
  * getChartX()
  * Ritorna i dati dell'asse X
  * @return{object} chartField.xSelect.val() : dati dell'asse X
  */  
  getChartX() {
    return this.chartField.xSelect.val();
  }

  /*
  * getChartY()
  * Ritorna i dati dell'asse Y
  * @return{object} chartField.ySelect.val() : dati dell'asse Y
  */   
  getChartY() {
    return this.chartField.ySelect.val();
  }

  /*
  * getChartTargetArray()
  * Ritorna l'array con i dati della variabile target del grafico
  * @return{object} Array : dati della variabile target
  */   
  getChartTargetArray() {
    let t = this.chartField.tSelect.val();
    return t !== 'None' && this.color ? this.json[t] : Array(this.json[Object.keys(this.json)[0]].length).fill(0);
  }

<<<<<<< HEAD
  setChartData(x, y, target, xLabel, yLabel, model) {
=======
  /*
  * setChartData(x, y, target, xLabel, yLabel)
  * Imposta i dati nel grafico
  * @param{object} x : dati sull'asse x
  * @param{object} y : dati sull'asse Y
  * @param{object} xLabel : nome sull'asse x
  * @param{object} yLabel : nome sull'asse y
  */ 
  setChartData(x, y, target, xLabel, yLabel) {
>>>>>>> f217873fc509dbf8a14f2b9b1b418d8443016de2
    let datasets = this.createChartData(x, y, target);

    if (this.chart !== null) {

      this.chart.data.datasets = datasets;
      this.chart.options.scales.xAxes[0].scaleLabel.labelString = xLabel;
      this.chart.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
      this.chart.options.legend.display = datasets.length > 1;
      this.chart.update();
    } else {


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

    }
    this.chart.update();

    if (model.toLowerCase() === 'rl') {
      let keys = {
        variables: [xLabel],
        target: [yLabel]
      };

      let meta = {
        model: this.getModel().toLowerCase()
      };

      let event = new CustomEvent('rl-line', {detail: {keys: keys, meta: meta}});
      console.log("v?");
      document.getElementById('data-chart').dispatchEvent(event);
    }


  }


};

