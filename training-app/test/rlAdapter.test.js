const RLAdapter = require('./../js/rl-adapter');

test('test of showContent', () => {
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
  let rlAdapter = new RLAdapter(data);

  expect(rlAdapter).not.toBe(null);
});