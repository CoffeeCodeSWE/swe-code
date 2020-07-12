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

test('test of executeTraining', () => {
  let pred = rlAdapter.executeTraining(data);
  console.log(pred);
  expect(pred).toEqual({
    tuples: 5,
    coefficents: {
      b: -0.42494629430720465,
      c: -0.9805316863587556,
      d: 0.40024167561761903,
      e: -0.13829215896885105
    },
    intercept: 9.985365198711094,
    target: 'y'
  });
});

test('test of calculateMatrixDimensions', () => {
  expect(rlAdapter.calculateMatrixDimensions(data)).toEqual({ columns: 5, rows: 5 });
});