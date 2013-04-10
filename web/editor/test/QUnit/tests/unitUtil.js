module( "Text misc. utilities" );

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

test("Util.miscelaneus", function () {
    var v = [new Point(10,10), new Point(100,10), new Point(100,100), new Point(10,100)];
    var p = new Point(20,10);
    ok(Util.isPointInside(p, v), 'point on a border created by other points');
});