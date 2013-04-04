describe("primitive.Point suite", function () {

    it("primitive.Point.constructor [Depends on Style.constructor, Style.equals]", function () {
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
        expect(point.x).toBe(x);
        expect(point.y).toBe(y);
        expect(style.equals(point.style)).toBe(true);
        expect(point.oType).toBe(oType);
    });

    it("primitive.Point.contains [Depends on Point.constructor]", function () {
        var x = 7;
        var y = 8;
        var point = new Point(x,y);

        expect(point.contains(x,y)).toBe(true);
    });

    it("primitive.Point.toString [Depends on Point.constructor]", function () {
        var x = 5;
        var y = 12;
        var point = new Point(x,y);
        var xyString;

        function getXYString(x,y) {
            return 'point(' + x + ',' + y + ')';
        }

        xyString = getXYString(x,y);

        expect(point.toString()).toBe(xyString);
    });

    it("primitive.Point.toSVG [Depends on Point.constructor]", function () {
        var x = 5;
        var y = 12;
        var point = new Point(x,y);
        var svgString;

        function getSVGString(x,y) {
            return "\n<circle cx=\"" + x + "\" cy=\"" + y + "\" r=\"1\" style=\"stroke:none;fill:none;stroke-width:none;stroke-linecap:butt;stroke-linejoin:miter;\" />";
        }

        svgString = getSVGString(x,y);

        expect(point.toSVG()).toBe(svgString);
    });

    it("primitive.Point.near [Depends on Point.constructor]", function () {
        var x;
        var y;
        var point;

        function getRadius(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }

        function testNear(x,y) {
            var radius = getRadius(point.x, point.y, x, y);
            expect(point.near(x, y, radius)).toBe(true);
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

    it("primitive.Point.equals [Depends on Point.constructor]", function () {
        var x = 1;
        var y = 2;
        var point = new Point(x,y);
        var equalPoint = new Point(x,y);

        expect(equalPoint.equals(point)).toBe(true);
    });

    it("primitive.Point.load [Depends on Point.constructor, Point.equals]", function () {
        var srcPoint = new Point(0,6);
        var jsonString = JSON.stringify(srcPoint);
        var jsonObj = JSON.parse(jsonString);
        var parsedPoint = Point.load(jsonObj);

        expect(parsedPoint.equals(srcPoint)).toBe(true);
    });

    it("primitive.Point.loadArray [Depends on Point.constructor, Point.equals]", function () {
        var pointArray = [new Point(1,2), new Point(1,4)];
        var jsonString = JSON.stringify(pointArray);
        var jsonObj = JSON.parse(jsonString);
        var loadedPointArray = Point.loadArray(jsonObj);
        var i;
        var length;

        expect(pointArray.length).toBe(loadedPointArray.length);

        length = pointArray.length;
        for (i = 0; i < length; i++) {
            expect( pointArray[i].equals(loadedPointArray[i])).toBe(true);
        }
    });

    it("primitive.Point.clone [Depends on Point.constructor, Point.equals]", function () {
        var point = new Point(0,6);
        var pointClone = point.clone(point);

        expect(point.equals(pointClone)).toBe(true);
    });

    it("primitive.Point.cloneArray [Depends on Point.constructor, Point.equals]", function () {
        var pointArray = [new Point(1,2), new Point(1,4)];
        var pointArrayClone = Point.cloneArray(pointArray);
        var i;
        var length;

        expect(pointArray.length).toBe(pointArrayClone.length);

        length = pointArray.length;
        for (i = 0; i < length; i++) {
            expect(pointArray[i].equals(pointArrayClone[i])).toBe(true);
        }
    });

    it("primitive.Point.getPoints [Depends on Point.constructor, Point.equals]", function () {
        var point = new Point(0,6);
        var getPoints = point.getPoints();

        expect(getPoints.length).toBe(1);
        expect(point.equals(getPoints[0])).toBe(true);
    });

    it("primitive.Point.getBounds [Depends on Point.constructor]", function () {
        var point = new Point(10,120);
        var bounds = point.getBounds();
        var boundsArray = [10, 120, 10, 120]
        var i;
        var length;

        expect(bounds.length).toBe(boundsArray.length);

        length = boundsArray.length;
        for (i = 0; i < length; i++) {
            expect( boundsArray[i]).toBe(bounds[i]);
        }
    });

});
