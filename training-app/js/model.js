const CVSFile = require('./csv-file.js');
const JSONFile = require('./json-file.js');
const {ipcRenderer} = require('electron');
const RLadapter = require('./rl-adapter');
const SVMadapter = require('./svm-adapter');

module.exports = class Model {
  constructor() {
  }


  /*
  * readFromCVS(path)
  * Legge i dati da un file CVS
  * @param{object} path : percorso del file inserito
  */
  readFromCVS(path) {
    this.cvsFile = new CVSFile(path);
    this.cvsFile.read();
    this.convertCVStoJSON();

  }

  /*
  * convertCVStoJSON()
  * Converte i file del CVS in JSON
  */
  convertCVStoJSON() {
    this.jsonFile = JSONFile.fromCVS(this.cvsFile.parsedCSV);
  }

  /*
  * getDataByFilter(param)
  * Ritorna i dati filtrati con dei parametri
  * @param{object} param : parametri di filtraggio
  * @return{object} jsonFile : dati filtrati
  */
  getDataByFilter(param) {
    return this.jsonFile.filterAndGroup(param);
  }

  /*
  * loadPredictor(path)
  * Carica il predittore da un file inserito
  * @param{object} path : percorso del file
  */
  loadPredictor(path) {
    this.predictor = JSONFile.fromPath(path);
  }

  /*
  * get notes()
  * Ritorna le note del file JSON
  * @return{object} predictor.json.notes : note del file json
  */
  get notes() {
    return this.predictor.json.notes;
  }

  /*
  * get json()
  * Ritorna il file JSON
  * @return{object} jsonFile.json : file JSON
  */
  get json() {
    return this.jsonFile.json;
  }

  set json(j) {
    this.jsonFile.json = j;
  }

  setJson(j) {
    this.jsonFile.json = j;
  }

  /*
  * calculatePredictor(data, meta)
  * Calcola e definisce l'output delle predizioni di un determinato algoritmo
  * @param{object} data : dati su cui fare il training
  * @param{object} meta : opzioni riguardanti l'applicazione
  * @return{object} output : contiene le informazioni del predittore
  */
  calculatePredictor(data, meta) {
    let adapter;
    if(meta.model === 'rl')
      adapter = new RLadapter(data);
    else
      adapter = new SVMadapter();

    let pred = adapter.executeTraining(data);

    let output = {};
    output.type = meta.model;
    output.predictor = pred;

    output.notes = meta.notes;

    return output;
  }

  /*
  * savePredictor(pred)
  * Salva il file predittore sul pc dell'utente
  * @param{object} pred : file predittore
  */
  savePredictor(pred){
    ipcRenderer.send('save', pred);
  }
};
