// In order to execute, call performUnitTest(testPrimitives)
unitPrimitives = {
    id: 'unitPrimitives',
    name: 'Test primitive figure',
    tests: [
        {
            name: 'Compare generated SVG vs content of <a href="export.svg">export.svg</a>',
            func: testSVGExport
        }
    ],
    testGroups: [
        {
            name: 'Line.contains',
            tests: [
                {
                    name: 'point on the line',
                    func: function() {
                        return new Line(new Point(10, 10), new Point(110, 60)).contains(50, 30);
                    }
                },
                {
                    name: 'point on the segment edge',
                    func: function() {
                        return new Line(new Point(10, 10), new Point(110, 60)).contains(110, 60);
                    }
                },
                {
                    name: 'point on the "infinite" line out of bounds',
                    func: function() {
                        return !new Line(new Point(10, 10), new Point(110, 60)).contains(130, 70);
                    }
                },
                {
                    name: 'point on the vertical line',
                    func: function() {
                        return new Line(new Point(50, 10), new Point(50, 60)).contains(50, 30);
                    }
                },
                {
                    name: 'point out of the vertical line',
                    func: function() {
                        return !new Line(new Point(50, 10), new Point(50, 60)).contains(60, 30);
                    }
                },
                {
                    name: 'point on the vertical line bound',
                    func: function() {
                        return new Line(new Point(50, 10), new Point(50, 60)).contains(50, 10);
                    }
                },
                {
                    name: 'point on the "infinite" vertical line out of bounds',
                    func: function() {
                        return !new Line(new Point(50, 10), new Point(50, 60)).contains(50, 70);
                    }
                }
            ]
        },
        {
            name: 'Points',
            tests: [
                {
                    name: 'points clone',
                    func: function() {
                        var r = true;
                        var v = [new Point(1,2), new Point(1,4)];
                        var cv = Point.cloneArray(v);
                        for(var i=0;i<v.length; i++){
                            if(!v[i].equals(cv[i])){
                                r = false;
                                break;
                            }
                        }
                        return r;
                    }
                }
            ]
        }
    ]
};

function testSVGExport() {
    // Collecting SVG from multiple primitive.toSVG()
    svg = '';

    //line
    var line = new Line(new Point(10, 20), new Point(40, 75));
    svg += line.toSVG();

    //polyline
    var polyline = new Polyline();
    polyline.addPoint(new Point(60, 70));
    polyline.addPoint(new Point(120, 80));
    polyline.addPoint(new Point(100, 140));
    svg += polyline.toSVG();

    //polygon
    var polygon = new Polygon();
    polygon.addPoint(new Point(60, 170));
    polygon.addPoint(new Point(120, 180));
    polygon.addPoint(new Point(100, 240));
    svg += polygon.toSVG();

    //quad curve
    var quad = new QuadCurve(new Point(100, 100), new Point(120, 140), new Point(200, 100));
    svg += quad.toSVG();

    //cubic curve
    var cubic = new CubicCurve(new Point(200, 200), new Point(250, 250), new Point(300, 150), new Point(350, 200));
    svg += cubic.toSVG();

    //text
    var text = new Text('SVG is pretty cool', 300, 300, 'Verdana', 20, true);
    var R30 = Matrix.rotationMatrix(Math.PI/6);
    text.transform(Matrix.translationMatrix(-300, -300));
    text.transform(R30);
    text.transform(Matrix.translationMatrix(300, 300));
    svg += text.toSVG();

    var text2 = new Text('SVG is pretty cool', 300, 300, 'Verdana', 20, true);
    svg += text2.toSVG();

    // retrieving SVG from export.svg file
    svgFile = $.ajax({
        url: 'export.svg',
        async: false
    }).responseText;
    svgFile = svgFile
    .replace(/[\r\n]/g, '')
    .replace(/<\?xml.*?\?>/, '')
    .replace(/<(\/)?svg.*?>/g, '');
    return svg == svgFile;
}