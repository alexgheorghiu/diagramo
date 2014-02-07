"use strict";

/**Figure set declaration*/
figureSets["basic"] = {
    name: 'Basic',
    description : 'A basic set of figures',
    figures: [
        {figureFunction: "RoundedRectangle", image: "rounded_rectangle.png"},
        {figureFunction: "Rectangle", image: "rectangle.png"},
        {figureFunction: "Square", image: "square.png"},
        {figureFunction: "Circle", image: "circle.png"},
        {figureFunction: "Diamond", image: "diamond.png"},
        {figureFunction: "Parallelogram", image: "parallelogram.png"},
        {figureFunction: "Ellipse", image: "ellipse.png"},
        {figureFunction: "RightTriangle", image: "right_triangle.png"},
        {figureFunction: "Pentagon", image: "pentagon.png"},
        {figureFunction: "Hexagon", image: "hexagon.png"},
        {figureFunction: "Octogon", image: "octogon.png"},
        {figureFunction: "Text", image: "text.png"}
    ]
};

var figure_defaultFigureSegmentSize = 70;
var figure_defaultFigureSegmentShortSize = 40;
var figure_defaultFigureRadiusSize = 35;
var figure_defaultFigureParalelsOffsetSize = 40;
var figure_defaultFigureCorner = 10

var figure_defaultFigureCornerRoundness = 8;

var figure_defaultXCoordonate = 0;
var figure_defaultYCoordonate = 0;

var figure_defaultFigureTextSize = 12;
var figure_defaultFigureTextStr = "Text";
var figure_defaultFigureTextFont = "Arial";
var figure_defaultStrokeStyle = "#000000";
var figure_defaultFillStyle = "#ffffff";
var figure_defaultFillTextStyle = "#000000";



function figure_Rectangle(x, y)
{
    var f = new Figure("Rectangle");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;


    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));

    var r = new Polygon();
//    var r = new Polyline();
//    r.style.lineCap = r.style.STYLE_LINE_CAP_BUTT;
//    r.style.lineJoin = r.style.STYLE_LINE_JOIN_MITER;
    r.addPoint(new Point(x, y));
    r.addPoint(new Point(x + figure_defaultFigureSegmentSize, y));
    r.addPoint(new Point(x + figure_defaultFigureSegmentSize, y + figure_defaultFigureSegmentShortSize+5));
    r.addPoint(new Point(x, y + figure_defaultFigureSegmentShortSize+5));

    f.addPrimitive(r);

    var t2 = new Text(figure_defaultFigureTextStr, x + figure_defaultFigureSegmentSize/2, y + figure_defaultFigureSegmentShortSize/2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    //test line style
//    f.addPrimitive(new Line(new Point(10, 10), new Point(300, 300)));
    //end test

//    //point
//    var p = new Point(x + 50, y  +50);
//    f.addPrimitive(p);

    var l = figure_defaultFigureSegmentShortSize + 5;
    //top
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2 - 10, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2 + 10, y), ConnectionPoint.TYPE_FIGURE);

    //bottom
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2 - 10, y + l), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2, y + l), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2 + 10, y + l), ConnectionPoint.TYPE_FIGURE);

    //right
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize, y + l / 2 - 10), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize, y + l / 2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize, y + l / 2 + 10), ConnectionPoint.TYPE_FIGURE);

    //left
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + l / 2 - 10), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + l / 2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + l / 2 + 10), ConnectionPoint.TYPE_FIGURE);

    f.finalise();
    return f;
}

function figure_Square(x,y)
{
    var r = new Polygon();
    r.addPoint(new Point(x, y));
    r.addPoint(new Point(x + figure_defaultFigureSegmentSize, y));
    r.addPoint(new Point(x + figure_defaultFigureSegmentSize, y + figure_defaultFigureSegmentSize));
    r.addPoint(new Point(x, y + figure_defaultFigureSegmentSize));
    var f=new Figure("Square");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));


//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));//f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS));
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));

    f.addPrimitive(r);

    var t2 = new Text(figure_defaultFigureTextStr, x + figure_defaultFigureSegmentSize/2, y + figure_defaultFigureSegmentSize/2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2 - 10,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2 + 10, y),ConnectionPoint.TYPE_FIGURE);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2 - 10, y + figure_defaultFigureSegmentSize),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2, y + figure_defaultFigureSegmentSize),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2 + 10, y + figure_defaultFigureSegmentSize),ConnectionPoint.TYPE_FIGURE);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize, y + figure_defaultFigureSegmentSize / 2 - 10),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize, y + figure_defaultFigureSegmentSize / 2),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize, y + figure_defaultFigureSegmentSize / 2 + 10),ConnectionPoint.TYPE_FIGURE);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize / 2 - 10),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize / 2),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize / 2 + 10),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_Circle(x,y)
{

    var f = new Figure("Circle");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;


    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));//f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var c = new Arc(x, y, figure_defaultFigureRadiusSize, 0, 360, false, 0);

    f.addPrimitive(c);
    var t2 = new Text(figure_defaultFigureTextStr, x, y, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureRadiusSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureRadiusSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - figure_defaultFigureRadiusSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - figure_defaultFigureRadiusSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_Diamond(x,y)
{

    var r = new Polygon();
    r.addPoint(new Point(x, y - figure_defaultFigureSegmentSize/2));
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize / 3*2, y));
    r.addPoint(new Point(x, y + figure_defaultFigureSegmentSize/2));
    r.addPoint(new Point(x - figure_defaultFigureSegmentShortSize/3*2, y));
    var f=new Figure("Diamond");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH))
    //f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));

    f.addPrimitive(r);

    var t2 = new Text(figure_defaultFigureTextStr, x, y, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize/3*2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - figure_defaultFigureSegmentShortSize/3*2, y), ConnectionPoint.TYPE_FIGURE);

    f.finalise();
    return f;
}

function figure_Parallelogram(x,y)
{
    
    var f = new Figure("Diamond");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));


//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    //f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var r = new Polygon();
    r.addPoint(new Point(x + 10, y));
    r.addPoint(new Point(x + figure_defaultFigureSegmentSize + 10, y));
    r.addPoint(new Point(x + figure_defaultFigureSegmentSize + figure_defaultFigureParalelsOffsetSize, y + figure_defaultFigureSegmentShortSize));
    r.addPoint(new Point(x + figure_defaultFigureParalelsOffsetSize, y + figure_defaultFigureSegmentShortSize));
    
    f.addPrimitive(r);

    var t2 = new Text(figure_defaultFigureTextStr, x + figure_defaultFigureSegmentSize/2 + figure_defaultFigureParalelsOffsetSize/2 + 5, y + figure_defaultFigureSegmentShortSize/2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + 10, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize + 10, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize + figure_defaultFigureParalelsOffsetSize, y + figure_defaultFigureSegmentShortSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureParalelsOffsetSize, y + figure_defaultFigureSegmentShortSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize + figure_defaultFigureParalelsOffsetSize / 2 + 5, y + figure_defaultFigureSegmentShortSize / 2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureParalelsOffsetSize / 2 + 5, y + figure_defaultFigureSegmentShortSize / 2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2 + figure_defaultFigureParalelsOffsetSize, y + figure_defaultFigureSegmentShortSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2 + 10, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentSize / 2 + figure_defaultFigureParalelsOffsetSize/2 + 2, y + figure_defaultFigureSegmentShortSize/2), ConnectionPoint.TYPE_FIGURE);

    f.finalise();
    return f;
}

function figure_Ellipse(x,y)
{

    var f = new Figure("Ellipse");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    //f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));

    var c = new Ellipse(new Point(x, y), figure_defaultFigureSegmentShortSize, figure_defaultFigureSegmentShortSize/2);

    f.addPrimitive(c);
    var t2 = new Text(figure_defaultFigureTextStr, x, y - 2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentShortSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - figure_defaultFigureSegmentShortSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - figure_defaultFigureSegmentShortSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_RightTriangle(x,y)
{

    var t = new Polygon();
    t.addPoint(new Point(x, y));
    t.addPoint(new Point(x + figure_defaultFigureSegmentShortSize, y + figure_defaultFigureSegmentSize));
    t.addPoint(new Point(x, y + figure_defaultFigureSegmentSize));

    var e = new Figure("RightTriangle");
    e.style.fillStyle = figure_defaultFillStyle;
    e.style.strokeStyle = figure_defaultStrokeStyle;

    e.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    e.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    e.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    e.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    e.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    e.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    e.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    e.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    e.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));//f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    e.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    e.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    e.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));

    var t2 = new Text(figure_defaultFigureTextStr, x + figure_defaultFigureSegmentShortSize/3, y + figure_defaultFigureSegmentSize*0.70, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    e.addPrimitive(t);
    e.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(e.id, new Point(x, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id, new Point(x + figure_defaultFigureSegmentShortSize, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id, new Point(x, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id, new Point(x + figure_defaultFigureSegmentShortSize/2, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);


    e.finalise();
    return e;
}

function figure_Pentagon(x,y)
{
    var r = new Polygon();
    var l = figure_defaultFigureRadiusSize;
    /*r.addPoint(new Point(x + (l * Math.cos(180/Math.PI*72)), y - (l * Math.sin(180/Math.PI*72))));
    r.addPoint(new Point(x - (l * Math.cos(180/Math.PI*36)), y + (l * Math.sin(180/Math.PI*36))));
    r.addPoint(new Point(x + l, y));
    r.addPoint(new Point(x - (l * Math.cos(180/Math.PI*36)), y - (l * Math.sin(180/Math.PI*36))));
    r.addPoint(new Point(x + (l * Math.cos(180/Math.PI*72)), y + (l * Math.sin(180/Math.PI*72))));*/
    for (var i = 0; i < 5; i++){
        r.addPoint(new Point(x - l * Math.sin(2 * Math.PI * i / 5), y - l * Math.cos(2 * Math.PI * i / 5)));
    }
    var f=new Figure("Pentagon");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    //f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    f.addPrimitive(r);

    var t2 = new Text(figure_defaultFigureTextStr, x, y, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    for (var i = 0; i < 5; i++){
        CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - l * Math.sin(2 * Math.PI * i / 5), y - l * Math.cos(2 * Math.PI * i / 5)),ConnectionPoint.TYPE_FIGURE);
    }
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y),ConnectionPoint.TYPE_FIGURE);

    f.finalise();
    return f;
}

function figure_Hexagon(x,y)
{
    var r = new Polygon();
    var l = figure_defaultFigureSegmentShortSize/4*3+2;
    r.addPoint(new Point(x, y + l));
    r.addPoint(new Point(x + l, y + l / 2));//(l * (Math.sqrt(3 / 2)))
    r.addPoint(new Point(x + l, y - l / 2));//(l * (Math.sqrt(3 / 2)))
    r.addPoint(new Point(x, y - l));
    r.addPoint(new Point((x - l), y - l / 2));//(l * (Math.sqrt(3 / 2)))
    r.addPoint(new Point((x - l), y + l / 2));//(l * (Math.sqrt(3 / 2)))
    var f=new Figure("Hexagon");

    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    //f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    f.addPrimitive(r);

    var t2 = new Text(figure_defaultFigureTextStr, x, y - 2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + l), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + l, y + l / 2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + l, y - l / 2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - l), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - l, y - l / 2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - l, y + l / 2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_Octogon(x,y)
{
    var r = new Polygon();

    var l = figure_defaultFigureSegmentShortSize/3*2;
    var a = l/Math.sqrt(2);
    r.addPoint(new Point(x, y));
    r.addPoint(new Point(x + l, y));
    r.addPoint(new Point(x + l + a, y + a));
    r.addPoint(new Point(x + l + a, y + a + l));
    r.addPoint(new Point(x + l, y + a + l + a));
    r.addPoint(new Point(x, y + a + l + a));
    r.addPoint(new Point(x - a, y + a + l));
    r.addPoint(new Point(x - a, y + a));

    var f = new Figure("Octogon");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    //f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));

    f.addPrimitive(r);

    var t2 = new Text(figure_defaultFigureTextStr, x + l/2, y + (l+a+a)/2 - 2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + l, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + l + a, y + a), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + l + a, y + a + l), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + l, y + a + l + a), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + a + l + a), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - a, y + a + l), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - a, y + a), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + l / 2, y + (l+a+a)/2), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}





function figure_Text(x,y)
{

    var f = new Figure('Text');
    f.style.fillStyle = figure_defaultFillStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.0.str', BuilderProperty.TYPE_TEXT));

    //when we change textSize we need to transform the connectionPoints, 
    //this is the only time connecitonPoints get transformed for text
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.0.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.0.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.0.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.0.style.fillStyle', BuilderProperty.TYPE_COLOR));
    //f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.0.valign', Text.VALIGNMENTS);

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));


    var t2 = new Text(figure_defaultFigureTextStr, x, y + figure_defaultFigureRadiusSize/2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);
    
    //lets set up our connection points to be right on the bounds
//    var bounds = f.getBounds();
//    var width = bounds[2] - bounds[0];
//    var height = bounds[3] - bounds[1];
//    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(bounds[0] + width/2, bounds[1] - 2), ConnectionPoint.TYPE_FIGURE);
//    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(bounds[0] + width/2, bounds[3] + 2), ConnectionPoint.TYPE_FIGURE);
//    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(bounds[0] - 2, bounds[1] + height/2), ConnectionPoint.TYPE_FIGURE);
//    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(bounds[2] + 2, bounds[1] + height/2), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_RoundedRectangle(x,y)
{
    var f = new Figure("RoundedRectangle");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    f.style.lineWidth = 2;
    f.style.lineStyle = Style.LINE_STYLE_CONTINOUS;

    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));

    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
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