device-status
=============

[![Build Status](https://travis-ci.org/bengreenier/device-status.svg?branch=master)](https://travis-ci.org/bengreenier/device-status)

device events on network status changes

# How

first, `npm install device-status`. then, with one host...

```
var assert = require('assert');
var ds = require('device-status');

ds("127.0.0.1").on("change", function (host, status) {
    assert.equal(host, "127.0.0.1");
    assert.equal(status, true);
});
```

or with many hosts...

```
var assert = require('assert');
var ds = require('device-status');

ds("127.0.0.1", "www.bing.com").on("change", function (host, status) {
    // host will be either `www.bing.com` or `127.0.0.1`
    // status will be either `true` or `false`
});
```

or with a custom probe interval (default is `5s`)...

```
var assert = require('assert');
var ds = require('device-status');

// probe every 10s - which is  10000ms
ds("127.0.0.1", 10000).on("change", function (host, status) {
    assert.equal(host, "127.0.0.1");
    assert.equal(status, true);
});
```

# License

MIT