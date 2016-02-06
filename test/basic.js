var ds = require('../index');
var assert = require('assert');

//
// these are pretty basic tests
// all this is really verifying is that
// the code isn't completely wrecked
//
describe("DeviceStatus", function () {
    it("should be a function", function () {
        assert.equal(typeof(ds), "function");
    });
    
    it("should probe 127.0.0.1", function (done) {
        this.timeout(10*1000);
        
        var i = ds("127.0.0.1");
        i.on("change", function (host, up) {
            assert.equal(host, "127.0.0.1");
            assert.equal(up, true);
            done();
        });
    });
    
    it("should probe bing.com", function (done) {
        this.timeout(10*1000);
        
        var i = ds("www.bing.com");
        i.on("change", function (host, up) {
            assert.equal(host, "www.bing.com");
            assert.equal(up, true);
            done();
        });
    });
});