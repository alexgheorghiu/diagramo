"use strict";

module( "Test text outside canvas" );

test("Equal two the same texts", function () {
    var t1 = new Text("test", 100, 50, "Arial", 10, false);
    var t2 = new Text("test", 100, 50, "Arial", 10, false);

    ok(t1.equals(t2));
});

test("Clone text", function () {
    var t1 = new Text("test", 100, 50, "Arial", 10, false);
    var t2 = t1.clone();

    ok(t1.equals(t2));
});
