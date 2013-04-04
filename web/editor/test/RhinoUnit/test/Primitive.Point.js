/** Tests are running in Rhino,
 * so we need to declare it's global vars manually.
 *
 * We also declare globals from js-sources
 * to prevent polluting of global scope.
 */
var navigator = {};
var document = {};
var window = {};
var R90 = {};
var R90A = {};
var IDENTITY = {};

//eval(loadFile("assets/javascript/jquery-1.4.2.min.js"));
eval(loadFile("lib/style.js"));
//eval(loadFile("lib/util.js"));
//eval(loadFile("lib/connectionManagers.js"));
//eval(loadFile("lib/stack.js"));
eval(loadFile("lib/primitives.js"));
//eval(loadFile("lib/main.js"));

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
    }
/*
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
    }
*/
);
