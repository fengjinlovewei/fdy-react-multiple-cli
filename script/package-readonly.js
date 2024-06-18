let packageReadonly = {};
try {
  packageReadonly = require('./package-readonly.json');
} catch (e) {}

module.exports = packageReadonly;
