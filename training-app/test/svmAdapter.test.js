const SVMAdapter = require('./../js/svm-adapter');

let svmAdapter;

beforeAll(() => {
  svmAdapter = new SVMAdapter();
});

test('costructor', () => {
  expect(svmAdapter).not.toBe(null);
});