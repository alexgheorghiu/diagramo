"use strict";

/*
Copyright [2014] [Diagramo]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4 - FigureDefaults.corner, y));
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.corner));
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.segmentSize));
    r.addPoint(new Point(x, y + FigureDefaults.segmentSize));

    var f=new Figure("Page");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
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

    var t2 = new Text(FigureDefaults.textStr, x + FigureDefaults.segmentShortSize/2 + 2, y + FigureDefaults.segmentSize/2, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize / 2 + 2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.segmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.segmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize / 2 + 2, y + FigureDefaults.segmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + FigureDefaults.segmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + FigureDefaults.segmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize / 2 + 2, y + FigureDefaults.segmentSize/2), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_PageUpperCornerFolded(x,y)
{
    var r = new Polygon();
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4 - FigureDefaults.corner, y));
    r.addPoint(new Point(x, y));//tl
    r.addPoint(new Point(x, y + FigureDefaults.segmentSize));//bl
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.segmentSize));//br
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.corner));//tl
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4 - FigureDefaults.corner, y + FigureDefaults.corner));
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4 - FigureDefaults.corner, y+1));
    
    var l = new Line(new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.corner),new Point(x + FigureDefaults.segmentShortSize + 4 - FigureDefaults.corner, y))
    var f=new Figure("PageUpperCornerFolded");
    f.addPrimitive(l);
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    f.style.lineCap = f.style.STYLE_LINE_CAP_ROUND;
    
    f.properties.push(new BuilderProperty('Text', 'primitives.2.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.2.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.2.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.2.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.2.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
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

    var t2 = new Text(FigureDefaults.textStr, x + FigureDefaults.segmentShortSize/2 + 2, y + FigureDefaults.segmentSize/2, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize/2 + 2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.segmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize + 2, y + FigureDefaults.segmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize/2 + 2, y + FigureDefaults.segmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + FigureDefaults.segmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + FigureDefaults.segmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize/2 + 2, y + FigureDefaults.segmentSize/2), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_PageLowerCornerFolded(x,y)
{

    var r = new Polygon();
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4, y));
    r.addPoint(new Point(x, y));
    r.addPoint(new Point(x, y + FigureDefaults.segmentSize));

    r.addPoint(new Point(x + FigureDefaults.segmentShortSize - FigureDefaults.corner + 4, y + FigureDefaults.segmentSize));
    //r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.segmentSize - FigureDefaults.corner));
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize - FigureDefaults.corner + 4, y + FigureDefaults.segmentSize - FigureDefaults.corner));
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.segmentSize - FigureDefaults.corner));
    r.addPoint(new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.segmentSize - FigureDefaults.corner));

    var l = new Line(new Point(x + FigureDefaults.segmentShortSize - FigureDefaults.corner + 4, y + FigureDefaults.segmentSize),new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.segmentSize - FigureDefaults.corner))
    var f=new Figure("PageUpperCornerFolded");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;

    f.addPrimitive(l);
    f.properties.push(new BuilderProperty('Text', 'primitives.2.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.2.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.2.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.2.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.2.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
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

    var t2 = new Text(FigureDefaults.textStr, x + FigureDefaults.segmentShortSize / 2 + 2, y + FigureDefaults.segmentSize/2, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize / 2 + 2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize + 4, y + FigureDefaults.segmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize + 4, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize / 2 + 2, y + FigureDefaults.segmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + FigureDefaults.segmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + FigureDefaults.segmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.segmentShortSize / 2 + 2, y), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_SemiCircleUp(x,y)
{

    var f = new Figure("SemiCircleUp");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.2.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.2.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.2.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.2.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.2.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
//f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.2.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var c = new Arc(x, y, FigureDefaults.radiusSize, 180, 360, false, 0);
    var l = new Line(new Point(x - FigureDefaults.radiusSize, y), new Point(x + FigureDefaults.radiusSize, y) );
    f.addPrimitive(c);
    f.addPrimitive(l);
    var t2 = new Text(FigureDefaults.textStr, x, y - FigureDefaults.radiusSize/2, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.radiusSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - FigureDefaults.radiusSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - FigureDefaults.radiusSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_SemiCircleDown(x,y)
{

    var f = new Figure("SemiCircleDown");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;

    f.properties.push(new BuilderProperty('Text', 'primitives.2.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size ', 'primitives.2.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font ', 'primitives.2.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment ', 'primitives.2.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.2.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    f.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
 //f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.2.valign', Text.VALIGNMENTS);
    f.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));

    var c = new Arc(x, y, FigureDefaults.radiusSize, 0, 180, false, 0);
    var l = new Line(new Point(x - FigureDefaults.radiusSize, y), new Point(x + FigureDefaults.radiusSize, y) );
    f.addPrimitive(c);
    f.addPrimitive(l);
    var t2 = new Text(FigureDefaults.textStr, x, y + FigureDefaults.radiusSize/2, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + FigureDefaults.radiusSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - FigureDefaults.radiusSize, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + FigureDefaults.radiusSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y), ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}

function figure_Triangle(x,y)
{

    var t = new Polygon();
    t.addPoint(new Point(x + FigureDefaults.segmentSize/2, y));
    t.addPoint(new Point(x + FigureDefaults.segmentSize, y + FigureDefaults.segmentSize));
    t.addPoint(new Point(x, y + FigureDefaults.segmentSize));

    var e = new Figure("Triangle");
    e.style.fillStyle = FigureDefaults.fillStyle;
    e.style.strokeStyle = FigureDefaults.strokeStyle;
    e.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    e.properties.push(new BuilderProperty('Text Size ', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    e.properties.push(new BuilderProperty('Font ', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    e.properties.push(new BuilderProperty('Alignment ', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    e.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    e.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));

//    e.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    e.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    e.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    e.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    e.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    //f.properties.push(new BuilderProperty('Vertical Alignment ', 'primitives.1.valign', Text.VALIGNMENTS);
    e.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    e.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x + FigureDefaults.segmentSize/2, y + FigureDefaults.segmentSize/2 + 7, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;

    e.addPrimitive(t);
    e.addPrimitive(t2);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + FigureDefaults.segmentSize/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + FigureDefaults.segmentSize, y + FigureDefaults.segmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x, y + FigureDefaults.segmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + FigureDefaults.segmentSize/2, y + FigureDefaults.segmentSize), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + FigureDefaults.segmentSize/2, y + FigureDefaults.segmentSize/2+5), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + FigureDefaults.segmentSize/2 + FigureDefaults.segmentSize/4, y + FigureDefaults.segmentSize/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x + FigureDefaults.segmentSize/4, y + FigureDefaults.segmentSize/2), ConnectionPoint.TYPE_FIGURE);

    e.finalise();
    return e;
}