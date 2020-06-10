class ModelTrain {
  constructor() {
  }

  /*
  * executeTraining(data)
  * Metodo dell'interfaccia per eseguire il training, deve essere implementato da chi estende l'interfaccia
  * @param{object} data : dati per il training
  */
  executeTraining(data){
    throw new Error('executeTraining method must be implemented');
  }
}

module.exports.model = ModelTrain;
