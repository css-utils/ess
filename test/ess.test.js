var should = require('should');
var ess = require('ess');

describe('ess', function() {
  it('should work', function() {
    var ast = ess.file(__dirname + '/cases/constructor.ess');
    console.log(ast);
  });
});
