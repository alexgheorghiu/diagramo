"use strict";

module( "Matrix.js");

test("Matrix.isNaN", function () {
    var m1 = [-22, NaN, 0,2,3];
    ok(Matrix.isNaN(m1), 'M1 does contain NaN values');

    var m2 = [[1,2,3], [4,5,6], [7,8,9]];
    ok(!Matrix.isNaN(m2), 'M2 does NOT contain NaN values');
});

