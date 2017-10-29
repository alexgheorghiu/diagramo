"use strict";

// analog for onload event of body tag
document.addEventListener("DOMContentLoaded", function() {
    init('');
}, false);

var qunitPage = document.title.toLowerCase().indexOf('qunit') > -1;
var exportSVGPathPrefix = qunitPage ? '' : 'test/QUnit/';