/** Tests are running in Rhino,
 * so we need to declare it's global vars manually.
 *
 * We also declare globals from js-sources
 * to prevent polluting of global scope.
 */
//var navigator = {};
//var document = {};
//var window = {};
var R90 = {};
var R90A = {};
var IDENTITY = {};

eval(loadFile("assets/javascript/jquery-1.4.2.min.js"));
eval(loadFile("lib/style.js"));
eval(loadFile("lib/util.js"));
eval(loadFile("lib/connectionManagers.js"));
eval(loadFile("lib/stack.js"));
eval(loadFile("lib/primitives.js"));
eval(loadFile("lib/main.js"));

testCases(test,
    function setUp() {
},

    function pointConstructor() {
        var x;
        var y;
        var point;
        var style;
        var oType;

        x = 1;
        y = 2;
        point = new Point(x, y);

        // initial values from Point.constructor
        style = new Style();
        oType = 'Point';

        // testing all properties of new Point
        assert.that(point.x, eq(x));
        assert.that(point.y, eq(y));
        assert.that(style.equals(point.style), eq(true));
        assert.that(point.oType, eq(oType));
    },

    function pointContains() {
        var x = 7;
        var y = 8;
        var point = new Point(x, y);

        assert.that(point.contains(x, y), eq(true));
    },

    function pointToString() {
        var x = 5;
        var y = 12;
        var point = new Point(x, y);
        var xyString;

        function getXYString(x, y) {
            return 'point(' + x + ',' + y + ')';
        }

        xyString = getXYString(x, y);

        assert.that(point.toString(), eq(xyString));
    },

    function pointToSVG() {
        var x = 5;
        var y = 12;
        var point = new Point(x,y);
        var svgString;

        function getSVGString(x,y) {
            return "\n<circle cx=\"" + x + "\" cy=\"" + y + "\" r=\"1\" style=\"stroke:none;fill:none;stroke-width:none;stroke-linecap:butt;stroke-linejoin:miter;\" />";
        }

        svgString = getSVGString(x,y);

        assert.that(point.toSVG(), eq(svgString));
    },

    function pointNear() {
        var x;
        var y;
        var point;

        function getRadius(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }

        function testNear(x,y) {
            var radius = getRadius(point.x, point.y, x, y);
            assert.that(point.near(x, y, radius), eq(true));
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
    },

    function pointEquals() {
        var x = 1;
        var y = 2;
        var point = new Point(x,y);
        var equalPoint = new Point(x,y);

        assert.that(equalPoint.equals(point), eq(true));
    },

    function pointLoad() {
        var srcPoint = new Point(0,6);
        var jsonString = JSON.stringify(srcPoint);
        var jsonObj = JSON.parse(jsonString);
        var parsedPoint = Point.load(jsonObj);

        assert.that(parsedPoint.equals(srcPoint), eq(true));
    },

    function pointLoadArray() {
        var pointArray = [new Point(1,2), new Point(1,4)];
        var jsonString = JSON.stringify(pointArray);
        var jsonObj = JSON.parse(jsonString);
        var loadedPointArray = Point.loadArray(jsonObj);
        var i;
        var length;

        assert.that(pointArray.length, eq(loadedPointArray.length));

        length = pointArray.length;
        for (i = 0; i < length; i++) {
            assert.that( pointArray[i].equals(loadedPointArray[i]), eq(true));
        }
    },

    function pointClone() {
        var point = new Point(0,6);
        var pointClone = point.clone(point);

        assert.that(point.equals(pointClone), eq(true));
    },

    function pointCloneArray() {
        var pointArray = [new Point(1,2), new Point(1,4)];
        var pointArrayClone = Point.cloneArray(pointArray);
        var i;
        var length;

        assert.that(pointArray.length, eq(pointArrayClone.length));

        length = pointArray.length;
        for (i = 0; i < length; i++) {
            assert.that(pointArray[i].equals(pointArrayClone[i]), eq(true));
        }
    },

    function pointGetPoints() {
        var point = new Point(0,6);
        var getPoints = point.getPoints();

        assert.that(getPoints.length, eq(1));
        assert.that(point.equals(getPoints[0]), eq(true));
    },

    function pointGetBounds() {
        var point = new Point(10,120);
        var bounds = point.getBounds();
        var boundsArray = [10, 120, 10, 120]
        var i;
        var length;

        assert.that(bounds.length, eq(boundsArray.length));

        length = boundsArray.length;
        for (i = 0; i < length; i++) {
            assert.that( boundsArray[i], eq(bounds[i]));
        }
    }
);
