
/**
 * Copyright 2010 Scriptoid s.r.l
 *Suppose you have all basic figures ready...build the images from /documentation/figures.png*/

function buildText(){
    x=50;
    y=50;

    var e = new Figure("Triangle");
    e.style.strokeStyle="#000000";
    e.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    e.builder.addProperty('Text','primitives.0.str', BuilderProperty.TYPE_TEXT);
    e.builder.addProperty('Text Size ','primitives.0.size', BuilderProperty.FONT_SIZES);
    
    var t = new Text("Left Sticky\nAnother Line\n It rains cats and dogs",x+20,y+15, 'Arial',12);

    e.addPrimitive(t);

    e.finalise();
    return e;
}

function buildFigure1(){
    x=50;
    y=50;
    var t = new Polygon();
    t.addPoint(new Point(x+20, y));
    t.addPoint(new Point(x+40, y+30));
    t.addPoint(new Point(x+0, y+30));
    var e=new Figure("Triangle");
    e.style.strokeStyle="#000000";
    e.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    e.builder.addProperty('Fill Style','style.fillStyle', BuilderProperty.TYPE_COLOR);
    e.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);

    e.builder.addProperty('Text','primitives.1.str', BuilderProperty.TYPE_TEXT);
    e.builder.addProperty('Text Size ','primitives.1.size', BuilderProperty.FONT_SIZES);
    
    e.builder.addProperty('Text Color','primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR);

    /*
    e.builder.addProperty('H-Align','primitives.1.HAlign', [{Text: 'Left',Value: 'Left'},{Text: 'Center',Value: 'Center'},{Text: 'Right',Value: 'Right'}]);
    e.builder.addProperty('V-Align','primitives.1.VAlign', [{Text: 'Top',Value: 'Top'},{Text: 'Center',Value: 'Center'},{Text: 'Bottom',Value: 'Bottom'}]);
    e.builder.addProperty('X-Margin','primitives.1.marginX',BuilderProperty.LINE_WIDTHS);
    e.builder.addProperty('Y-Margin','primitives.1.marginY',BuilderProperty.LINE_WIDTHS);
    */

    var t2=new Text("Left Sticky\nAnother Line",x+20,y+15, 'Arial',12);
    //t2.style.fillStyle = "#000000";

    e.addPrimitive(t);
    e.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(e.id, new Point(x+20,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x+20,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x+20,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x+40,y+30),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x,y+30),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x+20,y+30),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x+20,y+18),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x+11,y+15),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(e.id,new Point(x+29,y+15),ConnectionPoint.TYPE_FIGURE);
    
    e.finalise();
    return e;
}


function buildFigure2(){
    x=50;
    y=50;
    var r = new Polygon();
    r.addPoint(new Point(x,y));
    r.addPoint(new Point(x+50,y));
    r.addPoint(new Point(x+50,y+30));
    r.addPoint(new Point(x,y+30));
    var f=new Figure("Rectangle");
    f.style.fillStyle= "#ffffff";
    f.style.strokeStyle= "#000000";
    
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style','style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    f.addPrimitive(r);

    var t2 = new Text("Halunelu",x+25,y+25,'Arial', 18);
    t2.style.fillStyle = "#000000";

    f.addPrimitive(t2);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+25,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50,y+15),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50,y+30),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+25,y+30),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y+30),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y+15),ConnectionPoint.TYPE_FIGURE);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+25,y+15),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+37.5,y+15),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function buildFigure3(){
    x=50;
    y=50;
    //isPointInside will only work for regular polygons, so change this to be 2 regular polylines
    /*var r = new Polygon();
    r.addPoint(new Point(x,y));
    r.addPoint(new Point(x+50,y));
    r.addPoint(new Point(x+50,y+50));
    r.addPoint(new Point(x+100,y+50));
    r.addPoint(new Point(x+100,y+100));
    r.addPoint(new Point(x,y+100));*/
    var l=new Polyline();
    l.addPoint(new Point(x,y+100));
    l.addPoint(new Point(x,y));
    l.addPoint(new Point(x+50,y));
    l.addPoint(new Point(x+50,y+50));

    var r=new Polyline();
    r.addPoint(new Point(x+50,y+50));
    r.addPoint(new Point(x+100,y+50));
    r.addPoint(new Point(x+100,y+100));
    r.addPoint(new Point(x,y+100));

    var p=new Path();
    p.addPrimitive(l);
    p.addPrimitive(r);
    var f=new Figure("Rectangle");
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style','style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    f.style.strokeStyle="black";
    f.addPrimitive(p);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y+100),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50, y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50, y+50),ConnectionPoint.TYPE_FIGURE);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+100, y+50),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+100, y+100),ConnectionPoint.TYPE_FIGURE);
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y+50),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50, y+100),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function buildFigure4(){
    x=50;
    y=50;
    var f=new Figure();
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style','style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    pline=new Polyline();
    pline.addPoint(new Point(x,y));
    pline.addPoint(new Point(x+50,y));
    pline.addPoint(new Point(x+50,y+50));
    pline.addPoint(new Point(x+100,y+50));
    f.addPrimitive(pline);
    f.style.strokeStyle="black";

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50,y+50),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+100,y+50),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function buildFigure5(){
    x=50;
    y=50;
    var f=new Figure();
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style','style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    var curve=new QuadCurve(new Point(x,y),new Point(x-25,y-40),new Point(x+50,y-50));
    f.addPrimitive(curve);
    f.style.strokeStyle="black";

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50,y-50),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x-3,y-30),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function buildFigure6(){
    x=50;
    y=50;
    var f=new Figure();
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style','style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    f.style.strokeStyle="black";

    var l=new Polyline();
    l.addPoint(new Point(x,y));
    l.addPoint(new Point(x,y+50));
    l.addPoint(new Point(x+50,y+50));
    var curve=new QuadCurve(new Point(x+50,y+50),new Point(x+20,y-5),new Point(x+75,y-15));
    var semi=new Arc(x+75,y+10,25,-90,90,false);
    f.addPrimitive(l);
    f.addPrimitive(curve);
    f.addPrimitive(semi);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y+25),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+45,y+50),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+75,y+15),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function buildFigure7(){
    x=50;
    y=50;
    var figure=new Figure();
    figure.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    figure.builder.addProperty('Fill Style','style.fillStyle', BuilderProperty.TYPE_COLOR);
    figure.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    /*
    figure.builder.addProperty('Text','primitives.1.str', BuilderProperty.TYPE_TEXT);
    figure.builder.addProperty('Text Color','primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR);
    figure.builder.addProperty('Text Size ','primitives.1.size', BuilderProperty.FONT_SIZES);
    figure.builder.addProperty('H-Align','primitives.1.HAlign', [{Text: 'Left',Value: 'Left'},{Text: 'Center',Value: 'Center'},{Text: 'Right',Value: 'Right'}]);
    figure.builder.addProperty('V-Align','primitives.1.VAlign', [{Text: 'Top',Value: 'Top'},{Text: 'Center',Value: 'Center'},{Text: 'Bottom',Value: 'Bottom'}]);
    figure.builder.addProperty('X-Margin','primitives.1.marginX',BuilderProperty.LINE_WIDTHS);
    figure.builder.addProperty('Y-Margin','primitives.1.marginY',BuilderProperty.LINE_WIDTHS);
    //figure.builder.addProperty('Expand','primitives.1.expand', BuilderProperty.TYPE_BOOLEAN);
    */

    var path=defaultRoundedRectangle(x,y);
    figure.style.strokeStyle="#000000";

    //var t=new Text("Centered",x+35,y+28,10,Text.ALIGN_CENTER,Text.ALIGN_CENTER);
    //var t1=new Text("Left",x+10,y+18,10,Text.ALIGN_LEFT,Text.ALIGN_CENTER);
    var t2=new Text("Left Sticky\nAnother Line",x+35,y+20,10,'Arial',10);
    
    figure.addPrimitive(path);
    //figure.addPrimitive(t);
    //figure.addPrimitive(t1);
    figure.addPrimitive(t2);
    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x+25,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x+35,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x+45,y),ConnectionPoint.TYPE_FIGURE);

    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x+25,y+40),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x+35,y+40),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x+45,y+40),ConnectionPoint.TYPE_FIGURE);

    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x,y+10),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x,y+20),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x,y+30),ConnectionPoint.TYPE_FIGURE);

    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x+70,y+10),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x+70,y+20),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(figure.id, new Point(x+70,y+30),ConnectionPoint.TYPE_FIGURE);
    figure.finalise();
    return figure;
}


function buildFigure8(){
    x=50;
    y=50;
    var f=new Figure();
    f.builder.addProperty("House Fill", "primitives.1.style.fillStyle",BuilderProperty.TYPE_COLOR);
    f.builder.addProperty("House Line", "primitives.1.style.strokeStyle",BuilderProperty.TYPE_COLOR);
    f.builder.addProperty("Roof Fill", "primitives.0.style.fillStyle",BuilderProperty.TYPE_COLOR);
    f.builder.addProperty("House Border", "primitives.1.style.lineWidth",[{Text: '1px',Value: '1'},{Text: '2px',Value: '2'},{Text: '3px',Value: '3'},{Text: '4px',Value: '4'}]);
    var t=new Polygon();
    t.addPoint(new Point(x+25,y));
    t.addPoint(new Point(x+50,y+25));
    t.addPoint(new Point(x,y+25));
    t.style.fillStyle="#804000"
    f.addPrimitive(t);

    y=85;
    var r = new Polygon();
    r.addPoint(new Point(x,y));
    r.addPoint(new Point(x+50,y));
    r.addPoint(new Point(x+50,y+30));
    r.addPoint(new Point(x,y+30));
    r.style.strokeStyle="#ff0000";
    r.style.lineWidth=4;
    r.style.fillStyle="#00ff00"
    f.addPrimitive(r);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+25,y-35),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50,y-10),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y-10),ConnectionPoint.TYPE_FIGURE);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x-1,y+15),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x-1,y+31),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+51,y+15),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+51,y+31),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+25,y+31),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function buildFigure9(){
    x=50;
    y=50;

    var s=new Style();
    s.strokeStyle="#800080";

    var f=new Figure();
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    f.style=s;
    var pl=new Polyline();
    pl.style=null;
    pl.addPoint(new Point(x,y));
    pl.addPoint(new Point(x,y+75));
    pl.addPoint(new Point(x+75,y+75));
    pl.addPoint(new Point(x+75,y+25));
    f.addPrimitive(pl);
    var curve=new CubicCurve(new Point(x,y),new Point(x+50,y+40),new Point(x+65,y-40),new Point(x+100,y));
    curve.style=null;
    f.addPrimitive(curve);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y+38),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y+75),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+28,y+75),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+38,y+75),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+48,y+75),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+75,y+75),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+75,y+38),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function buildFigure10(){
    x=50;
    y=50;
    var s=new Style();
    s.strokeStyle="#00ff00";
    var f=new Figure();
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    f.builder.addProperty('Text','primitives.2.str', BuilderProperty.TYPE_TEXT);
    f.builder.addProperty('Text Color','primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Text Size ','primitives.2.size', BuilderProperty.FONT_SIZES);
    f.builder.addProperty('H-Align','primitives.2.HAlign', [{Text: 'Left',Value: 'Left'},{Text: 'Center',Value: 'Center'},{Text: 'Right',Value: 'Right'}]);
    f.builder.addProperty('V-Align','primitives.2.VAlign', [{Text: 'Top',Value: 'Top'},{Text: 'Center',Value: 'Center'},{Text: 'Bottom',Value: 'Bottom'}]);
    f.builder.addProperty('X-Margin','primitives.2.marginX',BuilderProperty.LINE_WIDTHS);
    f.builder.addProperty('Y-Margin','primitives.2.marginY',BuilderProperty.LINE_WIDTHS);
    //f.builder.addProperty('Expand','primitives.2.expand', BuilderProperty.TYPE_BOOLEAN);
    f.style=s;
    var l=new Line(new Point(x,y),new Point(x+30,y));
    l.style=null;
    var p=new Point(x,y-15);
    p.style=null;
    f.addPrimitive(l);
    f.addPrimitive(p);

    var t=new Text("SimpleMinds",x,y,5,Text.ALIGN_LEFT,Text.ALIGN_BOTTOM);
    t.style.fillStyle="#000000";
    f.addPrimitive(t);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x-5,y-7));
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+35,y-7));
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+15,y+5));
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+15,y-20));
    f.finalise();
    return f;
}

function buildFigure11(){
    x=0;
    y=0;
    var f=new Figure();
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    f.builder.addProperty('Gradient','primitives.0.style.Gradient',[{Text:"Red/Green", Value:"#ff0000/#00ff00"},{Text:"Blue/Green", Value:"#0000ff/#00ff00"},{Text:"Red/Blue", Value:"#ff0000/#0000ff"}]);
    
    f.builder.addProperty('Text','primitives.1.str', BuilderProperty.TYPE_TEXT);
    f.builder.addProperty('Text Color','primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Text Size ','primitives.1.size', BuilderProperty.FONT_SIZES);
    f.builder.addProperty('H-Align','primitives.1.HAlign', [{Text: 'Left',Value: 'Left'},{Text: 'Center',Value: 'Center'},{Text: 'Right',Value: 'Right'}]);
    f.builder.addProperty('V-Align','primitives.1.VAlign', [{Text: 'Top',Value: 'Top'},{Text: 'Center',Value: 'Center'},{Text: 'Bottom',Value: 'Bottom'}]);
    f.builder.addProperty('X-Margin','primitives.1.marginX',BuilderProperty.LINE_WIDTHS);
    f.builder.addProperty('Y-Margin','primitives.1.marginY',BuilderProperty.LINE_WIDTHS);
    //f.builder.addProperty('Expand','primitives.1.expand', BuilderProperty.TYPE_BOOLEAN);
    
    var c=new Arc(x,y,30,0,360,false,0);

    //coordinates relative to shape bounds
    c.style.gradientBounds=[-30,30,30,-30];
    c.style.addColorStop.push('#00ff00');
    c.style.addColorStop.push('#ff0000');
    f.addPrimitive(c);
    var t=new Text("Big Circle",x,y,10,Text.ALIGN_CENTER,Text.ALIGN_CENTER);
    t.style.fillStyle="#ffffff";
    var p = t.rotationCoords[0].clone();

    t.transform(Matrix.translationMatrix(-p.x, -p.y));
    t.transform(Matrix.rotationMatrix(Math.PI/180*-45));
    t.transform(Matrix.translationMatrix(p.x, p.y));
    
    f.addPrimitive(t);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+30,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y+30),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x-30,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y-30),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x-15,y-15),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}
function buildFigure12(){
    x=100;
    y=100;
    var f=new Figure();
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    var e=new Ellipse(new Point(x,y),100,50);
    e.style.strokeStyle="black";
    f.addPrimitive(e);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x-10,y-50),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y-50),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+10,y-50),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+100,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y+50),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function buildFigure13(){
    x=100;
    y=100;
    var f=new Figure();
    f.builder.addProperty('Stroke Style','primitives.0.style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    var e=new Ellipse(new Point(x,y),100,50);
    f.style.image=new Image();
    f.style.image.src="Chrysanthemum.jpg";
    f.style.image.width=200;
    f.style.image.height=100;
    e.style.strokeStyle="#ff0000";
    e.style.lineWidth=3;
    f.addPrimitive(e);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x-100,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y-50),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+100,y),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y+50),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function buildFigure14(){
    x=100;
    y=100;
    var f=new Figure();
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style','style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    f.builder.addProperty('Close Style','primitives.0.styleFlag',[{Text:'None',Value:'0'},{Text:'Sector',Value:'1'},{Text:'Pie',Value:'2'}])
    var a=new Arc(x,y,30,210,270,false,2);
    a.style.fillStyle="#ebf213"
    a.style.strokeStyle="#000000";
    f.addPrimitive(a);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x-13,y-27));
    f.finalise();
    return f;
}


function buildFigure15(){
    x=50;
    y=50;
    var f=new Figure();
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style','style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    f.builder.addProperty('Close Style','primitives.0.styleFlag',[{Text:'None',Value:'0'},{Text:'Sector',Value:'1'},{Text:'Pie',Value:'2'}])
    var a=new Arc(x,y,30,270,360,false,0);
    a.style.strokeStyle="#000000";
    f.addPrimitive(a);

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y-30),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+21.5,y-21.5),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+30,y),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function buildFigure16(){
    x=50;
    y=50;
    var f=new Figure();
    f.builder.addProperty('Fill Style1','primitives.0.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style2','primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style3','primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR);
    var r = new Polygon();
    r.addPoint(new Point(x,y));
    r.addPoint(new Point(x+50,y));
    r.addPoint(new Point(x+50,y+100));
    r.addPoint(new Point(x,y+100));
    r.style.fillStyle="#00ff00";
    f.addPrimitive(r);

    x=100
    r = new Polygon();
    r.addPoint(new Point(x,y));
    r.addPoint(new Point(x+50,y));
    r.addPoint(new Point(x+50,y+100));
    r.addPoint(new Point(x,y+100));
    r.style.fillStyle="#0000ff"
    f.addPrimitive(r)

    x=50;
    y=150;
    r = new Polygon();
    r.addPoint(new Point(x,y));
    r.addPoint(new Point(x+100,y));
    r.addPoint(new Point(x+100,y+50));
    r.addPoint(new Point(x,y+50));
    r.style.fillStyle="#ff0000"
    f.addPrimitive(r)

    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50,y-100),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+50,y+50),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y-10),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x,y-20),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+100,y+10),ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x+100,y+20),ConnectionPoint.TYPE_FIGURE);
    f.finalise();
    return f;
}


function buildFigure17(){
    x=100;
    y=150;
    var f=new Figure();
    f.builder.addProperty('Fill Style1',['primitives.0.style.fillStyle','primitives.1.style.fillStyle','primitives.2.style.fillStyle','primitives.3.style.fillStyle'], BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style2','primitives.4.style.fillStyle', BuilderProperty.TYPE_COLOR);
    var e=new Ellipse(new Point(x,y),60,15);
    e.style.fillStyle="#0000ff"
    var e1=new Ellipse(new Point(x+80,y-80),15,60);
    e1.style.fillStyle="#0000ff"
    var e2=new Ellipse(new Point(x+160,y),60,15);
    e2.style.fillStyle="#0000ff"
    var e3=new Ellipse(new Point(x+80,y+80),15,60);
    e3.style.fillStyle="#0000ff"
    var a=new Arc(x+80,y,20,0,360,false,0);
    a.style.fillStyle="#ebf213"
    f.addPrimitive(e);
    f.addPrimitive(e1);
    f.addPrimitive(e2);
    f.addPrimitive(e3);
    f.addPrimitive(a);
    f.finalise();
    return f;
}


function buildFigure18(){
    x=50;
    y=50;
    var f=new Figure();
    f.builder.addProperty('Fill Style1','primitives.0.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style2','primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style3','primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR);
    var a=new Arc(x+20,y-25,20,0,360,false,0);
    a.style.fillStyle="#ff0000";
    f.addPrimitive(a);
    var b=new Arc(x+80,y-25,20,0,360,false,0);
    b.style.fillStyle="#0000ff";
    f.addPrimitive(b);
    var r = new Polygon();
    r.addPoint(new Point(x,y));
    r.addPoint(new Point(x+100,y));
    r.addPoint(new Point(x+100,y+50));
    r.addPoint(new Point(x,y+50));
    r.style.fillStyle="#666666"
    f.addPrimitive(r);
    f.finalise();
    return f;

}


function buildFigure19(){
    x=50;
    y=50;
    var f=new Figure();
    f.builder.addProperty('Fill Style','primitives.0.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Stroke Style1','primitives.0.primitives.0.style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Stroke Style2','primitives.0.primitives.1.style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','primitives.0.style.lineWidth',BuilderProperty.LINE_WIDTHS);
    var p1=new Path();
    p1.style.fillStyle="#0000ff"
    p1.style.lineWidth=4;

    var l=new Line(new Point(x,y+50),new Point(x,y));
    l.style.strokeStyle="#ff0000"
    
    var p=new Polyline();
    p.addPoint(new Point(x,y));
    p.addPoint(new Point(x+50,y));
    p.addPoint(new Point(x+50,y+50));
    p.addPoint(new Point(x,y+50));
    p.style.strokeStyle="#000000";


    p1.addPrimitive(p);
    p1.addPrimitive(l);
    f.addPrimitive(p1);
    f.finalise();
    return f;
}
function buildFigure20(){
    x=200;
    y=200;
    var f=new Figure();
    f.builder.addProperty('Fill Style1','primitives.0.arc.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style2','primitives.1.arc.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Stroke Style1','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    f.style.strokeStyle="#ff0000"
    f.style.lineCap="round";
    f.style.lineWidth=8;

    //make a clipping path eliment?
    var b=new DashedArc(x,y,80,0,360,false,0,3);
    b.style.fillStyle="#00ff00"
    f.addPrimitive(b);

    var c=new DashedArc(x,y,30,0,360,false,0,6);
    c.style.fillStyle="#ffffff"
    f.addPrimitive(c);
    f.finalise();
    return f;
}
function buildFigure21(){
    x=50
    y=50
    var f=new Figure();
    f.builder.addProperty('Fill Style1','primitives.0.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style2','primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Stroke Style1','primitives.0.style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Stroke Style2','primitives.1.style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    
    f.builder.addProperty('Text','primitives.2.str', BuilderProperty.TYPE_TEXT);
    f.builder.addProperty('Text Color','primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Text Size ','primitives.2.size', BuilderProperty.FONT_SIZES);
    f.builder.addProperty('H-Align','primitives.2.HAlign', [{Text: 'Left',Value: 'Left'},{Text: 'Center',Value: 'Center'},{Text: 'Right',Value: 'Right'}]);
    f.builder.addProperty('V-Align','primitives.2.VAlign', [{Text: 'Top',Value: 'Top'},{Text: 'Center',Value: 'Center'},{Text: 'Bottom',Value: 'Bottom'}]);
    f.builder.addProperty('X-Margin','primitives.2.marginX',BuilderProperty.LINE_WIDTHS);
    f.builder.addProperty('Y-Margin','primitives.2.marginY',BuilderProperty.LINE_WIDTHS);
    //f.builder.addProperty('Expand','primitives.2.expand', BuilderProperty.TYPE_BOOLEAN);
    
    p1=defaultRoundedRectangle(x,y);
    p1.style.strokeStyle="#000000";
    p1.transform(Matrix.scaleMatrix(1.2, 1))
    f.addPrimitive(p1)
    var t=new Text("Test Text",x+52,y+40,10,Text.ALIGN_CENTER,Text.ALIGN_BOTTOM);
    t.style.fillStyle = '#ff0000';
    
    var p=defaultRoundedRectangle(x,y+20);
    p.style.strokeStyle="#ff0000";
    p.style.fillStyle="#ffffff";

    p.transform(Matrix.scaleMatrix(1, 0.5));
    p.transform(Matrix.translationMatrix(17, 45));
    f.addPrimitive(p)


    f.addPrimitive(t);
    f.finalise();
    return f;
}
function buildFigure22(){
    x=50;
    y=50;
    var f=new Figure();
    f.builder.addProperty('Fill Style','primitives.0.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    f.style.strokeStyle="#000000";
    f.style.lineWidth=4;
    var p=new Path();
    p.style.fillStyle="#804000";
    
    var pl=new Polyline();
    pl.addPoint(new Point(x,y));
    pl.addPoint(new Point(x,y+75));
    pl.addPoint(new Point(x+75,y+75));
    pl.addPoint(new Point(x+75,y));
    p.addPrimitive(pl);

    var c=new QuadCurve(new Point(x+75,y),new Point(x+40,y+40),new Point(x,y))
    p.addPrimitive(c);
    
    f.addPrimitive(p);
    f.finalise();
    return f;
}
function buildFigure23(){
    x=50;
    y=50;
    var f=new Figure();
    f.builder.addProperty('Fill Style1','primitives.0.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style2','primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Fill Style3','primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Stroke Style','style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','style.lineWidth',BuilderProperty.LINE_WIDTHS);
    f.style.lineWidth=4;
    f.style.strokeStyle="#000000";
    
    var p=new Path();
    p.style.fillStyle="#804000";

    var pl=new Polyline();
    pl.addPoint(new Point(x,y));
    pl.addPoint(new Point(x,y+75));
    pl.addPoint(new Point(x+75,y+75));
    pl.addPoint(new Point(x+75,y));
    p.addPrimitive(pl);

    var e=new Ellipse(new Point(x+38,y-25),38,15);
    f.addPrimitive(e);
    
    var c=new QuadCurve(new Point(x+75,y),new Point(x+40,y+40),new Point(x,y))
    p.addPrimitive(c);
    f.addPrimitive(p);


    var r=new Polygon();
    r.addPoint(new Point(x,y+90));
    r.addPoint(new Point(x,y+120));
    r.addPoint(new Point(x+75,y+120));
    r.addPoint(new Point(x+75,y+90));
    f.addPrimitive(r);
    
    f.finalise();
    return f;
}
function buildFigure24(){
    x=50;
    y=50;
    var f=new Figure();
    f.builder.addProperty('Fill Style3','primitives.0.style.fillStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Stroke Style','primitives.0.style.strokeStyle', BuilderProperty.TYPE_COLOR);
    f.builder.addProperty('Line Width','primitives.0.style.lineWidth',BuilderProperty.LINE_WIDTHS);
    var p=new Path();
    p.style.fillStyle="#ff0000";
    p.style.lineWidth=4;
    p.style.strokeStyle="#000000";
    var l1=new Line(new Point(x,y),new Point(x,y+100));
    var l2=new Line(new Point(x,y+100),new Point(x+50,y+100));
    var l3=new Line(new Point(x+50,y+100),new Point(x+50,y));
    p.addPrimitive(l1);
    p.addPrimitive(l2);
    p.addPrimitive(l3);

    f.addPrimitive(p);
    f.finalise();
    return f;
}
function buildFigureText(){
    var t=new Text(50,50,"Zack is coding Zack is coding<br />Zack is coding Zack is coding<br />Zack is coding Zack is coding<br />");
    //t.style.strokeStyle="black";
    t.style.strokeStyle="black"
    var f=new Figure();
    f.addPrimitive(t);
    f.finalise();
    return f;
}

function buildLine(){
    var f=new Figure();
    f.style.strokeStyle="black";
    var l=new Line(new Point(50,50), new Point(100,100));
    f.addPrimitive(l);
    f.finalise();
    return f;

}
function testCubicCurve(){
    var f=new Figure();
    f.style.strokeStyle="black";
    var c=new CubicCurve(new Point(50,50),new Point(100,100),new Point(150,0), new Point(250,50));
    f.addPrimitive(c);
    STACK=new Stack();
    STACK.figureAdd(f); 
    draw();
    /*
    for (var x=50; x<250; x++){
        for(var y=0; y<100; y++){
            var p=new Point(x,y);
            p.style.strokeStyle="red";
            p.style.fillStyle="red";
            if(c.contains(getContext(),x,y) && !c.near(x,y,1)){
                p.paint(getContext());
            }
        }
    }*/
}