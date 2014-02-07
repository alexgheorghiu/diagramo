"use strict";

figureSets["secondary"] = {
    name : 'Secondary',
    description : 'The second basic set of figures',
    figures: [
        {figureFunction: "Page", image: "page.png"},
        {figureFunction: "PageLowerCornerFolded", image: "page_lower_corner_folded.png"},
        {figureFunction: "PageUpperCornerFolded", image: "page_upper_corner_folded.png"},
        {figureFunction: "SemiCircleDown", image: "semi_circle_down.png"},
        {figureFunction: "SemiCircleUp", image: "semi_circle_up.png"},
        {figureFunction: "Triangle", image: "triangle.png"}
    ]
}

function figure_Page(x,y)
{

    var r = new Polygon();
    r.addPoint(new Point(x, y));
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4 - figure_defaultFigureCorner, y));
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureCorner));
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureSegmentSize));
    r.addPoint(new Point(x, y + figure_defaultFigureSegmentSize));

    var f=new Figure("Page");
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

    var t2 = new Text(figure_defaultFigureTextStr, x + figure_defaultFigureSegmentShortSize/2 + 2, y + figure_defaultFigureSegmentSize/2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize / 2 + 2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize / 2 + 2, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize / 2 + 2, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_PageUpperCornerFolded(x,y)
{
    var r = new Polygon();
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4 - figure_defaultFigureCorner, y));
    r.addPoint(new Point(x, y));//tl
    r.addPoint(new Point(x, y + figure_defaultFigureSegmentSize));//bl
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureSegmentSize));//br
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureCorner));//tl
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4 - figure_defaultFigureCorner, y + figure_defaultFigureCorner));
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4 - figure_defaultFigureCorner, y+1));
    
    var l = new Line(new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureCorner),new Point(x + figure_defaultFigureSegmentShortSize + 4 - figure_defaultFigureCorner, y))
    var f=new Figure("PageUpperCornerFolded");
    f.addPrimitive(l);
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;
    f.style.lineCap = f.style.STYLE_LINE_CAP_ROUND;
    
    f.properties.push(new BuilderProperty('Text', 'primitives.2.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.2.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.2.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.2.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
//f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    f.addPrimitive(r);

    var t2 = new Text(figure_defaultFigureTextStr, x + figure_defaultFigureSegmentShortSize/2 + 2, y + figure_defaultFigureSegmentSize/2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize/2 + 2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize + 2, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize/2 + 2, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize/2 + 2, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_PageLowerCornerFolded(x,y)
{

    var r = new Polygon();
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4, y));
    r.addPoint(new Point(x, y));
    r.addPoint(new Point(x, y + figure_defaultFigureSegmentSize));

    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize - figure_defaultFigureCorner + 4, y + figure_defaultFigureSegmentSize));
    //r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureSegmentSize - figure_defaultFigureCorner));
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize - figure_defaultFigureCorner + 4, y + figure_defaultFigureSegmentSize - figure_defaultFigureCorner));
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureSegmentSize - figure_defaultFigureCorner));
    r.addPoint(new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureSegmentSize - figure_defaultFigureCorner));

    var l = new Line(new Point(x + figure_defaultFigureSegmentShortSize - figure_defaultFigureCorner + 4, y + figure_defaultFigureSegmentSize),new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureSegmentSize - figure_defaultFigureCorner))
    var f=new Figure("PageUpperCornerFolded");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;

    f.addPrimitive(l);
    f.properties.push(new BuilderProperty('Text', 'primitives.2.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.2.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.2.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.2.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
//f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    f.addPrimitive(r);

    var t2 = new Text(figure_defaultFigureTextStr, x + figure_defaultFigureSegmentShortSize / 2 + 2, y + figure_defaultFigureSegmentSize/2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize / 2 + 2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize + 4, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize + 4, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize / 2 + 2, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureSegmentShortSize / 2 + 2, y), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_SemiCircleUp(x,y)
{

    var f = new Figure("SemiCircleUp");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.2.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.2.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.2.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.2.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
//f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.2.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var c = new Arc(x, y, figure_defaultFigureRadiusSize, 180, 360, false, 0);
    var l = new Line(new Point(x - figure_defaultFigureRadiusSize, y), new Point(x + figure_defaultFigureRadiusSize, y) );
    f.addPrimitive(c);
    f.addPrimitive(l);
    var t2 = new Text(figure_defaultFigureTextStr, x, y - figure_defaultFigureRadiusSize/2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureRadiusSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - figure_defaultFigureRadiusSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - figure_defaultFigureRadiusSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_SemiCircleDown(x,y)
{

    var f = new Figure("SemiCircleDown");
    f.style.fillStyle = figure_defaultFillStyle;
    f.style.strokeStyle = figure_defaultStrokeStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.2.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.2.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.2.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.2.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
 //f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.2.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));

    var c = new Arc(x, y, figure_defaultFigureRadiusSize, 0, 180, false, 0);
    var l = new Line(new Point(x - figure_defaultFigureRadiusSize, y), new Point(x + figure_defaultFigureRadiusSize, y) );
    f.addPrimitive(c);
    f.addPrimitive(l);
    var t2 = new Text(figure_defaultFigureTextStr, x, y + figure_defaultFigureRadiusSize/2, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + figure_defaultFigureRadiusSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - figure_defaultFigureRadiusSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + figure_defaultFigureRadiusSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_Triangle(x,y)
{

    var t = new Polygon();
    t.addPoint(new Point(x + figure_defaultFigureSegmentSize/2, y));
    t.addPoint(new Point(x + figure_defaultFigureSegmentSize, y + figure_defaultFigureSegmentSize));
    t.addPoint(new Point(x, y + figure_defaultFigureSegmentSize));

    var e = new Figure("Triangle");
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
    e.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    e.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    //f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    e.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    e.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(figure_defaultFigureTextStr, x + figure_defaultFigureSegmentSize/2, y + figure_defaultFigureSegmentSize/2 + 7, figure_defaultFigureTextFont, figure_defaultFigureTextSize);
    t2.style.fillStyle = figure_defaultFillTextStyle;

    e.addPrimitive(t);
    e.addPrimitive(t2);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + figure_defaultFigureSegmentSize/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + figure_defaultFigureSegmentSize, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + figure_defaultFigureSegmentSize/2, y + figure_defaultFigureSegmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + figure_defaultFigureSegmentSize/2, y + figure_defaultFigureSegmentSize/2+5), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + figure_defaultFigureSegmentSize/2 + figure_defaultFigureSegmentSize/4, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + figure_defaultFigureSegmentSize/4, y + figure_defaultFigureSegmentSize/2), ConnectionPoint.TYPE_FIGURE);

    e.finalise();
    return e;
}