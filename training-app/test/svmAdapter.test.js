/*
* File: svmAdapter.test.js
* Version: 
* Date: 2020-07-03
* Author: CoffeeCode <coffeecodeswe@gmail.com>
* Description: File con i test riguardanti la classe adapter per SVM
* Remarks:
*/

const SVMAdapter = require('./../js/svm-adapter');

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

let svmAdapter;

beforeAll(() => {
  svmAdapter = new SVMAdapter();
});

test('costructor', () => {
  expect(svmAdapter).not.toBe(null);
});

test('test of calculateMatrixDimensions', () => {
  expect(svmAdapter.calculateMatrixDimensions(data)).toEqual({ columns: 4, rows: 5 });
});

// test('test of executeTraining', () => {
//   let pred = svmAdapter.executeTraining(data);
//   console.log(pred);
//   expect(pred).toEqual({
//     data: [
//       [ 2, 8, 1, 5 ],
//       [ 4, 5, 0, 10 ],
//       [ 8, 9, 20, 20 ],
//       [ 3, 1, 7, 40 ],
//       [ 5, 3, 9, 11 ]
//     ],
//     labels: [ [ 1 ], [ 2 ], [ 3 ], [ 5 ], [ 7 ] ],
//     kernelType: 'linear',
//     kernel: [Function : linearKernel],
//     N: 5,
//     D: 4,
//     alpha: [ 0, -1.8831222317386977e+62, 0, 0, 0 ],
//     b: 1.0507822053101932e+65,
//     usew_: true,
//     w: [
//       -1.5064977853909581e+63,
//       -1.8831222317386978e+63,
//       0,
//       -3.7662444634773955e+63
//     ]
//   });
// });