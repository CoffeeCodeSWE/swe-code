const fs = require('fs');

module.exports = class JSONFile {
  /*
  * constructor(json)
  * Costruttore che costruisce l'oggetto JSON
  * @param{object} json : oggetto json passato dall'utente
  */
  constructor(json) {
    this.data = json;
  }

  /*
  * get json()
  * Ritorna i dati del JSON
  * @return{object} data : dati del json
  */
 get json() {
  return this.data;
}

set json(j) {
  this.data = j;
}


  /*
  * filterAndGroup(param)
  * Filtra i dati del JSON in base a dei parametri
  * @param{object} param : parametri per il filtro
  * @return{object} result : risultato del filtraggio
  */
  filterAndGroup(param) {
    let result = {};
    result.variables = {};
    result.target = {};
    param.variables.forEach((k) => {
      result.variables[k] = this.json[k];
    });

    result.target[param.target] = this.json[param.target];

    return result;
  }

  /*
  * fromPath(path)
  * Legge i dati dal file del path e ritorna un oggetto JSONFile
  * @param{object} path : percorso del file inserito
  * @return{object} JSONFile : oggetto JSONFile con i dati del file inserito
  */
  static fromPath(path) {
    let raw = fs.readFileSync(path, {flag: 'r'});
    return new JSONFile(JSON.parse(raw.toString()));
  }

  /*
  * fromCVS(csv)
  * Ordina i dati contenuti nel file CVS
  * @param{object} csv : file CVS
  * @return{object} JSONJSONFile(orderedData)File : oggetto JSONFile con i dati ordinati
  */
  static fromCVS(csv) {
    let jsonData = {};
    for (let i = 0; i < csv[0].length; i++) {
      let key = csv[0][i];
      jsonData[key] = [];
      for (let k = 1; k < csv.length; k++) {
        jsonData[key].push(csv[k][i]);
      }
    }
    const orderedData = {};
    Object.keys(jsonData).sort().forEach(function (key) {
      orderedData[key] = jsonData[key];
    });
    return new JSONFile(orderedData);
  }

};
