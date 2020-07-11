/*
* File: svmAdapter.test.js
* Version: 
* Date: 2020-07-03
* Author: CoffeeCode <coffeecodeswe@gmail.com>
* Description: File con i test riguardanti la classe adapter per SVM
* Remarks:
*/

const SVMAdapter = require('./../js/svm-adapter');

let svmAdapter;

beforeAll(() => {
  svmAdapter = new SVMAdapter();
});

test('costructor', () => {
  expect(svmAdapter).not.toBe(null);
});