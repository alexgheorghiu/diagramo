"use strict";

module( "Util.js");

test("Util.lineIntersectsLine", function () {
    var l1 = new Line(new Point(10, 10), new Point(100, 100));
    var l2 = new Line(new Point(50, 10), new Point(10, 200));
    ok(Util.lineIntersectsLine(l1, l2),'intersected lines');

    var l1 = new Line(new Point(0, 0), new Point(100, 100));
    var l2 = new Line(new Point(10, 0), new Point(110, 100));
    ok(!Util.lineIntersectsLine(l1, l2),'parallel lines');

    var l1 = new Line(new Point(0, 0), new Point(200, 100));
    var l2 = new Line(new Point(80, 40), new Point(220, 110));
    ok(Util.lineIntersectsLine(l1, l2),'coincide "infinite" lines with intersected segments');

    var l1 = new Line(new Point(0, 0), new Point(80, 40));
    var l2 = new Line(new Point(200, 100), new Point(220, 110));
    ok(!Util.lineIntersectsLine(l1, l2),'coincide "infinite" lines with not intersected segments');

    var l1 = new Line(new Point(10, 10), new Point(100, 100));
    var l2 = new Line(new Point(60, 10), new Point(40, 30));
    ok(!Util.lineIntersectsLine(l1, l2), 'not intersected segments based on intersected "infinite" lines (check bounds)');

    var l1 = new Line(new Point(10, 10), new Point(50, 50));
    var l2 = new Line(new Point(50, 50), new Point(100, 30));
    ok(Util.lineIntersectsLine(l1, l2), 'segments are intersected in one of their bounds' );

    var l1 = new Line(new Point(50, 0), new Point(50, 100));
    var l2 = new Line(new Point(0, 50), new Point(100, 50));
    ok(Util.lineIntersectsLine(l1, l2), 'first line is vertical');

    var l1 = new Line(new Point(0, 50), new Point(100, 50));
    var l2 = new Line(new Point(50, 0), new Point(50, 100));
    ok(Util.lineIntersectsLine(l1, l2), 'second line is vertical');

    var l1 = new Line(new Point(50, 20), new Point(50, 50));
    var l2 = new Line(new Point(-50, 40), new Point(-50, 100));
    ok(!Util.lineIntersectsLine(l1, l2), 'vertical paralel (not coincide) lines');

    var l1 = new Line(new Point(50, 20), new Point(50, 50));
    var l2 = new Line(new Point(50, 40), new Point(50, 100));
    ok(Util.lineIntersectsLine(l1, l2), 'intersected segments on the same vertical line');

    var l1 = new Line(new Point(50, 20), new Point(50, 50));
    var l2 = new Line(new Point(50, 51), new Point(50, 100));
    ok(!Util.lineIntersectsLine(l1, l2), 'not intersected segments on the same vertical line');
});


test("Util.lineIntersectsRectangle", function () {
    ok(Util.lineIntersectsRectangle(new Point(10, 10), new Point(100, 50), [30, 5, 70, 80]),
        'line intersects opposite sides of rectangle');

    ok(Util.lineIntersectsRectangle(new Point(10, 50), new Point(50, 0), [30, 5, 70, 80]),
        'line intersects adjacent sides of rectangle');

    ok(Util.lineIntersectsRectangle(new Point(50, 50), new Point(50, 100), [30, 5, 70, 80]),
        'vertical line intersects only one side of rectangle');

    ok(!Util.lineIntersectsRectangle(new Point(75, 50), new Point(100, 50), [30, 5, 70, 80]),
        'segment is outside of rectangle');

    ok(!Util.lineIntersectsRectangle(new Point(35, 70), new Point(60, 20), [30, 5, 70, 80]),
        'segment is inside of rectangle');
});


test("Util.getAngle3Points", function () {
    var a = Util.getAngle3Points(new Point(0, 0), new Point(100, 0),
        new Point(0, 100));
    ok(a * 180 / Math.PI == -45, 'angle -45');

    var a = Util.getAngle3Points(new Point(0, 0), new Point(0, 100),
        new Point(0, 0));
    ok(!a, 'angle 0');

    var a = Util.getAngle3Points(new Point(0, 0), new Point(0, 100),
        new Point(100, 100));
    ok(a == Math.PI / 2, 'angle PI/2');

    var a = Util.getAngle3Points(new Point(0, 0), new Point(0, 100),
        new Point(0, 200));
    ok(a == Math.PI, 'angle PI');

    var a = Util.getAngle3Points(new Point(100, 0), new Point(100, 100),
        new Point(0, 100));
    ok(a == 3 * Math.PI / 2, 'angle 3PI/2');
});


test("Util.Min/Max", function () {
    var v = [-22, -1, 0,2,3];
    ok(Util.min(v) == -22, 'min of a vector of numbers');

    var v = [-22, -1, 0,2,3];
    ok(Util.min(v) == -22, 'min of a vector of numbers');

    var v = [];
    ok(isNaN(Util.min(v)), 'min: vector is empty');

    var v = [1,2,3,68];
    ok(Util.max(v) == 68, 'max of a vector');
});


test("Util.collinearity", function () {
    var p1 = {x:10, y:10};
    var p2 = {x:10, y:10};
    var p3 = {x:10, y:10};
    
    //3 points coincide
    ok(Util.collinearity(p1, p2, p3), 'Collinearity test 1 failed');
    
    //only first 2 points coincide
    p3.x = 100;
    ok(Util.collinearity(p1, p2, p3), 'Collinearity test 2 failed');
    p3.x = 10;
    
    //colinear on [Ox but do not coincide
    p2.x = 5;
    ok(Util.collinearity(p1, p2, p3), 'Collinearity test 3 failed');
    p2.x = 10;
    
    //first 2 coincide again 
    p1.x = p2.x = p3.x = 10; //reset back
    p3.y =  100;
    ok(Util.collinearity(p1, p2, p3), 'Collinearity test 4 failed');
    p3.y = 10;
    
    //colinear on [Oy 
    p1.y = 5;
    p3.y = 20;
    ok(Util.collinearity(p1, p2, p3), 'Collinearity test 5 failed');

    //collinear with decimals
    p1 = {x:513, y:287};
    p2 = {x:513, y:97.35912};
    p3 = {x:385.06265, y:97.35912};
    var p4 = {x:355.06265, y:97.35912};

    // p1 and p2 are collinear on Ox, p2 and p3 are collinear on Oy
    ok(!Util.collinearity(p1, p2, p3), 'Collinearity test 6 failed');
    
    // p2, p3 and p4 are collinear on Oy
    ok(Util.collinearity(p2, p3, p4, 0.0001), 'Collinearity test 7 failed');
});


test("Util.collinearity2", function () {
    var p1 = {x:10, y:10};
    var p2 = {x:10, y:10};
    var p3 = {x:10, y:10};
    
    //3 points coincide
    ok(Util.deprecated_collinearity(p1, p2, p3), 'deprecated_collinearity test 1 failed');
    
    //only first 2 points coincide
    p3.x = 100;
    ok(Util.deprecated_collinearity(p1, p2, p3), 'deprecated_collinearity test 2 failed');
    p3.x = 10;
    
    //colinear on [Ox but do not coincide
    p2.x = 5;
    ok(Util.deprecated_collinearity(p1, p2, p3), 'deprecated_collinearity test 3 failed');
    p3.x = 10;
    
    //first 2 coincide again 
    p1.x = p2.x = p3.x = 10; //reset back
    p3.y =  100;
    ok(Util.deprecated_collinearity(p1, p2, p3), 'deprecated_collinearity test 4 failed');
    p3.y = 10;
    
    //colinear on [Oy 
    p1.y = 5;
    p3.y = 20;
    ok(Util.deprecated_collinearity(p1, p2, p3), 'deprecated_collinearity test 5 failed');

});


test("Util.miscelaneus", function () {
    var v = [new Point(10,10), new Point(100,10), new Point(100,100), new Point(10,100)];
    var p = new Point(20,10);

    // negation because isPointInside:
    // Tests whether a point is inside the area (excluding border) determined by a set of other points
    ok(!Util.isPointInside(p, v), 'point on a border is not inside another points');
});


test("Util.getMiddle", function () {
    var p1 = new Point(10,10);
    var p2 = new Point(100,100);
    var pm = Util.getMiddle(p1, p2);

    
    ok(pm.x === 55 && pm.y === 55 , 'Incorrect middle');
});


test("Util.areBoundsInBounds", function () {
    var outer = [0,0, 100,100];
    
    var inner = [10,10, 40, 40];    
    ok(Util.areBoundsInBounds(inner, outer), 'inner bounds: ' + inner +  ' inside outer bounds: ' + outer);
    
    var inner2 = [0,0, 10, 10];    
    ok(Util.areBoundsInBounds(inner, outer), 'inner bounds 2: ' + inner2 +  ' inside outer bounds: ' + outer);
    
    var wrongInner = [100, 100, 110, 110];    
    strictEqual( Util.areBoundsInBounds(wrongInner, outer), false, 'wrong inner bounds : ' + wrongInner +  ' should not be inside outer bounds: ' + outer);
});


test("Util.hexToRgb", function () {
    var hex = '#FFFFCC';
    var rgbObj = Util.hexToRgb(hex);
    ok(rgbObj.r === 255 && rgbObj.g === 255 && rgbObj.b === 204, '#FFFFCC equal to (255,255,204)');

    hex = '#AA55CC';
    rgbObj = Util.hexToRgb(hex);
    ok(rgbObj.r === 170 && rgbObj.g === 85 && rgbObj.b === 204, '#AA55CC equal to (170,85,204)');

    hex = '#573433';
    rgbObj = Util.hexToRgb(hex);
    ok(rgbObj.r === 87 && rgbObj.g === 52 && rgbObj.b === 51, '#AA55CC equal to (87,52,51)');
});


test("Util.rgbToHsl", function () {
    var hslArray = Util.rgbToHsl(255, 255, 255);
    ok(hslArray[0] === 0 && hslArray[1] === 0 && hslArray[2] === 1, 'rgbToHsl(255, 255, 255) results in [0, 0, 1]');

    hslArray = Util.rgbToHsl(255, 0, 0);
    ok(hslArray[0] === 0 && hslArray[1] === 1 && hslArray[2] === 0.5, 'rgbToHsl(255, 0, 0) results in [0, 1, 0.5]');

    hslArray = Util.rgbToHsl(0,255,255);
    ok(hslArray[0] === 0.5 && hslArray[1] === 1 && hslArray[2] === 0.5, 'rgbToHsl(0,255,255) results in [0.5, 1, 0.5]');
});


//
//test("Util.operaReplacer", function () {
//    var s = "Diagramo";
//    var i = 20;
//    var is = [1,2,3];
//    
//    //String testing
//    var s1 = JSON.stringify(s,  Util.operaReplacer);
//    var s2 = JSON.stringify(s);
//    ok(s1 === s2, "String replacement not ok");
//
//    //Integer testing
//    var i1 = JSON.stringify(i,  Util.operaReplacer);
//    var i2 = JSON.stringify(i);
//    ok(i1 === i2, "Integer replacement not ok");   
//    
//    var is1 = JSON.stringify(is,  Util.operaReplacer);
//    var is2 = JSON.stringify(is);
//    ok(is1 === is2, "Arrays of integer replacement not ok");   
//});