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
let reg ;

beforeAll(() => {
  rlAdapter = new RLAdapter(data);
});

test('costructor', () => {
  expect(rlAdapter).not.toBe(null);
});

test('test of executeTraining', () => {
  let pred = rlAdapter.executeTraining(data);
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

test('test of libAdaptation', () => {
  let matrix = { columns: 5, rows: 5 };
  reg = rlAdapter.libAdaptation(data, matrix, rlAdapter.regression);
  expect(reg).toEqual({
    transposeOfXTimesX: [
      [ 10, 44, 52, 74, 172 ],
      [ 44, 236, 252, 456, 770 ],
      [ 52, 252, 360, 444, 686 ],
      [ 74, 456, 444, 1062, 1568 ],
      [ 172, 770, 686, 1568, 4492 ]
    ],
    transposeOfXTimesY: [ [ 36 ], [ 168 ], [ 142 ], [ 318 ], [ 724 ] ],
    identity: [
      [ 1, 0, 0, 0, 0 ],
      [ 0, 1, 0, 0, 0 ],
      [ 0, 0, 1, 0, 0 ],
      [ 0, 0, 0, 1, 0 ],
      [ 0, 0, 0, 0, 1 ]
    ]
  });
});

test('test of generateRLOutput', () => {
  expect(rlAdapter.generateRLOutput(data,reg.calculate())).toEqual({
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