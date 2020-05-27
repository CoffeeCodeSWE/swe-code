const svm = require('./../vendor/svm');
const ModelTrain = require('./model-train').model;
module.exports = class SVMadapter extends ModelTrain {
  constructor() {
    super();
    this.svm = new svm.SVM();
  }

  /*
  * executeTraining(data)
  * Effettua il training dell'SVM
  * @param{object} data : il file json parsato
  * @return{object} svm : ritorna l'oggetto allenato
  */
  executeTraining(data) {
    let matrix = this.calculateMatrixDimensions(data);
    let svmData = this.splitData(data,matrix);
    this.svm.train(svmData.val,svmData.lab);
    return this.svm;
  }

  /*
  * calculateMatrixDimensions(data)
  * Calcola le dimensioni della matrice dei coefficienti per la RL
  * @param{object} data : il file json parsato
  * @return{object} anon : il numero di colonne e di righe per il calcolo della SVM
  */
  calculateMatrixDimensions(data) {
    let aux = data.variables;
    let columns = Object.keys(aux).length;
    let rows = (aux[Object.keys(aux)[0]]).length;
    return {'columns' : columns, 'rows' : rows};
  }

  /*
  * splitData(data,matrix)
  * Divide i dati del JSON in values = array N*D con i dati di addestramento: N #tuple, D #sorgenti
  * e labels = array[N] con i valori attesi o classificazione dei dati per l'addestramento.
  * @param{object} data : il file json parsato
  * @param{object} matrix : dimensioni della matrice
  * @return{object} svmData : oggetto contenente i dati divisi per il training
  */
  splitData(data,matrix){
    let svmData={
      val: [],
      lab: []
    };

    for(let i=0; i<matrix.rows; ++i) {
      let values=[];

      for(let j = 0; j < matrix.columns; ++j) {
        values.push(data.variables[Object.keys(data.variables)[j]][i]);
      }

      let labels=[];
      labels.push(data.target[Object.keys(data.target)][i]);
      svmData.val.push(values);
      svmData.lab.push(labels);
      //svmData.push({val: values, lab: labels});
    }
    return svmData;
  }

}

