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
      "y": [1, -1, 1, 1, -1]
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
//   expect(pred).toEqual({
//     data: [
//       [ 2, 8, 1, 5 ],
//       [ 4, 5, 0, 10 ],
//       [ 8, 9, 20, 20 ],
//       [ 3, 1, 7, 40 ],
//       [ 5, 3, 9, 11 ]
//     ],
//     labels: [ [ 1 ], [ -1 ], [ 1 ], [ 1 ], [ -1 ] ],
//     kernelType: 'linear',
//     kernel: ["linearKernel"],
//     N: 5,
//     D: 4,
//     alpha: [
//       0.1806383225601756,
//       0.18389653292174823,
//       0,
//       0.033776076060298796,
//       0.030517865698726172
//     ],
//     b: -2.432677659760009,
//     usew_: true,
//     w: [
//       -0.4255705868793762,
//       0.4678463948367838,
//       0.1424100636937316,
//       0.07957280330935962
//     ]
//   });
// });

test('test of splitData', () => {
  let matrix = { columns: 4, rows: 5 };
  let split = svmAdapter.splitData(data,matrix);
  expect(split).toEqual({
    val: [
      [ 2, 8, 1, 5 ],
      [ 4, 5, 0, 10 ],
      [ 8, 9, 20, 20 ],
      [ 3, 1, 7, 40 ],
      [ 5, 3, 9, 11 ]
    ],
    lab: [ [ 1 ], [ -1 ], [ 1 ], [ 1 ], [ -1 ] ]
  });
});