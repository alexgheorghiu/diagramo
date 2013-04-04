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
    var radius;

    function getRadius(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    x = 7;
    y = 8;
    point = new Point(x,y);

    // test near() for Point's coordinates
    ok(point.near(x,y,1), "Point is near it's coordinates");

    x = x - 1;
    y = y + 2;
    radius = getRadius(point.x, point.y, x, y);

    // test near() for new coordinates
    ok(point.near(x, y, radius), "new Point(" + point.x + "," + point.y + ").near(" + x + "," + y + "," + radius + ")");

    x = x + 7.5;
    y = y - 3;
    radius = getRadius(point.x, point.y, x, y);

    // test near() for new coordinates
    ok(point.near(x, y, radius), "new Point(" + point.x + "," + point.y + ").near(" + x + "," + y + "," + radius + ")");
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