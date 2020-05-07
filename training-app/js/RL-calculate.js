'use strict';
const Regression = require('../vendor/regression');


/*
 * calculateMatrixDimensions(data)
 * Calcola le dimensioni della matrice dei coefficienti per la RL
 * @param{object} data : il file json parsato
 * @return{object} anon : il numero di colonne e di righe per il calcolo della RL
 */
function calculateMatrixDimensions(data) {
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
function libAdaptation(data, matrix, reg) {
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

/*
 * rlFromScratch(data)
 * Calcolo della RL a partire dal file json ricevuto in input
 * @param{object} data : il file json parsato
 * @return{object} of @class{Regression} reg : oggetto al quale sono stati aggiunti i parametri per il calcolo della RL
 */
module.exports.rlFromScratch = function rlFromScratch(data) {
  let matrix = calculateMatrixDimensions(data);
  var reg = new Regression({numX: matrix.columns , numY: 1});
  return libAdaptation(data, matrix, reg);
};



/*
 * rlFromExistingData(data)
 * Calcolo della RL a partire dal file json ricevuto in input + file già di output
 * @param{object} data : il file json parsato
 * @return{object} of @class{Regression} reg : oggetto al quale sono stati aggiunti i parametri per il calcolo della RL
 */
module.exports.rlFromExistingData = function rlFromExistingData(data, outJson) { //TODO: integrarla con il main
  let matrix = calculateMatrixDimensions(data);
  var reg = new Regression({numX: matrix.columns , numY: 1});
  return libAdaptation(data, matrix, reg);
};