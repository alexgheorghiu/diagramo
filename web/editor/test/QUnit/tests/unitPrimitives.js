"use strict";

module( "Primitive.Point tests" );

test("primitive.Point.constructor [Depends on Style.constructor, Style.equals]", function () {
    var x;
    var y;
    var point;
    var style;
    var oType;

    x = 1;
    y = 2;
    point = new Point(x,y);

    // initial values from Point.constructor
    style = new Style();
    oType = 'Point';

    // testing all properties of new Point
    strictEqual(point.x, x, "x of new Point is correct.");
    strictEqual(point.y, y, "y of new Point is correct.");
    ok(style.equals(point.style), "style of new Point is correct.");
    strictEqual(point.oType, oType, "oType of new Point is correct.");
});

test("primitive.Point.contains [Depends on Point.constructor]", function () {
    var x = 7;
    var y = 8;
    var point = new Point(x,y);

    ok(point.contains(x,y), "new Point(7,8).contains(7,8)");
});

test("primitive.Point.toString [Depends on Point.constructor]", function () {
    var x = 5;
    var y = 12;
    var point = new Point(x,y);
    var xyString;

    function getXYString(x,y) {
        return 'point(' + x + ',' + y + ')';
    }

    xyString = getXYString(x,y);

    strictEqual(point.toString(), xyString, "new Point(" + x + "," + y + ").toString() equals " + xyString);
});

test("primitive.Point.toSVG [Depends on Point.constructor]", function () {
    var x = 5;
    var y = 12;
    var point = new Point(x,y);
    var svgString;

    function getSVGString(x,y) {
        return "\n<circle cx=\"" + x + "\" cy=\"" + y + "\" r=\"1\" style=\"stroke:none;fill:none;stroke-width:none;stroke-linecap:butt;stroke-linejoin:miter;\" />";
    }

    svgString = getSVGString(x,y);

    strictEqual(point.toSVG(), svgString, "new Point(" + x + "," + y + ").toSVG() equals " + svgString);
});

test("primitive.Point.near [Depends on Point.constructor]", function () {
    var x;
    var y;
    var point;

    function getRadius(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    function testNear(x,y) {
        var radius = getRadius(point.x, point.y, x, y);
        ok(point.near(x, y, radius), "new Point(" + point.x + "," + point.y + ").near(" + x + "," + y + "," + radius + ")");
    }

    x = 12;
    y = 20;
    point = new Point(x,y);

    // test near() for Point's coordinates
    testNear(x,y)

    // test near() for new coordinates
    x = x - 1;
    y = y + 2;
    testNear(x,y)

    // test near() for new coordinates
    x = x + 7.5;
    y = y - 3;
    testNear(x,y)
});

test("primitive.Point.equals [Depends on Point.constructor]", function () {
    var x = 1;
    var y = 2;
    var point = new Point(x,y);
    var equalPoint = new Point(x,y);

    ok(equalPoint.equals(point), "new Point(1,2) equals to new Point(1,2)");
});

test("primitive.Point.load [Depends on Point.constructor, Point.equals]", function () {
    var srcPoint = new Point(0,6);
    var jsonString = JSON.stringify(srcPoint);
    var jsonObj = JSON.parse(jsonString);
    var parsedPoint = Point.load(jsonObj);

    ok(parsedPoint.equals(srcPoint), "Point loaded from JSON equals source Point.");
});

test("primitive.Point.loadArray [Depends on Point.constructor, Point.equals]", function () {
    var pointArray = [new Point(1,2), new Point(1,4)];
    var jsonString = JSON.stringify(pointArray);
    var jsonObj = JSON.parse(jsonString);
    var loadedPointArray = Point.loadArray(jsonObj);
    var i;
    var length;

    strictEqual(pointArray.length, loadedPointArray.length, "Lengths of loaded and actual arrays are equal.");

    length = pointArray.length;
    for (i = 0; i < length; i++) {
        ok( pointArray[i].equals(loadedPointArray[i]), i + " Point equals " + i + " loaded Point." );
    }
});

test("primitive.Point.clone [Depends on Point.constructor, Point.equals]", function () {
    var point = new Point(0,6);
    var pointClone = point.clone(point);

    ok(point.equals(pointClone), "Cloned Point equals source Point.");
});

test("primitive.Point.cloneArray [Depends on Point.constructor, Point.equals]", function () {
    var pointArray = [new Point(1,2), new Point(1,4)];
    var pointArrayClone = Point.cloneArray(pointArray);
    var i;
    var length;

    strictEqual(pointArray.length, pointArrayClone.length, "Lengths of cloned and actual arrays are equal.");

    length = pointArray.length;
    for (i = 0; i < length; i++) {
        ok( pointArray[i].equals(pointArrayClone[i]), i + " Point equals " + i + " clonned Point." );
    }
});

test("primitive.Point.getPoints [Depends on Point.constructor, Point.equals]", function () {
    var point = new Point(0,6);
    var getPoints = point.getPoints();

    strictEqual(getPoints.length, 1, "Length of getPoints equals 1");
    ok(point.equals(getPoints[0]), "getPoints[0] equals source Point");
});

test("primitive.Point.getBounds [Depends on Point.constructor]", function () {
    var point = new Point(10,120);
    var bounds = point.getBounds();
    var boundsArray = [10, 120, 10, 120]
    var i;
    var length;

    strictEqual(bounds.length, boundsArray.length, "Length of getBounds() is correct");

    length = boundsArray.length;
    for (i = 0; i < length; i++) {
        strictEqual( boundsArray[i], bounds[i], i + " bound from getBounds() is correct");
    }
});


module( "Primitive.Line tests" );

test("primitive.Line.contains [Depends on Point.constructor, Line.constructor]", function () {
    ok(new Line(new Point(10, 10), new Point(110, 60)).contains(50, 30), "point on the line");
    ok(new Line(new Point(10, 10), new Point(110, 60)).contains(110, 60), "point on the segment edge");
    ok(!new Line(new Point(10, 10), new Point(110, 60)).contains(130, 70), "point on the \"infinite\" line out of bounds");
    ok(new Line(new Point(50, 10), new Point(50, 60)).contains(50, 30), "point on the vertical line");
    ok(!new Line(new Point(50, 10), new Point(50, 60)).contains(60, 30), "point out of the vertical line");
    ok(new Line(new Point(50, 10), new Point(50, 60)).contains(50, 10), "point on the vertical line bound");
    ok(!new Line(new Point(50, 10), new Point(50, 60)).contains(50, 70), "point on the \"infinite\" vertical line out of bounds");
});

test("primitive.Line.near [Depends on Point.constructor, Point.near, Line.constructor]", function () {
    var line = new Line(new Point(10, 10), new Point(110, 10)); // horizontal line
    var pX = 30;
    var pY = 10;
    var radius = 3;

    ok(line.near(pX, pY, radius), "point on the horizontal line");

    pY = 9;
    ok(line.near(pX, pY, radius), "point is 1 point higher than horizontal line");

    pX = 1;
    ok(!line.near(pX, pY, radius), "point is shifted to left from horizontal line");

    pX = 8;
    ok(line.near(pX, pY, radius), "point is near start point");


    line = new Line(new Point(10, 10), new Point(10, 110)); //vertical line
    pX = 10;
    pY = 30;
    ok(line.near(pX, pY, radius), "point on the vertical line");

    pX = 9;
    ok(line.near(pX, pY, radius), "point is moved 1 point to the left from vertical line");

    pY = 170;
    ok(!line.near(pX, pY, radius), "point is shifted to bottom from vertical line");

    pY = 111;
    ok(line.near(pX, pY, radius), "point is near end point");


    line = new Line(new Point(10, 10), new Point(30, 30));
    pX = 20;
    pY = 20;
    ok(line.near(pX, pY, radius), "point on the inclined line");

    pX = 21;
    ok(line.near(pX, pY, radius), "point is moved 1 point to the right from inclined line");

    pY = 22;
    ok(line.near(pX, pY, radius), "point is moved 1 point to the bottom from inclined line");

    pX = 33.1;
    pY = 30;
    /* details here:
     * https://bitbucket.org/scriptoid/diagramo/issue/58/minimalistic-alteration-of-connectors-upon#comment-9406088) */
    ok(!line.near(pX, pY, radius), "blind spot case");


    line = new Line(new Point(10, 10), new Point(300, 11));
    pX = 100;
    pY = 12;
    ok(line.near(pX, pY, radius), "point is higher than max Y of line, but is closer than radius.");


    line = new Line(new Point(10, 10), new Point(11, 300));
    pX = 12;
    pY = 100;
    ok(line.near(pX, pY, radius), "point has X bigger than max X of line, but is closer than radius.");
});


module( "Primitive.Polyline tests" );

test("primitive.Polyline.getLength", function () {
//    var poly = new Polyline();
//    poly.addPoint(new Point());
    expect(0);
});

//module( "SVG Export tests" );
//
///**SVG is no longer used as export*/
//test("Compare generated SVG vs content of <a href=\"export.svg\">export.svg</a>", function () {
//    // Collecting SVG from multiple primitive.toSVG()
//    var svg = '';
//
//    //line
//    var line = new Line(new Point(10, 20), new Point(40, 75));
//    svg += line.toSVG();
//
//    //polyline
//    var polyline = new Polyline();
//    polyline.addPoint(new Point(60, 70));
//    polyline.addPoint(new Point(120, 80));
//    polyline.addPoint(new Point(100, 140));
//    svg += polyline.toSVG();
//
//    //polygon
//    var polygon = new Polygon();
//    polygon.addPoint(new Point(60, 170));
//    polygon.addPoint(new Point(120, 180));
//    polygon.addPoint(new Point(100, 240));
//    svg += polygon.toSVG();
//
//    //quad curve
//    var quad = new QuadCurve(new Point(100, 100), new Point(120, 140), new Point(200, 100));
//    svg += quad.toSVG();
//
//    //cubic curve
//    var cubic = new CubicCurve(new Point(200, 200), new Point(250, 250), new Point(300, 150), new Point(350, 200));
//    svg += cubic.toSVG();
//
//    //text
//    var text = new Text('SVG is pretty cool', 300, 300, 'Verdana', 20, true);
//    var R30 = Matrix.rotationMatrix(Math.PI/6);
//    text.transform(Matrix.translationMatrix(-300, -300));
//    text.transform(R30);
//    text.transform(Matrix.translationMatrix(300, 300));
//    svg += text.toSVG();
//
//    var text2 = new Text('SVG is pretty cool', 300, 300, 'Verdana', 20, true);
//    svg += text2.toSVG();
//
//    // retrieving SVG from export.svg file
//    var svgFile = $.ajax({
//        url: exportSVGPathPrefix + 'tests/export.svg',
//        async: false
//    }).responseText;
//    svgFile = svgFile
//        .replace(/[\r\n]/g, '')
//        .replace(/<\?xml.*?\?>/, '')
//        .replace(/<(\/)?svg.*?>/g, '');
//
//    svg = svg.replace(/[\r\n]/g, '');
//
//    ok(svg == svgFile, "svg from export.svg equals concatenation of .toSVG" );
//});