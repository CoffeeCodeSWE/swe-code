const { getCurrentWindow } = require('electron');

module.exports = class Controller {

  /*
  * constructor(model, view)
  * Costruttore del controller, crea i collegamenti con gli oggetti Model e View
  * @param{object} model : oggetto di riferimento del Mdel
  * @param{object} view : oggetto di riferimento dellaView
  */
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindFileChange(this.handleFileChanged);
    this.view.bindFormSubmit(this.handleFormSubmit);
    this.view.bindLoadPredictor(this.handleLoadPredictor);
    this.view.bindRlLine(this.handleRlLine);
  }

  /*
  * handleFileChanged(path)
  * Gestisce l'inserimento di un file
  * @param{object} path : percorso del file inserito
  */
  handleFileChanged = (path) => {

    this.view.reset();

    try {
      this.model.readFromCVS(path);
      this.view.buildPage(this.model.json);
    } catch (e) {
        this.view.showError(e.message);
        this.view.reset();
    }
  }

  /*
  * handleFormSubmit(keys, meta)
  * Gestisce il calcolo delle predizioni
  * @param{object} keys : chiavi selezionate dell'app
  * @param{object} meta : 
  */
  handleFormSubmit = (keys, meta) => {
    
    let data = this.model.getDataByFilter(keys);
    this.model.savePredictor(this.model.calculatePredictor(data, meta));
  }

  /*
  * handleLoadPredictor(path)
  * Gestisce l'inserimento di un predittore
  * @param{object} path : percorso del file predittore
  */
  handleLoadPredictor = (path) => {
    this.model.loadPredictor(path);
    //this.model.json = this.view.json;
    this.view.setNotes(this.model.notes);
  }

  handleRlLine = (keys, meta) => {
    console.log(keys);
    this.model.setJson(this.view.json);

    let data = this.model.getDataByFilter(keys);
    console.log(data);
    let coeff = this.model.calculatePredictor(data, meta);
    console.log(2222);
    let k = (Object.keys(data.variables)[0]);
    let arr = Array.from(data.variables[k], x => +x);
    console.log((arr));
    this.view.addRlLine(coeff, Math.min(...arr), Math.max(...arr));
  }

};
