const pathFn = require('path');
const fs = require('fs');

const htmlTmpl = fs.readFileSync(pathFn.join(__dirname, '../generator/go.html'), 'utf8');

module.exports = function(locals){
  return {
    path: 'go/index.html',
    data: htmlTmpl
  };
};