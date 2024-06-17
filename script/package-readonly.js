let packageReadonly = {};
try {
  packageReadonly = require('./package-readonly.json');
} catch (e) {
  console.log(e);
}

module.exports = packageReadonly;
