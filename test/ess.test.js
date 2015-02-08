var should = require('should');
var ess = require('ess');
var ast2template = require('ast2template');
var fs = require('fs');
var path = require('path');
var read = fs.readFileSync;
var readdir = fs.readdirSync;
var evalM = require('eval');
var render = require('../render');

describe('ess', function() {
  it('should construct an ast2template render function', function() {
    var ast = ess.file(__dirname + '/cases/constructor.ess');
    ast2template(ast, {
      keyName: false
    });
  });

  readdir('test/cases').forEach(function(file){
    if (file.charAt(0) === '.') return;
    it(file, function(){
      var out = ess.file(__dirname + '/cases/' + file);
      var str = ast2template(out, {
        keyName: false
      });
      var mod = evalM(str, file, {require: require}, true);
      render(mod)();
    });
  });
});
