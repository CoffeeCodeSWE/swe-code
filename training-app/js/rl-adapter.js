const Regression = require('./../vendor/regression');
const ModelTrain = require('./model-train').model;
module.exports = class RLadapter extends ModelTrain {
  constructor(options) {
    super();
    let matrix = this.calculateMatrixDimensions(options);
    this.regression = new Regression({numX: matrix.columns , numY: 1});
  }

  /*
  * executeTraining(data)
  * Effettua il training e calcola i coefficienti
  * @param{object} data : il file json parsato
  * @return{object} reg : ritorna i coefficienti
  */
  executeTraining(data) {
    let matrix = this.calculateMatrixDimensions(data);
    let reg = this.libAdaptation(data, matrix, this.regression);
    return reg.calculate();
  }

  /*
  * calculateMatrixDimensions(data)
  * Calcola le dimensioni della matrice dei coefficienti per la RL
  * @param{object} data : il file json parsato
  * @return{object} anon : il numero di colonne e di righe per il calcolo della RL
  */
  calculateMatrixDimensions(data) {
    let aux = data.variables;
    let columns = Object.keys(aux).length;
    let rows = (aux[Object.keys(aux)[0]]).length;
    return {'columns' : columns+1, 'rows' : rows};
  }

  /*
  * libAdaptation(data, matrix, reg)
  * Adattamento della libreria di RL per il programma necessario
  * @param{object} data : il file json parsato
  * @param{object} matrix : il numero di colonne e di righe per il calcolo della RL
  * @param{object} of @class{Regression} reg : oggetto al quale aggiungere i parametri per il calcolo della RL
  * @return{object} of @class{Regression} reg : oggetto al quale sono stati aggiunti i parametri per il calcolo della RL
  */
  libAdaptation(data, matrix, reg) {
    for(let i=0; i<matrix.rows; ++i) {
      let A = [];
      A.push(1);

      for(let j = 0; j < matrix.columns-1; ++j) {
        A.push(data.variables[Object.keys(data.variables)[j]][i]);
      }

      let yNow =[];
      yNow.push(data.target[Object.keys(data.target)][i]);
      reg.push({x: A, y: yNow});
    }
    return reg;
  }

}
