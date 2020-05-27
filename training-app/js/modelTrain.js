class ModelTrain {
  constructor() {
      if (!this.executeTraining) {
          throw new Error('executeTraining method must be implemented');
      }
  }

  executeTraining(data){
      throw new Error('executeTraining method must be implemented');
  }
}

module.exports.model = ModelTrain;