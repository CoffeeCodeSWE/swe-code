module.exports = class InvalidCSVFile extends Error {
  constructor(...params) {
    super(params);
  }
};
