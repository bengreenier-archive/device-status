var ping = require('ping');
var EventEmitter = require('events');
var util = require('util');

function DeviceStatus(hostOrHosts, interval) {
    EventEmitter.call(this);
    
    // parse args
    var hosts = null;
    if (typeof(hostOrHosts) === "string") {
        hosts = [hostOrHosts];
    } else if (typeof(hostOrHosts.length) !== "undefined") {
        hosts = hostOrHosts;
    } else {
        throw new Error("hostOrHosts should be a `string` or `array`.");
    }
    
    // parse args
    var int = null;
    if (typeof(interval) === "number") {
        int = interval;
    } else if (typeof(interval) === "undefined") {
        int = 5000;
    } else {
        throw new Error("interval should be a `number`.");
    }
    
    // internal state
    this.tickers = [];
    this.state = {};
    
    var self = this;
    for (var i = 0 ; i < hosts.length ; i++) {
        // setup the prober
        var f = function tick(pingAddr) {
            
            // probe and emit if needed
            // store internal state to self.state
            ping.promise.probe(pingAddr).then(function (res) {
                if (!self.state[pingAddr]) {
                    self.state[pingAddr] = !res.alive;
                }
                if (res.alive !== self.state[pingAddr]) {
                    self.emit("change", pingAddr, res.alive);
                    self.state[pingAddr] = res.alive;
                }
            }, function (err) {
                if (!self.state[pingAddr]) {
                    self.state[pingAddr] = true;
                }
                if (false !== self.state[pingAddr]) {
                    self.emit("change", pingAddr, false);
                    self.state[pingAddr] = false;
                }
            })
        }.bind(null, hosts[i]);
        
        // call it at interval
        this.tickers.push(setInterval(f, int));
        // and rn
        f();
    }
}

util.inherits(DeviceStatus, EventEmitter);

DeviceStatus.prototype.stop = function () {
    // cleanup tickers
    if (typeof(this.tickers) !== "undefined") {
        for (var i = 0 ; i < this.tickers.length ; i++) {
            clearInterval(this.tickers[i]);
        }
        this.tickers = [];
    }
    
    //cleanup state
    if (typeof(this.state) !== "undefined") {
        for (var prop in this.state) {
            delete this.state[prop];
        }
        delete this.state;
        this.state = {};
    }
}

var creator = function (hostOrHosts, interval) {
    return new DeviceStatus(hostOrHosts, interval);
}
creator.DeviceStatus = DeviceStatus;

module.exports = creator;