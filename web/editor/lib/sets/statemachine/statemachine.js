"use strict";

figureSets["statemachine"] = {
    name : 'UML: State machine',
    description : 'A set of figures needed to draw state diagrams',
    figures: [
        {figureFunction: "Start", image: "start.png"},
        {figureFunction: "End", image: "end.png"},
        {figureFunction: "State", image: "state.png"},
        {figureFunction: "Note", image: "note.png"}
    ]
}


function figure_Start(x,y)
{
    var circleRadius = 7;
    
    var f = new Figure("Start");
    f.style.fillStyle = "#000000";
    f.style.strokeStyle = figure_defaultStrokeStyle;

    //CIRCLE
    var c = new Arc(x, y, circleRadius, 0, 360, false, 0);

    f.addPrimitive(c);

    //CONNECTION POINTS
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    
    return f;
}

function figure_End(x,y)
{
    var innerCircleRadius = 7;
    var outerCircleRadius = 12;
    
    var f = new Figure("Start");
    f.style.fillStyle = "#000000";
    f.style.strokeStyle = figure_defaultStrokeStyle;

    //outer circle
    var oc = new Arc(x, y, outerCircleRadius, 0, 360, false, 0);
    oc.style.fillStyle = "#FFFFFF";
    oc.style.strokeStyle = '#000000';
    f.addPrimitive(oc);
    
    //inner circle
    var ic = new Arc(x, y, innerCircleRadius, 0, 360, false, 0);
    ic.style.fillStyle = "#000000";
    oc.style.strokeStyle = '#000000';
    f.addPrimitive(ic);

    //CONNECTION POINTS
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - outerCircleRadius, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + outerCircleRadius, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x , y + outerCircleRadius), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x , y - outerCircleRadius), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    
    return f;
}


function figure_State(x,y)
{
    var f = new Figure("State");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    f.style.lineWidth = 2;

    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var p = new Path();
    var hShrinker = 10;
    var vShrinker = 6;
    var l1 = new Line(new Point(x + hShrinker, y + vShrinker),
        new Point(x + figure_defaultFigureSegmentSize - hShrinker, y + vShrinker));

    var c1 = new QuadCurve(new Point(x + figure_defaultFigureSegmentSize - hShrinker, y + vShrinker),
        new Point(x + figure_defaultFigureSegmentSize - hShrinker + figure_defaultFigureCorner*(figure_defaultFigureCornerRoundness/10), y + figure_defaultFigureCorner/figure_defaultFigureCornerRoundness + vShrinker),
        new Point(x + figure_defaultFigureSegmentSize - hShrinker + figure_defaultFigureCorner, y + figure_defaultFigureCorner + vShrinker))

    var l2 = new Line(new Point(x + figure_defaultFigureSegmentSize - hShrinker + figure_defaultFigureCorner, y + figure_defaultFigureCorner + vShrinker),
        new Point(x + figure_defaultFigureSegmentSize - hShrinker + figure_defaultFigureCorner, y + figure_defaultFigureCorner + figure_defaultFigureSegmentShortSize - vShrinker));

    var c2 = new QuadCurve(new Point(x + figure_defaultFigureSegmentSize - hShrinker + figure_defaultFigureCorner, y + figure_defaultFigureCorner + figure_defaultFigureSegmentShortSize - vShrinker),
        new Point(x + figure_defaultFigureSegmentSize - hShrinker + figure_defaultFigureCorner*(figure_defaultFigureCornerRoundness/10), y + figure_defaultFigureCorner + figure_defaultFigureSegmentShortSize - vShrinker + figure_defaultFigureCorner*(figure_defaultFigureCornerRoundness/10)),
        new Point(x + figure_defaultFigureSegmentSize - hShrinker, y + figure_defaultFigureCorner + figure_defaultFigureSegmentShortSize - vShrinker + figure_defaultFigureCorner))

    var l3 = new Line(new Point(x + figure_defaultFigureSegmentSize - hShrinker, y + figure_defaultFigureCorner + figure_defaultFigureSegmentShortSize - vShrinker + figure_defaultFigureCorner),
        new Point(x + hShrinker, y + figure_defaultFigureCorner + figure_defaultFigureSegmentShortSize - vShrinker + figure_defaultFigureCorner));

    var c3 = new QuadCurve(
        new Point(x + hShrinker, y + figure_defaultFigureCorner + figure_defaultFigureSegmentShortSize - vShrinker + figure_defaultFigureCorner),
        new Point(x + hShrinker - figure_defaultFigureCorner*(figure_defaultFigureCornerRoundness/10), y + figure_defaultFigureCorner + figure_defaultFigureSegmentShortSize - vShrinker + figure_defaultFigureCorner*(figure_defaultFigureCornerRoundness/10)),
        new Point(x + hShrinker - figure_defaultFigureCorner, y + figure_defaultFigureCorner + figure_defaultFigureSegmentShortSize - vShrinker))

    var l4 = new Line(new Point(x + hShrinker - figure_defaultFigureCorner, y + figure_defaultFigureCorner + figure_defaultFigureSegmentShortSize - vShrinker),
        new Point(x + hShrinker - figure_defaultFigureCorner, y + figure_defaultFigureCorner + vShrinker));

    var c4 = new QuadCurve(
        new Point(x + hShrinker - figure_defaultFigureCorner, y + figure_defaultFigureCorner + vShrinker),
        new Point(x + hShrinker - figure_defaultFigureCorner*(figure_defaultFigureCornerRoundness/10), y + vShrinker),
        new Point(x + hShrinker, y + vShrinker))

    p.addPrimitive(l1);
    p.addPrimitive(c1);
    p.addPrimitive(l2);
    p.addPrimitive(c2);
    p.addPrimitive(l3);
    p.addPrimitive(c3);
    p.addPrimitive(l4);
    p.addPrimitive(c4);
    f.addPrimitive(p);

    var t2 = new Text(figure_defaultFigureTextStr, x + figure_defaultFigureSegmentSize/2, y + figure_defaultFigureSegmentShortSize/2 + figure_defaultFigureCorner, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    var wid = figure_defaultFigureSegmentSize - hShrinker + figure_defaultFigureCorner;
    var height = figure_defaultFigureCorner + figure_defaultFigureSegmentShortSize - vShrinker + figure_defaultFigureCorner;
    //top
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + wid / 2 - 10, y + vShrinker), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + wid / 2, y + vShrinker), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + wid / 2 + 10, y + vShrinker), ConnectionPoint.TYPE_FIGURE);

    //right
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + wid, y + height / 2 - 10), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + wid, y + height / 2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + wid, y + height / 2 + 10), ConnectionPoint.TYPE_FIGURE);

    //bottom
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + wid / 2 - 10, y + height), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + wid / 2, y + height), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + wid / 2 + 10, y + height), ConnectionPoint.TYPE_FIGURE);

    //left
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + height / 2 - 10), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + height / 2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + height / 2 + 10), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function figure_Note(x,y)
{
    var figureWidth = 60;
    var foldWidth = 10;
    
    
    //figure
    var f = new Figure("Note");
        
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    f.style.lineCap = f.style.STYLE_LINE_CAP_ROUND;
    f.style.lineJoin = f.style.STYLE_LINE_CAP_ROUND;
        
    //base note
    var r = new Polygon();    
    r.addPoint(new Point(x - figureWidth/2, y - figureWidth/2));
    r.addPoint(new Point(x + figureWidth/2 - foldWidth, y - figureWidth/2));
    r.addPoint(new Point(x + figureWidth/2, y - figureWidth/2 + foldWidth));
    r.addPoint(new Point(x + figureWidth/2, y + figureWidth/2));
    r.addPoint(new Point(x - figureWidth/2, y + figureWidth/2));
    f.addPrimitive(r);
    
    //fold
    var fold = new Polygon();    
    fold.style.lineCap = f.style.STYLE_LINE_CAP_ROUND;
    fold.style.lineJoin = f.style.STYLE_LINE_CAP_ROUND;
    fold.addPoint(new Point(x + figureWidth/2 - foldWidth, y - figureWidth/2));
    fold.addPoint(new Point(x + figureWidth/2 - foldWidth, y - figureWidth/2 + foldWidth));
    fold.addPoint(new Point(x + figureWidth/2, y - figureWidth/2 + foldWidth));    
    f.addPrimitive(fold);

    //Text
    var t2 = new Text(figure_defaultFigureTextStr, x , y , figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);
    
    
    f.properties.push(new BuilderProperty('Text', 'primitives.2.str', BuilderProperty.TYPE_TEXT));

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figureWidth/2 , y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - figureWidth/2 , y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - figureWidth/2 ), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figureWidth/2 ), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}