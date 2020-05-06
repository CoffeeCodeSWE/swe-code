const os = require('os');

module.exports.generateRLOutput = function (data, coefficients) {

  let keys = Object.keys(data.variables);

  let output = {};
  let predictor = {};
  predictor.tuples = data.variables[keys[0]].length;
  predictor.coefficents = {};
  let i = 1;
  keys.forEach((k) => {
    predictor.coefficents[k] = coefficients[i][0];
    i++;
  });
  predictor.intercept = coefficients[0][0];
  predictor.target = Object.keys(data.target)[0];

  output.type = 'RL';
  output.predictor = predictor;

  return output;
};

module.exports.addMeta = function (output, notes, oldData) {

  output.notes = notes;

  if (oldData !== null) {
    output.creators = oldData.creators;
    output.timestamps = oldData.timestamps;
  } else {
    output.creators = [];
    output.timestamps = [];
  }

  output.creators.push(os.userInfo().username);
  output.timestamps.push(new Date().getTime());

};
