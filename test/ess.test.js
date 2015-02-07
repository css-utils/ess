var should = require('should');
var ess = require('ess');
var ast2template = require('ast2template');

describe('ess', function() {
  it('should work', function() {
    var ast = ess.file(__dirname + '/cases/constructor.ess');
    console.log(ast2template(ast, {
      keyName: false
    }));
  });
});
