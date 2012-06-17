// In order to execute, call performUnitTest(testUtil)
unitUtil = {
    id: 'unitUtil',
    name: 'Text misc. utilities',
    testGroups: [
    {
        name: 'Util.lineIntersectsLine',
        tests: [
        {
            name: 'intersected lines',
            func: function() {
                var l1 = new Line(new Point(10, 10), new Point(100, 100));
                var l2 = new Line(new Point(50, 10), new Point(10, 200));
                return Util.lineIntersectsLine(l1, l2);
            }
        }, {
            name: 'parallel lines',
            func: function() {
                var l1 = new Line(new Point(0, 0), new Point(100, 100));
                var l2 = new Line(new Point(10, 0), new Point(110, 100));
                return !Util.lineIntersectsLine(l1, l2);
            }
        }, {
            name: 'coincide "infinite" lines with intersected segments',
            func: function() {
                var l1 = new Line(new Point(0, 0), new Point(200, 100));
                var l2 = new Line(new Point(80, 40), new Point(220, 110));
                return Util.lineIntersectsLine(l1, l2);
            }
        }, {
            name: 'coincide "infinite" lines with not intersected segments',
            func: function() {
                var l1 = new Line(new Point(0, 0), new Point(80, 40));
                var l2 = new Line(new Point(200, 100), new Point(220, 110));
                return !Util.lineIntersectsLine(l1, l2);
            }
        }, {
            name: 'not intersected segments based on intersected "infinite" lines (check bounds)',
            func: function() {
                var l1 = new Line(new Point(10, 10), new Point(100, 100));
                var l2 = new Line(new Point(60, 10), new Point(40, 30));
                return !Util.lineIntersectsLine(l1, l2);
            }
        }, {
            name: 'segments are intersected in one of their bounds',
            func: function() {
                var l1 = new Line(new Point(10, 10), new Point(50, 50));
                var l2 = new Line(new Point(50, 50), new Point(100, 30));
                return Util.lineIntersectsLine(l1, l2);
            }
        }, {
            name: 'first line is vertical',
            func: function() {
                var l1 = new Line(new Point(50, 0), new Point(50, 100));
                var l2 = new Line(new Point(0, 50), new Point(100, 50));
                return Util.lineIntersectsLine(l1, l2);
            }
        }, {
            name: 'second line is vertical',
            func: function() {
                var l1 = new Line(new Point(0, 50), new Point(100, 50));
                var l2 = new Line(new Point(50, 0), new Point(50, 100));
                return Util.lineIntersectsLine(l1, l2);
            }
        }, {
            name: 'vertical paralel (not coincide) lines',
            func: function() {
                var l1 = new Line(new Point(50, 20), new Point(50, 50));
                var l2 = new Line(new Point(-50, 40), new Point(-50, 100));
                return !Util.lineIntersectsLine(l1, l2);
            }
        }, {
            name: 'intersected segments on the same vertical line',
            func: function() {
                var l1 = new Line(new Point(50, 20), new Point(50, 50));
                var l2 = new Line(new Point(50, 40), new Point(50, 100));
                return Util.lineIntersectsLine(l1, l2);
            }
        }, {
            name: 'not intersected segments on the same vertical line',
            func: function() {
                var l1 = new Line(new Point(50, 20), new Point(50, 50));
                var l2 = new Line(new Point(50, 51), new Point(50, 100));
                return !Util.lineIntersectsLine(l1, l2);
            }
        }
        ]
    },

    {
        name: 'Util.lineIntersectsRectangle',
        tests: [
        {
            name: 'line intersects opposite sides of rectangle',
            func: function() {
                return Util.lineIntersectsRectangle(new Point(10, 10),
                    new Point(100, 50), [30, 5, 70, 80]);
            }
        }, {
            name: 'line intersects adjacent sides of rectangle',
            func: function() {
                return Util.lineIntersectsRectangle(new Point(10, 50),
                    new Point(50, 0), [30, 5, 70, 80]);
            }
        }, {
            name: 'vertical line intersects only one side of rectangle',
            func: function() {
                return Util.lineIntersectsRectangle(new Point(50, 50),
                    new Point(50, 100), [30, 5, 70, 80]);
            }
        }, {
            name: 'segment is outside of rectangle',
            func: function() {
                return !Util.lineIntersectsRectangle(new Point(75, 50),
                    new Point(100, 50), [30, 5, 70, 80]);
            }
        }, {
            name: 'segment is inside of rectangle',
            func: function() {
                return !Util.lineIntersectsRectangle(new Point(35, 70),
                    new Point(60, 20), [30, 5, 70, 80]);
            }
        }
        ]
    },

    {
        name: 'Util.getAngle3Points',
        tests: [
        {
            name: 'angle -45',
            func: function() {
                var a = Util.getAngle3Points(new Point(0, 0), new Point(100, 0),
                    new Point(0, 100));
                return a * 180 / Math.PI == -45;
            }
        }, {
            name: 'angle 0',
            func: function() {
                var a = Util.getAngle3Points(new Point(0, 0), new Point(0, 100),
                    new Point(0, 0));
                return !a;
            }
        }, {
            name: 'angle PI/2',
            func: function() {
                var a = Util.getAngle3Points(new Point(0, 0), new Point(0, 100),
                    new Point(100, 100));
                return a == Math.PI / 2;
            }
        }, {
            name: 'angle PI',
            func: function() {
                var a = Util.getAngle3Points(new Point(0, 0), new Point(0, 100),
                    new Point(0, 200));
                return a == Math.PI;
            }
        }, {
            name: 'angle 3PI/2',
            func: function() {
                var a = Util.getAngle3Points(new Point(100, 0), new Point(100, 100),
                    new Point(0, 100));
                return a == 3 * Math.PI / 2;
            }
        }
        ]
    },

    {
        name: 'Util.Min/Max',
        tests: [
        {
            name: 'min of a vector of numbers',
            func: function() {
                var v = [-22, -1, 0,2,3];
                return Util.min(v) == -22;
            }
        },

        {
            name: 'min: vector is empty',
            func: function() {
                var v = [];
                return isNaN(Util.min(v));
            }
        },

        {
            name: 'max of a vector',
            func: function() {
                var v = [1,2,3,68];
                return Util.max(v) == 68;
            }
        }
        ]
    },

    {
        name: 'Util.miscelaneus',
        tests: [
        {
            name: 'point on a border created by other points',
            func: function() {
                var v = [new Point(10,10), new Point(100,10), new Point(100,100), new Point(10,100)];
                var p = new Point(20,10);
                return Util.isPointInside(p, v);
            }
        }
        ]
    },
    ]
};
