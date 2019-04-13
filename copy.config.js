var copy = require('@ionic/app-scripts/config/copy.config.js');

copy.copyDateTimeCss = {
  src: ['{{ROOT}}/node_modules/ng-pick-datetime/assets/style/picker.min.css'],
  dest: '{{BUILD}}'
}

module.exports = copy;
