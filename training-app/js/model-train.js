class ModelTrain {
  constructor() {
  }

  executeTraining(data){
    throw new Error('executeTraining method must be implemented');
  }
}

module.exports.model = ModelTrain;
