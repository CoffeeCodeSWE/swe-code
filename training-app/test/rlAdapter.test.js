/*
* File: rlAdapter.test.js
* Version: 
* Date: 2020-07-03
* Author: CoffeeCode <coffeecodeswe@gmail.com>
* Description: File con i test riguardanti la classe adapter per Regressione lineare
* Remarks:
*/

const RLAdapter = require('./../js/rl-adapter');

let data ={
  "variables": {
      "b": [2, 4, 8, 3, 5],
      "c": [8, 5, 9, 1, 3],
      "d": [1, 0, 20, 7, 9],
      "e": [5, 10, 20, 40, 11]
  },
  "target": {
      "y": [1, 2, 3, 5, 7]
  }
};
let rlAdapter;

beforeAll(() => {
  rlAdapter = new RLAdapter(data);
});

test('costructor', () => {
  expect(rlAdapter).not.toBe(null);
});