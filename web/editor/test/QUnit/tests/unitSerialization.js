"use strict";

module( "Tests serialization of data" );

test("test arc", function () {
    var a = new Arc(10, 10, 5, 30, 45, 1, 1);

    var ser = JSON.stringify(a);
    var unser = eval('(' + ser + ')');
    var newA = Arc.load(unser);

    ok(a.equals(newA));
});

test("test cubic curve", function () {
    var p1 = new Point(10, 10);
    var p2 = new Point(15, 20);
    var p3 = new Point(5, 40);
    var p4 = new Point(7, 35);
    var c = new CubicCurve(p1, p2, p3, p4);


    var ser = JSON.stringify(c);
    var unser = eval('(' + ser + ')');
    var newC = CubicCurve.load(unser);

    ok(c.equals(newC));
});

test("test dashed arc", function () {
    var da = new DashedArc(100, 100, 50, 30, 45, 0, 1, 3);

    var ser = JSON.stringify(da, Util.operaReplacer);
    var unser = eval('(' + ser + ')');
    var newDa = DashedArc.load(unser);

    ok(da.equals(newDa));
});

test("test ellipse", function () {
    var cp = new Point(100, 100);
    var e = new Ellipse(cp, 80, 40);

    var ser = JSON.stringify(e);
    var unser = eval('(' + ser + ')');
    var newE = Ellipse.load(unser);

    ok(e.equals(newE) && (e.getBounds()[0] == newE.getBounds()[0] && e.getBounds()[1] == newE.getBounds()[1]));
});

test("test figure", function () {
    var f = null;
    var newF = null;
//    try{
        f = figure_Rectangle(10, 23);

        var ser = JSON.stringify(f);
        var unser = eval('(' + ser + ')');

        newF = Figure.load(unser);
//    } catch(e){
//        alert('unitSerialization.js -->test figure--> Error:' + e);
//    }
    ok(f.equals(newF));
});

test("test line", function () {
    var startPoint = new Point(10, 10);
    var endPoint = new Point(20, 30);
    var l = new Line(startPoint, endPoint);

    var ser = JSON.stringify(l);
    var unser = eval('(' + ser + ')');
    var newL = Line.load(unser);

    ok(l.equals(newL));
});

test("test path", function () {
    var p = new Path();
    var x = 50;
    var y = 50;
    p.style.fillStyle = "#804000";

    var pl = new Polyline();
    pl.addPoint(new Point(x, y));
    pl.addPoint(new Point(x, y + 75));
    pl.addPoint(new Point(x + 75, y + 75));
    pl.addPoint(new Point(x + 75, y));
    p.addPrimitive(pl);

    var c = new QuadCurve(new Point(x + 75, y),
        new Point(x + 40, y + 40), new Point(x, y));
    p.addPrimitive(c);

    var ser = JSON.stringify(p);
    var unser = eval('(' + ser + ')');
    var newP = Path.load(unser);

    ok(p.equals(newP));
});

test("test point", function () {
    var x = new Point(10, 22);

    var ser = JSON.stringify(x);
    var unser = eval('(' + ser + ')');
    var newX = Point.load(unser);

    ok(x.getBounds()[0] == newX.getBounds()[0] && x.getBounds()[1] == newX.getBounds()[1]);
});

test("test polygon", function () {
    var p = new Polygon();
    var p1 = new Point(10, 10);
    var p2 = new Point(15, 20);
    var p3 = new Point(5, 40);
    p.addPoint(p1);
    p.addPoint(p2);
    p.addPoint(p3);

    var ser = JSON.stringify(p);
    var unser = eval('(' + ser + ')');
    var newP = Polygon.load(unser);

    ok(p.equals(newP));
});

test("test polyline", function () {
    var p = new Polyline();
    var p1 = new Point(10, 10);
    var p2 = new Point(15, 25);
    p.addPoint(p1);
    p.addPoint(p2);


    var ser = JSON.stringify(p);
    var unser = eval('(' + ser + ')');
    var newP = Polyline.load(unser);

    ok(p.equals(newP));
});

test("test quad curve", function () {
    var p1 = new Point(10, 10);
    var p2 = new Point(15, 20);
    var p3 = new Point(5, 40);
    var q = new QuadCurve(p1, p2, p3);

    var ser = JSON.stringify(q);
    var unser = eval('(' + ser + ')');
    var newQ = QuadCurve.load(unser);

    ok(q.equals(newQ));
});

test("test text", function () {
    var t = new Text("Alex has some pears", 100, 70, 'arial', 14);

    var ser = JSON.stringify(t);
    var unser = eval('(' + ser + ')');
    var newT = Text.load(unser);

    ok(t.equals(newT));
});

test("test ConnectionPoint", function () {
    var conPo = new ConnectionPoint(1, new Point(20,34), 12, ConnectionPoint.TYPE_FIGURE);

    var ser = JSON.stringify(conPo);
    var unser = eval('(' + ser + ')');
    var newConPo = ConnectionPoint.load(unser);

    ok(conPo.equals(newConPo));
});

test("test Connector", function () {
    var con = new Connector(new Point(10, 20), new Point(14, 78), Connector.TYPE_STRAIGHT, 1);

    var ser = JSON.stringify(con);
    var unser = eval('(' + ser + ')');
    var newCon = Connector.load(unser);

    ok(con.equals(newCon));
});

test("test Glue", function () {
    var glue = new Glue(34, 178, false);
    glue.type1 = 'figure';
    glue.type2 = 'figure';

    var ser = JSON.stringify(glue);
    var unser = eval('(' + ser + ')');
    var newGlue = Glue.load(unser);

    ok(glue.equals(newGlue));
});

test("test Group", function () {
//    try{
        var gr = new Group();
        gr.permanent = true;

        var ser = JSON.stringify(gr);
        var unser = eval('(' + ser + ')');
        var newGr = Group.load(unser);
//    } catch(e){
//        alert(e);
//    }
    ok(gr.equals(newGr));
});

test("test Handle", function () {
    var aHandle = new Handle('ne');


    var ser = JSON.stringify(aHandle);
    var unser = eval('(' + ser + ')');
    var newH = Handle.load(unser);

    ok(aHandle.equals(newH));
});

test("test BuilderProperty", function () {
    var bp = new BuilderProperty('A name', 'one.two.three', BuilderProperty.TYPE_TEXT);


    var ser = JSON.stringify(bp);
    var unser = eval('(' + ser + ')');
    var newBp = BuilderProperty.load(unser);

    ok(bp.equals(newBp));
});

test("test ConnectionManager", function () {
    var conMan = new ConnectorManager();

    var cId1 = conMan.connectorCreate(new Point(10,10), new Point(12,34), Connector.TYPE_STRAIGHT);

    var cp1 = conMan.connectionPointCreate(23, new Point(20,34), 11, ConnectionPoint.TYPE_FIGURE);
    var cp2 = conMan.connectionPointCreate(cId1, new Point(20,34), 12, ConnectionPoint.TYPE_CONNECTOR);

    var g1 = conMan.glueCreate(cp1.id, cp2.id, false);


    var ser = JSON.stringify(conMan);
    var unser = eval('(' + ser + ')');
    var newConMan = ConnectorManager.load(unser);

    ok(conMan.equals(newConMan));
});

test("test Stack", function () {
//    try{
        var aStack = new Stack();

        var f = figure_Rectangle(10, 23);
        f.id = 0;

        aStack.figureAdd(f);

        var ser = JSON.stringify(aStack);
        var unser = eval('(' + ser + ')');
        var newStack = Stack.load(unser);

        ok(aStack.equals(newStack));

//    } catch (e){
//        alert(e);
//    }
});