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

var connector_defaultConnectorTextSize = 12;
var connector_defaultConnectorTextStr = "";
var connector_defaultConnectorTextFont = "Arial";
var connector_defaultConnectorTextStrokeStyle = "#000000";
var connector_defaultConnectorTextFillStyle = "#000000";
var connector_defaultConnectorTextBgStyle = "#ffffff";

/**
 *It's a connector between 2 figureConnectionPoints.
 *
 *@constructor
 *@this {Connector}
 *@param {Point} startPoint - the start of the line, where a ConnectionPoint will be added
 *@param {Point} endPoint - the end of the line, where a ConnectionPoint will be added
 *@param {String} type - the type of the Connector. It can be 'straight' or 'jagged'
 *@param {Number} id - the unique (at least among other Connectors) id this connector will have
 *@author Zack Newsham <zack_newsham@yahoo.co.uk>
 *@author Alex Gheorghiu <alex@scriptoid.com>
*/
function Connector(startPoint,endPoint,type, id){
    /**Connector's id*/
    this.id = id;
    
    /**An {Array} of {Point}s. They will be used to draw the connector*/
    this.turningPoints = [startPoint,endPoint];
    
    /**Type of connector. Ex. TYPE_STRAIGHT*/
    this.type = type;

    /**An {Array} of {Object}s. Stores set of user manual changes to connector's shape.
     * Structure of instance:
     * - align: 'v' for vertical and 'h' for horizontal
     * - delta: user defined offset from default position
     * - index: index of turning point which is changed
     * Note: the changes are not store in the order of the turning points, but
     * the correspondence is made by 'index' field
     * */
    this.userChanges = [];

    /**Solution of connector's shape calculated with ConnectionManager.connector2Points.
     * It can be one of: 's0', 's1_1', 's2_2', etc. */
    this.solution = '';
    
    /**The {Style} this connector will have*/
    this.style = new Style();
    this.style.strokeStyle = "#000000";
    this.style.lineWidth = 1.005;   // fixes connector's display in Chrome for now
    this.style.lineStyle = Style.LINE_STYLE_CONTINOUS;

    /**The text that will appear in the middle of the connector*/
    this.middleText = new Text(connector_defaultConnectorTextStr, (startPoint.x + endPoint.x)/2+10, (startPoint.y +  endPoint.y) / 2 - 13, connector_defaultConnectorTextFont, connector_defaultConnectorTextSize);
    this.middleText.style.strokeStyle = connector_defaultConnectorTextStrokeStyle;
    this.middleText.style.fillStyle = connector_defaultConnectorTextFillStyle;
    this.middleText.bgStyle = connector_defaultConnectorTextBgStyle;

    /**An {Array} of {BuilderProperties} to store exposed properties of the connector*/
    this.properties = [];
    this.properties.push(new BuilderProperty("Start Style", "startStyle", BuilderProperty.TYPE_CONNECTOR_END));
    this.properties.push(new BuilderProperty("End Style", "endStyle",  BuilderProperty.TYPE_CONNECTOR_END));
    this.properties.push(new BuilderProperty('Line Width','style.lineWidth', BuilderProperty.TYPE_LINE_WIDTH));
    this.properties.push(new BuilderProperty('Line Style','style.lineStyle', BuilderProperty.TYPE_LINE_STYLE));
    this.properties.push(new BuilderProperty('Color','style.strokeStyle', BuilderProperty.TYPE_COLOR));
    this.properties.push(new BuilderProperty('Text','middleText.str', BuilderProperty.TYPE_TEXT));
    this.properties.push(new BuilderProperty('Text Size', 'middleText.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    this.properties.push(new BuilderProperty('Font', 'middleText.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    this.properties.push(new BuilderProperty('Alignment', 'middleText.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    this.properties.push(new BuilderProperty('Text Underlined', 'middleText.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    this.properties.push(new BuilderProperty('Text Color', 'middleText.style.fillStyle', BuilderProperty.TYPE_COLOR));
   
    /**Start style for connector. Ex: Connector.STYLE_NORMAL*/
    this.startStyle = Connector.STYLE_NORMAL;
    
    /**End style for connector. Ex: Connector.STYLE_FILLED_TRIANGLE*/
    this.endStyle = Connector.STYLE_FILLED_TRIANGLE;

    /**The {ConnectionPoint}'s id that is currently being dragged*/
    this.activeConnectionPointId = -1;
    
    /**Serialization type*/
    this.oType = 'Connector'; //object type used for JSON deserialization
}

/**Straight connector type*/
Connector.TYPE_STRAIGHT = 'straight';

/**Jagged connector type*/
Connector.TYPE_JAGGED = 'jagged';

/**Round connector type. Orthogonal angles are smoothed. 
 *TODO: Not implemented*/
Connector.TYPE_ROUND = 'round';

/**Round connector type. The connector is drawn as a curve*/
Connector.TYPE_ORGANIC = 'organic';



/**Normal end connector style*/
Connector.STYLE_NORMAL = "Normal";

/**Arrow like end connector style*/
Connector.STYLE_ARROW = "Arrow";

/**Empty triangle end connector style*/
Connector.STYLE_EMPTY_TRIANGLE = "Empty";

/**Filled triangle end connector style*/
Connector.STYLE_FILLED_TRIANGLE = "Filled";

/**End connector arrow size*/
Connector.ARROW_SIZE = 12;

/**End connector arrow angle*/
Connector.ARROW_ANGLE = 15;


/**User change horizontal align*/
Connector.USER_CHANGE_HORIZONTAL_ALIGN = 'h';

/**User change vertical align*/
Connector.USER_CHANGE_VERTICAL_ALIGN = 'v';


/**Creates a {Connector} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Connector} a newly constructed Connector
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Connector.load = function(o){
    var newConnector = new Connector(new Point(0,0), new Point(0,0), Connector.TYPE_STRAIGHT, 0); //fake constructor

    newConnector.id = o.id;
    newConnector.turningPoints = Point.loadArray(o.turningPoints);
    newConnector.type = o.type;
    newConnector.userChanges = o.userChanges;
    newConnector.solution = o.solution;
    newConnector.style = Style.load(o.style);

    newConnector.middleText = Text.load(o.middleText);
    
    newConnector.properties = BuilderProperty.loadArray(o.properties);
   
    newConnector.endStyle = o.endStyle;
    newConnector.startStyle = o.startStyle;

    newConnector.activeConnectionPointId = o.activeConnectionPointId;
    
    return newConnector;
}

/**Creates a an {Array} of {Connector} out of JSON parsed array
 *@param {JSONObject} v - the JSON parsed {Array}
 *@return {Array} of newly loaded {Connector}s
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Connector.loadArray = function(v){
    var newConnectors = [];

    for(var i=0; i<v.length; i++){
        newConnectors.push(Connector.load(v[i]));
    }

    return newConnectors;
}

Connector.prototype = {
    
    constructor : Connector,
    

    /**
     *Compares to another Connector
     *
     *@param {Connector} anotherConnector - the other connector
     **/
    equals:function(anotherConnector){
        if(!anotherConnector instanceof Connector){
            return false;
        }

        //test turning points
        for(var i=0; i<this.turningPoints.length; i++){
            if( !this.turningPoints[i].equals(anotherConnector.turningPoints[i]) ){
                return false;
            }
        }

        //test properties
        for(var i=0; i<this.properties.length; i++){
            if(!this.properties[i].equals(anotherConnector.properties[i])){
                return false;
            }
        }

        //test user changes
        for(var i=0; i<this.userChanges.length; i++){
            if(this.userChanges[i].align != anotherConnector.userChanges[i].align
                || this.userChanges[i].index != anotherConnector.userChanges[i].index
                || this.userChanges[i].delta != anotherConnector.userChanges[i].delta){
                return false;
            }
        }

        if(this.id != anotherConnector.id
            || this.type != anotherConnector.type
            || this.solution != anotherConnector.solution
            || !this.middleText.equals(anotherConnector.middleText)
            || this.startStyle != anotherConnector.startStyle
            || this.endStyle != anotherConnector.endStyle
            || this.activeConnectionPointId != anotherConnector.activeConnectionPointId ){
            return false;
        }

        return true;
    },

    /**
     *Creates an arrow like figure, pointed down \/, at a certain position
     * @param {Number} x - the X coordinates of the point
     * @param {Number} y - the X coordinates of the point
     * @return {Path} the arrow as a {Path} object
     * @author Zack
     **/
    getArrow:function(x,y){
        var startPoint = new Point(x,y);
        var line = new Line(startPoint.clone(),Util.getEndPoint(startPoint,Connector.ARROW_SIZE, Math.PI/180*Connector.ARROW_ANGLE));
        var line1 = new Line(startPoint.clone(),Util.getEndPoint(startPoint,Connector.ARROW_SIZE, Math.PI/180*-Connector.ARROW_ANGLE));
   
        var path = new Path();

        path.style = this.style;
        line.style = this.style;
        line1.style = this.style;
        
        path.addPrimitive(line);
        path.addPrimitive(line1);
        
        return path;
    },

    /**Creates a triangle like figure, pointed down \/, at a certain position
     * @param {Number} x - the X coordinates of the point
     * @param {Number} y - the X coordinates of the point
     * @param {Boolean} fill - if true fill the triangle
     * @return {Path} the arrow as a {Path} object
     * @author Zack, Alex
     * */
    getTriangle:function(x,y,fill){

        var startPoint = new Point(x,y);
        var point2 = Util.getEndPoint(startPoint,Connector.ARROW_SIZE, Math.PI/180*Connector.ARROW_ANGLE);
        var point3 = Util.getEndPoint(startPoint, Connector.ARROW_SIZE, - Math.PI/180*Connector.ARROW_ANGLE);
        
        var tri = new Polygon();
        tri.addPoint(startPoint);
        tri.addPoint(point2);
        tri.addPoint(point3);
        
        tri.style = this.style.clone();
        if(fill){
            tri.style.fillStyle = this.style.strokeStyle;
        }
        else{
            tri.style.fillStyle = '#FFFFFF';
        }
        
        return tri;
    },


    
    /**Paints the connector
     *@param {CanvasRenderingContext2D} context - the 2D context of the canvas
     *@author Alex, Zack, Artyom
     **/
    paint:function(context){
        //Do the start and end point match?
        if (this.areStartEndPointsMatch()) {
            // then not paint Connector at all
            return;
        }

        context.save();
        
        this.style.setupContext(context);

        switch(this.type){
            case Connector.TYPE_ORGANIC:
                this.paintOrganic(context);
                break;
                
            case Connector.TYPE_STRAIGHT:
            case Connector.TYPE_JAGGED:
                context.beginPath();

                //paint connector's line
                context.moveTo(this.turningPoints[0].x, this.turningPoints[0].y);
        
                for(var i=1; i< this.turningPoints.length; i++){
                    //start style
                    if(this.startStyle == Connector.STYLE_EMPTY_TRIANGLE && i == 1){ //special case
                        //get the angle of the start line
                        var angle = Util.getAngle(this.turningPoints[0],this.turningPoints[1]);
                        //by alex: var newPoint = Util.getEndPoint(this.turningPoints[0], Connector.ARROW_SIZE * Math.sin(Math.PI/180 * Connector.ARROW_ANGLE * 2), angle);
                        var newPoint = Util.getEndPoint(this.turningPoints[0], Connector.ARROW_SIZE * Math.cos(Math.PI/180 * Connector.ARROW_ANGLE), angle);
                        //move to new start
                        context.moveTo(newPoint.x, newPoint.y);
                    }
            
                    //end style
                    if(this.endStyle == Connector.STYLE_EMPTY_TRIANGLE && i == this.turningPoints.length -1){ //special case 
                        //get the angle of the final line
                        var angle = Util.getAngle(this.turningPoints[i-1],this.turningPoints[i]);
                        //by alex: var newPoint = Util.getEndPoint(this.turningPoints[i], -Connector.ARROW_SIZE*Math.sin(Math.PI/180*Connector.ARROW_ANGLE*2), angle)
                        var newPoint = Util.getEndPoint(this.turningPoints[i], -Connector.ARROW_SIZE * Math.cos(Math.PI/180 * Connector.ARROW_ANGLE), angle)
                        //line to new end
                        context.lineTo(newPoint.x, newPoint.y);
                    }
                    else{
                        context.lineTo(this.turningPoints[i].x, this.turningPoints[i].y);
                    }
                }
                context.stroke();
                break;
        }
        
        this.paintVisualDebug(context);

        this.paintStart(context);
        this.paintEnd(context);

        this.paintText(context);
        
        
        context.restore();
    },
    
    /**
     * @param {CanvasRenderingContext2D} context the context to draw 
     * */
    paintOrganic : function(context){
        //poly.style.strokeStyle = '#000000';
        //poly.style.lineWidth = 1;
        //poly.paint(context);

        //paint NURBS
//        var rPoints  = Util.collinearReduction(this.turningPoints);
        var rPoints  = this.turningPoints;
        Log.info("Connector:paint() - Number of reduced points: " + rPoints.length + " " + rPoints);
        
        //1 - Draw NURB based only on turning points
        var n = new NURBS(rPoints);
        n.style.strokeStyle = 'rgba(0,100,0,0.5)'; //green
        
        //paint glow
        if(DIAGRAMO.debug){
            //Log.info("Nr of cubic curves " +  this.fragments.length);
            for(var f=0; f<n.fragments.length; f++){
                var fragment = n.fragments[f].clone();                
                fragment.style.lineWidth =  6;
                fragment.style.strokeStyle = "rgb(" + f * 100 % 255 + "," + f * 50 % 255 + "," + f * 20 % 255 + ")";
                fragment.paint(context);
            }
        }
        
        n.paint(context);
        //end 1
        

//        //2 - Draw NURB based on turning points (except first and last) and middle of each segment
//        var points = [];
//
//        var point = rPoints[0];
//
//        //add controll points AND the middle of each segment (except first and last)
//        for(var i=0; i < rPoints.length-1; i++){
//            point = rPoints[i];
//            
//            //add point
//            points.push(point.clone());
//            
//            if(i == 0 || i == rPoints.length-2){ ///skip first and last middle
//                continue;
//            }
//            //add middle of current segment
//            var nextPoint = rPoints[i+1];
//            var middlePoint = new Point( (point.x + nextPoint.x) / 2, (point.y + nextPoint.y) / 2);
//            points.push(middlePoint.clone());
//        }
//        points.push(rPoints[rPoints.length-1]);
//
//
//        Log.info("Connector:paint() - New points: " + points);
//        context.save();
//        //draw  
//        context.beginPath();
//
//        context.strokeStyle = '#00CC00';
//        context.fillStyle = '#FF0000';
//        context.lineWidth = '2';
//
//        //small dots
//        for(var p in points){
//            context.fillRect(points[p].x - 1, points[p].y - 1 , 3, 3);
//        }       
//
//        var n2 = new NURBS(points);
//        n2.style.strokeStyle = 'rgba(0,0,100,0.5)'; //blue
//        n2.paint(context);
//        //end 2
//
//        
//        //3 - Draw NURB based on turning points (except first and last) and middle of each segment
//        points = [];
//        var point = rPoints[0];
//
//        //add controll points in the middle of each segment (except first and last)
//        for(var i=0; i < rPoints.length-1; i++){
//            point = rPoints[i];
//            var nextPoint = rPoints[i+1];
//            var middlePoint = new Point( (point.x + nextPoint.x) / 2, (point.y + nextPoint.y) / 2);
//
//            points.push(point.clone());
//            points.push(middlePoint.clone());
//        }
//        points.push(rPoints[rPoints.length-1]);
//
//        var n2 = new NURBS(points);
//        n2.style.strokeStyle = 'rgba(100,0,0,0.5)'; //red
//        n2.paint(context);
//        //end 3
    },


    paintStart : function(context){
        //paint start style
        var path = null;
        if(this.startStyle == Connector.STYLE_ARROW){
            path = this.getArrow(this.turningPoints[0].x, this.turningPoints[0].y);
        }
        if(this.startStyle == Connector.STYLE_EMPTY_TRIANGLE){
            path = this.getTriangle(this.turningPoints[0].x, this.turningPoints[0].y, false);
        }
        if(this.startStyle == Connector.STYLE_FILLED_TRIANGLE){
            path = this.getTriangle(this.turningPoints[0].x, this.turningPoints[0].y, true);
        }


        //move start path(arrow, triangle, etc) into position
        if(path){
            var transX = this.turningPoints[0].x;
            var transY = this.turningPoints[0].y;

            var lineAngle = Util.getAngle(this.turningPoints[0], this.turningPoints[1], 0);
            path.transform(Matrix.translationMatrix(-transX, -transY));
            path.transform(Matrix.rotationMatrix(lineAngle));
            path.transform(Matrix.translationMatrix(transX,transY));

            context.save();

            //context.lineJoin = "miter";
            context.lineJoin = "round";
            context.lineCap = "round";
            path.paint(context);
            
            context.restore();
        }
    },
    
    paintEnd : function(context){
        //paint end style
        var path = null;
        if(this.endStyle == Connector.STYLE_ARROW){
            path = this.getArrow(this.turningPoints[this.turningPoints.length-1].x, this.turningPoints[this.turningPoints.length-1].y);
        }
        if(this.endStyle == Connector.STYLE_EMPTY_TRIANGLE){
            path = this.getTriangle(this.turningPoints[this.turningPoints.length-1].x, this.turningPoints[this.turningPoints.length-1].y, false);
        }
        if(this.endStyle == Connector.STYLE_FILLED_TRIANGLE){
            path = this.getTriangle(this.turningPoints[this.turningPoints.length-1].x, this.turningPoints[this.turningPoints.length-1].y, true);
        }

        //move end path (arrow, triangle, etc) into position
        if(path){
            var transX = this.turningPoints[this.turningPoints.length-1].x;
            var transY = this.turningPoints[this.turningPoints.length-1].y;
            var lineAngle = Util.getAngle(this.turningPoints[this.turningPoints.length-1], this.turningPoints[this.turningPoints.length-2], 0);
            
            path.transform(Matrix.translationMatrix(-transX, -transY));
            path.transform(Matrix.rotationMatrix(lineAngle));
            path.transform(Matrix.translationMatrix(transX, transY));

            context.save();

            context.lineJoin = "round";
            context.lineCap = "round";

            path.paint(context);

            context.restore();
        }
    },
    
    
    paintVisualDebug : function (context){
        //paint debug points
        if(DIAGRAMO.debug){
            context.beginPath();
            for(var i=0; i< this.turningPoints.length; i++){
                context.moveTo(this.turningPoints[i].x, this.turningPoints[i].y);
                context.arc(this.turningPoints[i].x, this.turningPoints[i].y, 3, 0, Math.PI*2, false);
                
            //context.strokeText('' + Util.round(this.turningPoints[i].x,2) + ',' + Util.round(this.turningPoints[i].y,2), this.turningPoints[i].x + 5, this.turningPoints[i].y - 5);
            }
            context.stroke();
            
            //paint coordinates
            context.save();
            for(var i=0; i< this.turningPoints.length; i++){
                context.fillText('(' + Util.round(this.turningPoints[i].x, 3) + ', ' + Util.round(this.turningPoints[i].y, 3) + ')', this.turningPoints[i].x + 5, this.turningPoints[i].y - 5);
            }
            context.restore();
        }
    },
    
    
    /**Paints the text of the connector
     *@param {Context} context - the 2D context of the canvas
     *@private 
     *@author Alex
     **/
    paintText : function(context){
        if(this.middleText.str != ''){
            
            //TODO: not so smart to paint the background of the text
            var oldFill = context.fillStyle;
            
            context.beginPath();
            var textBounds = this.middleText.getBounds();
            context.moveTo(textBounds[0],textBounds[1]);
            context.lineTo(textBounds[0],textBounds[3]);
            context.lineTo(textBounds[2],textBounds[3]);
            context.lineTo(textBounds[2],textBounds[1]);
            context.fillStyle = "white";
            context.closePath();
            context.fill();
            
            context.fillStyle = oldFill;
            this.middleText.paint(context);
        }
    },


    
    /**
     *Apply a transformation to this Connector
     *@param {Matrix} matrix - a matrix of numbers
     **/
    transform:function(matrix){

        //are we moving the whole Connector, or just one point?
        if(this.activeConnectionPointId != -1){
            var point = CONNECTOR_MANAGER.connectionPointGetById(this.activeConnectionPointId);
            point.transform(matrix);
        }
        else{
            for(var i=0; i<this.turningPoints.length; i++){
                this.turningPoints[i].transform(matrix);
            }
        //this.startText.transform(matrix);
        //this.endText.transform(matrix);
        }

    },

    /**
     *Creates as jagged(zig-zag) line between 2 ConnectionPoints
     *@author Zack Newsham <zack_newsham@yahoo.co.uk>
     *@deprecated
     **/
    jagged:function(){
        this.jaggedReloaded();
        return;

        
        //reference to the start and end
        var endPoint=this.turningPoints.pop();
        var startPoint=this.turningPoints[0];

        //the figure at the start
        var startConnectionPoint = CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[0];
        var glue  = CONNECTOR_MANAGER.glueGetByConnectionPointId(startConnectionPoint.id)[0];//there will only be one for this

        var startConnectionFigureId = CONNECTOR_MANAGER.connectionPointGet(glue.id1 == startConnectionPoint.id ? glue.id2 : glue.id1).parentId;
        var startConnectionFigure = STACK.figureGetById(startConnectionFigureId);
        
        var startCenterPoint;
        if(startConnectionFigure){
            startCenterPoint = startConnectionFigure.rotationCoords[0];
        }
        else{
            startCenterPoint = startPoint;
        }

        //the figure at the end
        var endCon = CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[1];
        glue  = CONNECTOR_MANAGER.glueGetByConnectionPointId(endCon.id)[0];//there will only be one for this
        var endConnectionFigure=CONNECTOR_MANAGER.connectionPointGet(glue.id1==endCon.id ? glue.id2 : glue.id1).parentId;
        endConnectionFigure=STACK.figureGetById(endConnectionFigure);
        var endCenterPoint;
        if(endConnectionFigure){
            endCenterPoint = endConnectionFigure.rotationCoords[0];
        }
        else {
            endCenterPoint = endPoint;
        }

        //regardless of whih figure was clicked first, the left figure is start.
        var swapped = false;
        if(endCenterPoint.x<startCenterPoint.x){
            var t = endCenterPoint;
            endCenterPoint = startCenterPoint;
            startCenterPoint = t;

            t = endConnectionFigure;
            endConnectionFigure = startConnectionFigure;
            startConnectionFigure = t;
            
            t = endPoint;
            endPoint = startPoint;
            startPoint = t;
            swapped = true;
        }


        //we use this later
        var endPoints = [endPoint];

        //clear the array of all intermediate turningPoints, we use this when we have a connector that is moved from one connectionPoint to another
        this.turningPoints=[startPoint];
        
        //start+end+4 turning points
        var nextPoint;
        var startAngle=Util.getAngle(startCenterPoint,startPoint,Math.PI/2);
        var endAngle=Util.getAngle(endCenterPoint,endPoint,Math.PI/2);

        //move away from figure in angle(90) direction

        //END FIGURE ESCAPE
        if(endAngle==0){
            nextPoint=new Point(endPoint.x,endConnectionFigure.getBounds()[1]-20);
        }
        else if(endAngle==Math.PI/2){
            nextPoint=new Point(endConnectionFigure.getBounds()[2]+20,endPoint.y);
        }
        else if(endAngle==Math.PI){
            nextPoint=new Point(endPoint.x,endConnectionFigure.getBounds()[3]+20);
        }
        else{
            nextPoint=new Point(endConnectionFigure.getBounds()[0]-20,endPoint.y);
        }
        endPoints.push(nextPoint);
        endPoint = nextPoint;

        var previousPoint = startPoint;

        //START FIGURE ESCAPE
        //clear bounds
        //clear bounds by 20px in direction of angle
        if(startAngle==0){
            nextPoint=new Point(startPoint.x,startConnectionFigure.getBounds()[1]-20);
        }
        else if(startAngle==Math.PI/2){
            nextPoint=new Point(startConnectionFigure.getBounds()[2]+20,startPoint.y);
        }
        else if(startAngle==Math.PI){
            nextPoint=new Point(startPoint.x,startConnectionFigure.getBounds()[3]+20);
        }
        else{
            nextPoint=new Point(startConnectionFigure.getBounds()[0]-20,startPoint.y);
        }
        this.turningPoints.push(nextPoint);

        startPoint = nextPoint;
        
        var currentPoint = startPoint;
        nextPoint = null;
        var angles = [0, Math.PI/2, Math.PI, Math.PI/2*3, Math.PI*2];
        var startCounter = 0; //keeps track of new turning points added
        var intEnd = Util.lineIntersectsRectangle(startPoint, endPoint, endConnectionFigure.getBounds());
        var intStart = Util.lineIntersectsRectangle(startPoint, endPoint, startConnectionFigure.getBounds());
        while(intEnd || intStart){//while we have an intersection, keep trying

            //get the angle of the last turn made, we know we need to do something 90degrees off this
            startAngle = Util.getAngle(startPoint,this.turningPoints[this.turningPoints.length-2],Math.PI/2);
            endAngle = Util.getAngle(endPoint,endPoints[endPoints.length-2],Math.PI/2);
            switch (startCounter){
                case 0:
                    if(startAngle==0 || startAngle==Math.PI){ //we were going N/S, now we want to go E/W
                        if(startPoint.x < endPoint.x){
                            startPoint = new Point(startConnectionFigure.getBounds()[2]+20, startPoint.y);
                        }
                        else{
                            startPoint = new Point(startConnectionFigure.getBounds()[0]-20, startPoint.y);
                        }
                    }
                    else{//going E/W now want N/S
                        if(startPoint.y<endPoint.y || endPoint.y>startConnectionFigure.getBounds()[1]){
                            startPoint = new Point(startPoint.x,startConnectionFigure.getBounds()[3]+20);
                        }
                        else{
                            startPoint = new Point(startPoint.x,startConnectionFigure.getBounds()[1]-20);
                        }
                    }
                    this.turningPoints.push(startPoint);
                    break;
                case 1://we have already done something to the startPoint, changing the end point should resolve the issue
                    endPoints.push(endPoint);
                    if(endAngle==0 || endAngle==Math.PI){ //we were going N/S, now we want to go E/W
                        if(startPoint.x > endPoint.x){
                            endPoint = new Point(endConnectionFigure.getBounds()[2]+20,endPoint.y);
                        }
                        else{
                            endPoint = new Point(endConnectionFigure.getBounds()[0]-20,endPoint.y);
                        }
                    }
                    else{//going E/W now want N/S
                        if(startPoint.y > endPoint.y){
                            endPoint = new Point(endPoint.x,endConnectionFigure.getBounds()[3]+20);
                        }
                        else{
                            endPoint = new Point(endPoint.x,endConnectionFigure.getBounds()[1]-20);
                        }
                    }
                    break;
            }
            
            startCounter++;
            intEnd=Util.lineIntersectsRectangle(startPoint, endPoint, endConnectionFigure.getBounds());
            intStart=Util.lineIntersectsRectangle(startPoint, endPoint, startConnectionFigure.getBounds());
            if(startCounter==3){//we have done all we can, if we still can't make a good jagged, make a bad one
                break;
            }
        }

        //there are no intersections of the straight line between start and end
        //now lets see if making a jagged line will create one
        //this should only occur when we need to make an opposite turn, that could lead to us running along the edge of one figures bounds
        if(!Util.lineIntersectsRectangle(new Point(startPoint.x,endPoint.y), new Point(endPoint.x,endPoint.y), endConnectionFigure.getBounds())
            && !Util.lineIntersectsRectangle(new Point(startPoint.x,endPoint.y), new Point(endPoint.x,endPoint.y), startConnectionFigure.getBounds())
            && !Util.lineIntersectsRectangle(new Point(startPoint.x,startPoint.y), new Point(startPoint.x,endPoint.y), endConnectionFigure.getBounds())
            && !Util.lineIntersectsRectangle(new Point(startPoint.x,startPoint.y), new Point(startPoint.x,endPoint.y), startConnectionFigure.getBounds()))
            {
            this.turningPoints.push(new Point(startPoint.x,endPoint.y));
        }
        else {//if(!Util.lineIntersectsRectangle(new Point(endPoint.x,startPoint.y), new Point(endPoint.x,endPoint.y), endConnectionFigure.getBounds()) && !Util.lineIntersectsRectangle(new Point(endPoint.x,startPoint.y), new Point(endPoint.x,endPoint.y), startConnectionFigure.getBounds())){
            this.turningPoints.push(new Point(endPoint.x,startPoint.y));
        }
        /*else{//worst case scenario, we cant go up then across, cant go across then up, lets clear the end figure, and go up then across
            var yMove=(startPoint.y>endPoint.y?endConnectionFigure.getBounds()[3]+20:endConnectionFigure.getBounds()[3]-20);
            this.turningPoints.push(new Point(startPoint.x,yMove));
            this.turningPoints.push(new Point(endPoint.x,yMove));
        }*/

        //add the endPoints we have changed to the line
        this.turningPoints.push(new Point(endPoint.x,endPoint.y));
        for(var i=0; i<endPoints.length; i++){
            this.turningPoints.push(endPoints.pop());
            i--; //lower the counter or we will only get half the points
        }

        //if our line was supposed to go backwards, lets reverse it
        if(swapped){
            this.turningPoints = this.turningPoints.reverse();
        }
    },


    /**A rework of jagged method
     *Just creates all turning points for Connector that has a StartPoint and an EndPoint
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    jaggedReloaded:function(){
        
        //reference to the start and end
        var startPoint = this.turningPoints[0];
        var startExitPoint = null; //next turning point after the startPoint (if start figure present)
        var endExitPoint = null; //the last turning point before endPoint (if end figure present)
        var endPoint = this.turningPoints[this.turningPoints.length-1];
        
        

        //START FIGURE
        var startConnectionPointOnConnector = CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[0]; //fist ConnectionPoint on the Connector
        var glue  = CONNECTOR_MANAGER.glueGetByConnectionPointId(startConnectionPointOnConnector.id)[0];//the (only) Glue tied to ConnectionPoint

        if(glue != null){ //only if there is a Figure glued
            //get ConnectionPoint on Figure
            var startFigureConnectionPoint = CONNECTOR_MANAGER.connectionPointGet(glue.id1 == startConnectionPointOnConnector.id ? glue.id2 : glue.id1);
            var startFigure = STACK.figureGetById(startFigureConnectionPoint.parentId);

            var startAngle = Util.getAngle(startFigure.rotationCoords[0], startPoint, Math.PI/2);
            switch(startAngle){
                case 0: //north exit
                    startExitPoint = new Point(startPoint.x, startFigure.getBounds()[1]-20);
                    break;
                case Math.PI/2: //east exit
                    startExitPoint = new Point(startFigure.getBounds()[2]+20, startPoint.y);
                    break;
                case Math.PI: //south exit
                    startExitPoint = new Point(startPoint.x, startFigure.getBounds()[3]+20);
                    break;
                case 3 * Math.PI/2: //west exit
                    startExitPoint = new Point(startFigure.getBounds()[0]-20, startPoint.y);
                    break;                                            
            }
        }


        //END FIGURE
        var endConnectionPointOnConnector = CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[1]; //last ConnectionPoint on Connector
        glue  = CONNECTOR_MANAGER.glueGetByConnectionPointId(endConnectionPointOnConnector.id)[0];//there will only be one for this
        
        if(glue != null){ //only if there is a Figure glued
            //get ConnectionPoint on Figure
            var endFigureConnectionPoint = CONNECTOR_MANAGER.connectionPointGet(glue.id1 == endConnectionPointOnConnector.id ? glue.id2 : glue.id1);
            var endFigure = STACK.figureGetById(endFigureConnectionPoint.parentId);

            var endAngle = Util.getAngle(endFigure.rotationCoords[0], endPoint, Math.PI/2);
            switch(startAngle){
                case 0: //north exit
                    endExitPoint = new Point(endPoint.x, endFigure.getBounds()[1]-20);
                    break;
                case Math.PI/2: //east exit
                    endExitPoint = new Point(endFigure.getBounds()[2]+20, endPoint.y);
                    break;
                case Math.PI: //south exit
                    endExitPoint = new Point(endPoint.x, endFigure.getBounds()[3]+20);
                    break;
                case 3 * Math.PI/2: //west exit
                    endExitPoint = new Point(endFigure.getBounds()[0]-20, endPoint.y);
                    break;
            }
        }

        alert('jaggedReloaded:Connector has ' + this.turningPoints.length + " points");
        this.turningPoints.splice(1,0, startExitPoint, endExitPoint);
        alert('jaggedReloaded:Connector has ' + this.turningPoints.length + " points");
    },

    /**This function simply tries to create all possible intermediate points that can be placed
     *between 2 points to create a jagged connector
     *@param {Point} p1 - a point
     *@param {Point} p2 - the other point*/
    connect2Points:function(p1, p2){
        var solutions = [];

        //1. is p1 == p2?
        if(p1.equals(p2)){
            
        }
        
        //2. is p1 on a vertical or horizontal line with p2? S0
        //3. can we have a single intermediate point? S1
        //4. can we have 2 intermediate points? S2
        return solutions;
    },

    /**
     *Remove redundant points (we have just ajusted one of the handles of this figure, so)
     **/
    redraw:function(){
        if(this.type=='jagged'){
            var changed=true;
            while(changed==true){
                changed=false;
                for(var i=1; i<this.turningPoints.length-2; i++){
                    if(this.turningPoints[i].x == this.turningPoints[i-1].x && this.turningPoints[i-1].x == this.turningPoints[i+1].x){
                        this.turningPoints.splice(i,1);
                        changed=true;
                    }
                    if(this.turningPoints[i].y == this.turningPoints[i-1].y && this.turningPoints[i-1].y == this.turningPoints[i+1].y){
                        this.turningPoints.splice(i,1);
                        changed=true;
                    }
                }
            }
            
        }
    },

    /**
     * Transform a ConnectionPoint by a matrix. Usually called only by ConnectionManager.connectionPointTransform(),
     * when a figure is being moved, so it's more or less start point or end point of a connector.
     * Important to remember is that by moving and edge turning point all ther might be cases when more than one
     * points need to change
     * Once a figure is changed its ConnectionPoints got tranformed...so the glued Connector must
     * change...it's like a cascade change
     * @param {Matrix} matrix - the transformation to be used
     * @param {Point} point - the point to start from (could be end or start). It is the point that
     * triggered the adjustement
     */
    adjust:function(matrix, point){
        
        //Log.info('Adjusting...');
        if(this.type == Connector.TYPE_STRAIGHT){
            //Log.info("straight ");
            
            var tempConPoint = CONNECTOR_MANAGER.connectionPointGetByParentAndCoordinates(this.id, point.x, point.y);

            //find index of the turning point
            var index = -1;
            if(this.turningPoints[0].equals(point)){
                index = 0;
            }
            else if(this.turningPoints[1].equals(point)){
                index = 1;
            }
            else{
                Log.error("Connector:adjust() - This should not happend" + this.toString() + ' point is ' + point);
            }

            
            //Log.info('\tinitial' +  tempConPoint.toString());
            tempConPoint.transform(matrix);
            //Log.info('\tafter' +  tempConPoint.toString());


            this.turningPoints[index].x = tempConPoint.point.x;
            this.turningPoints[index].y = tempConPoint.point.y;

        /*TODO: it seems that the code bellow is not working fine...clone is wrong?
            this.turningPoints[index] = new Point(tempConPoint.point.x,tempConPoint.point.y);
            */

        }

        if(this.type == Connector.TYPE_JAGGED){
            //Log.info("jagged ");
            var oldX = point.x;
            var oldY = point.y;
            
            var tempConPoint = CONNECTOR_MANAGER.connectionPointGetByParentAndCoordinates(this.id, point.x, point.y);
            tempConPoint.transform(matrix);
            
            //are we starting from beginning or end, so we will detect the interval and direction
            var start,end,direction;
            if(point.equals(this.turningPoints[0])){//if the point is the starting Point
                //Log.info("It is the starting point");
                
                //adjust first turning point
                this.turningPoints[0].x = tempConPoint.point.x;
                this.turningPoints[0].y = tempConPoint.point.y;
            
                start = 1;
                end = this.turningPoints.length;
                direction = 1;
            }
            else if(point.equals(this.turningPoints[this.turningPoints.length -1])){ //if the point is the ending Point
                //Log.info("It is the ending point");

                //adjust last turning point
                this.turningPoints[this.turningPoints.length -1].x = tempConPoint.point.x;
                this.turningPoints[this.turningPoints.length -1].y = tempConPoint.point.y;
                
                start = this.turningPoints.length - 2;
                end = -1;
                direction = -1;
            }
            else{
                Log.error("Connector:adjust() - this should never happen for point " + point + ' and connector ' + this.toString());
            }

            //TODO: the only affected turning point should be ONLY the next one (if start point) or previous one (if end point)
            for(var i=start; i!=end; i+=direction){
                //If this turningPoints X==last turningPoints X (or Y), prior to transformation, then they used to be the same, so make them the same now
                //dont do this if they are our start/end point
                //we don't want to use them if they are on he exact spot
                if(this.turningPoints[i].y != oldY
                    && this.turningPoints[i].x == oldX //same x
                    && this.turningPoints[i] != CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[0].point 
                    && this.turningPoints[i] != CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[1].point )
                    {
                    oldX = this.turningPoints[i].x;
                    oldY = this.turningPoints[i].y;
                    this.turningPoints[i].x = this.turningPoints[i-direction].x;
                }
                else if(this.turningPoints[i].x != oldX
                    && this.turningPoints[i].y == oldY 
                    && this.turningPoints[i] != CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[0].point 
                    && this.turningPoints[i] != CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id)[1].point )
                    {
                    oldX = this.turningPoints[i].x;
                    oldY = this.turningPoints[i].y;
                    this.turningPoints[i].y = this.turningPoints[i-direction].y;
                }
            }
        }
    },


    /**Applies solution from ConnectionManager.connector2Points() method.
     *@param {Array} solutions - value returned from ConnectionManager.connector2Points()
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     *@author Alex
     **/
    applySolution: function(solutions) {
        // solution category: 's0', 's1_1', 's2_2', etc.
        var solutionCategory = solutions[0][1];

        /*We should check if solution changed from previous.
        * Solution determined by it's category (s1_2, s2_1) and number of turning points.*/
        if (!this.solution //No solution?
                || this.solution != solutionCategory   // Did category changed?
                || this.turningPoints.length != solutions[0][2].length) {   // Did number of turning points changed?
            this.solution = solutionCategory;   // update solution
            this.clearUserChanges();  // clear user changes
            this.turningPoints = Point.cloneArray(solutions[0][2]);  // update turning points
        } else { //same solution (category and turning points no)
            this.turningPoints = Point.cloneArray(solutions[0][2]);    // get turning points from solution
            this.applyUserChanges();    // apply user changes to turning points
        }

        this.updateMiddleText();    // update position of middle text
    },


    /**Applies user changes to turning points.
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    applyUserChanges: function() {
        var changesLength = this.userChanges.length;
        var currentChange;
        var translationMatrix;

        // go through and apply all changes
        for (var i = 0; i < changesLength; i++) {
            currentChange = this.userChanges[i];

            // generate translation matrix
            if (currentChange.align == Connector.USER_CHANGE_HORIZONTAL_ALIGN) {    // Do we have horizontal change?
                translationMatrix = Matrix.translationMatrix(currentChange.delta, 0);   // apply horizontal delta
            } else if (currentChange.align == Connector.USER_CHANGE_VERTICAL_ALIGN) {       // Do we have vertical change?
                translationMatrix = Matrix.translationMatrix(0, currentChange.delta);   // apply vertical delta
            }
            // apply change
            this.turningPoints[currentChange.index].transform(translationMatrix);
        }
    },


    /**Adds user change.
     *@param {Object} userChange - user change to add. It's form is
     * {align : '', delta: '', index: ''} where 
     *  align:  Connector.USER_CHANGE_VERTICAL_ALIGN | Connector.USER_CHANGE_HORIZONTAL_ALIGN
     *  delta: Numeric
     *  index : the index of turning point     
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    addUserChange: function(userChange) {
        var changesLength = this.userChanges.length;
        var currentChange;
        
        /*First seach if we need to merge current change with existing one,
         * if no existing one present we will simply add it.*/

        // Go through all changes (Merge option)
        for (var i = 0; i < changesLength; i++) {
            currentChange = this.userChanges[i];

            // Do we have change with such align and index?
            if (currentChange.align == userChange.align && currentChange.index == userChange.index) {
                /* update delta of previous change
                 * we should accumulate delta value, not replace
                 * because current step here based on previous*/
                currentChange.delta += userChange.delta;
                return; // work is done - exit function
            }
        }

        // we have new change and add it to array (new change)
        this.userChanges.push(userChange);
    },


    /**Clears user changes.
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    clearUserChanges: function() {
        this.userChanges = [];
    },


    /**Clones array of user changes.
     *@return {Array} - array containing current user changes
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    cloneUserChanges: function() {
        var clonedArray = [];
        var changesLength = this.userChanges.length;

        // go through and clone all user changes
        for (var i = 0; i < changesLength; i++) {
            // create new instance of user changes
            // set values equal to current user change
            // push new instance in result array with cloned user changes
            clonedArray.push({
                align: this.userChanges[i].align,
                index: this.userChanges[i].index,
                delta: this.userChanges[i].delta
            });
        }

        return clonedArray;
    },


    /**Check if start and end members of turningPoints match/are the same.
     *@return {Boolean} - match or not
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    areStartEndPointsMatch: function() {
        return this.turningPoints[0].equals(this.turningPoints[this.turningPoints.length - 1]);
    },
    

    /**
     * See if a file is on a connector
     * @param {Number} x - coordinate
     * @param {Number} y - coordinate
     * @author alex
     */
    contains:function(x,y){
        var r = false;
        switch(this.type){
            
            case Connector.TYPE_STRAIGHT:
                //just fall :)
                
            case Connector.TYPE_JAGGED:
                for(var i=0; i<this.turningPoints.length-1; i++){
                    var l = new Line(this.turningPoints[i],this.turningPoints[i+1]);
                    if( l.contains(x, y) ){
                        r = true;
                        break;
                    }
                }
                break;
                
            case Connector.TYPE_ORGANIC:
                var n = new NURBS(this.turningPoints);
                
                r = n.contains(x, y);
                
                break;
        }
        
        return r;
    },

    /**Tests if a point defined by (x,y) is within a radius
     *@param {Number} x - x coordinates of the point
     *@param {Number} y - y coordinates of the point
     *@param {Number} radius - the radius to seach within
     *@author alex
     **/
    near:function(x,y,radius){
        var r = false;
        switch(this.type){
            
            case Connector.TYPE_STRAIGHT:
                //just fall :)
                
            case Connector.TYPE_JAGGED:
                for(var i=0; i<this.turningPoints.length-1; i++){
                    var l = new Line(this.turningPoints[i],this.turningPoints[i+1]);
                    if( l.near(x, y, radius) ){
                        r = true;
                        break;
                    }
                }
                
                break;
                
            case Connector.TYPE_ORGANIC:
                var n = new NURBS(this.turningPoints);
                
                r = n.near(x, y, radius);
                break;
                
        }
        
        return r;                
    },


    /**Returns the middle of a connector
     *Usefull for setting up the middle text
     *@return {Array} of 2 {Number}s - the x and y of the point
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    middle:function(){
        if(this.type == Connector.TYPE_STRAIGHT){
            var middleX = (this.turningPoints[0].x + this.turningPoints[1].x)/2;
            var middleY = (this.turningPoints[0].y + this.turningPoints[1].y) /2;
            return [middleX, middleY];
        }
        else if(this.type == Connector.TYPE_JAGGED){
            /** Algorithm:
             * Find the lenght of the connector. Then go on each segment until we will reach half of the
             * connector's lenght.
             **/

            //find total distance
            var distance = 0;
            for(var i=0; i<this.turningPoints.length-1; i++){
                distance += Util.getLength(this.turningPoints[i], this.turningPoints[i+1]);
            }

            //find between what turning points the half distance is
            var index = -1;
            var ellapsedDistance = 0;
            for(var i=0; i<this.turningPoints.length-1; i++){
                index = i;
                var segment = Util.getLength(this.turningPoints[i], this.turningPoints[i+1]);
                if(ellapsedDistance + segment < distance /2){
                    ellapsedDistance += segment;
                }
                else{
                    break;
                }
            }

            //we have the middle distance somewhere between i(ndex) and i(ndex)+1
            if(index != -1){
                var missingDistance = distance / 2 - ellapsedDistance;
                if( Util.round(this.turningPoints[index].x, 3) == Util.round(this.turningPoints[index + 1].x, 3) ){ //vertical segment (same x)
                    return [this.turningPoints[index].x, Math.min(this.turningPoints[index].y, this.turningPoints[index + 1].y) + missingDistance];
                } else if( Util.round(this.turningPoints[index].y, 3) == Util.round(this.turningPoints[index + 1].y, 3) ) { //horizontal segment (same y)
                    return [Math.min(this.turningPoints[index].x, this.turningPoints[index + 1].x) + missingDistance, this.turningPoints[index].y];
                } else{
                    Log.error("Connector:middle() - this should never happen " + this.turningPoints[index] + " " + this.turningPoints[index + 1]
                        + " nr of points " + this.turningPoints.length
                        );
                }

            }
        } else if(this.type === Connector.TYPE_ORGANIC){
            //TODO: Either compute the middle using pure NURB algorithm (and use t=0.5) or 
            //base it on the curves already computed (but they might no be evenly distributes
            //(or might not have the same length) to pick the middle of middle curve 
            //(if no. of curves is odd) or joining
            //point (if number of curves is even)
            var n = new NURBS(this.turningPoints);
            
            var middle = n.getMiddle();
            Log.info("Middle is " + middle);
            
            return [middle.x, middle.y];
        }

        return null;
    },


    /**Updates the middle text of the connector
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    updateMiddleText: function(){
        //        Log.info("updateMiddleText called");
        var middlePoint = this.middle();

        if(middlePoint != null){
            var m = Matrix.translationMatrix(middlePoint[0] - this.middleText.vector[0].x, middlePoint[1] - this.middleText.vector[0].y)
            this.middleText.transform(m);
        }
    },
    
    /**Founds the bounds of the connector
     *@return {Array} - the [minX, minY, maxX, maxY]
     **/
    getBounds:function(){
        var minX = null;
        var minY = null;
        var maxX = null;
        var maxY = null;
        for(var i=0; i<this.turningPoints.length; i++){
            if(this.turningPoints[i].x<minX || minX==null)
                minX = this.turningPoints[i].x;
            if(this.turningPoints[i].x>maxX || maxX==null)
                maxX = this.turningPoints[i].x;
            if(this.turningPoints[i].y<minY || minY==null)
                minY = this.turningPoints[i].y;
            if(this.turningPoints[i].y>maxY || maxY==null)
                maxY = this.turningPoints[i].y;
        }
        return [minX, minY, maxX, maxY];
    },
    
    /**String representation*/
    toString:function(){
        return 'Connector : (id = ' + this.id
            + ', type = ' + this.type
            + ', turningPoints = [' + this.turningPoints + ']'
            + ', userChanges = [' + this.userChanges + ']'
            + ', solution = ' + this.solution
            + ', startStyle = ' + this.startStyle
            + ', endStyle = ' + this.endStyle
            + ', activeConnectionPointId = ' + this.activeConnectionPointId
            + ')';
    },


    /**SVG representation of the connector
     *@return {String} - the SVG part
     **/
    toSVG:function(){

        //1. paint line
        var r = '<polyline points="';
        for(var i =0; i <this.turningPoints.length; i++){
            r += this.turningPoints[i].x + ',' + this.turningPoints[i].y + ' ';
        }
        r += '"';
        r += this.style.toSVG();
        //        r += ' style="fill: #none; stroke:#ADADAD;" ';
        r += '/>';

        //2. paint the start/end
        //paint start style
        var path = null;
        if(this.startStyle == Connector.STYLE_ARROW){
            path = this.getArrow(this.turningPoints[0].x, this.turningPoints[0].y);
        }
        if(this.startStyle == Connector.STYLE_EMPTY_TRIANGLE){
            path = this.getTriangle(this.turningPoints[0].x, this.turningPoints[0].y, false);
        }
        if(this.startStyle == Connector.STYLE_FILLED_TRIANGLE){
            path = this.getTriangle(this.turningPoints[0].x, this.turningPoints[0].y, true);
        }
        
        if(path){
            var transX = this.turningPoints[0].x;
            var transY = this.turningPoints[0].y;

            var lineAngle = Util.getAngle(this.turningPoints[0], this.turningPoints[1], 0);
            path.transform(Matrix.translationMatrix(-transX, -transY));
            path.transform(Matrix.rotationMatrix(lineAngle));
            path.transform(Matrix.translationMatrix(transX,transY));

            r += path.toSVG();
        }


        //paint end style
        if(this.endStyle == Connector.STYLE_ARROW){
            path = this.getArrow(this.turningPoints[this.turningPoints.length-1].x, this.turningPoints[this.turningPoints.length-1].y);
        }
        if(this.endStyle == Connector.STYLE_EMPTY_TRIANGLE){
            path = this.getTriangle(this.turningPoints[this.turningPoints.length-1].x, this.turningPoints[this.turningPoints.length-1].y, false);
        }
        if(this.endStyle == Connector.STYLE_FILLED_TRIANGLE){
            path = this.getTriangle(this.turningPoints[this.turningPoints.length-1].x, this.turningPoints[this.turningPoints.length-1].y, true);
        }
        //move end path (arrow, triangle, etc) into position
        if(path){
            var transX = this.turningPoints[this.turningPoints.length-1].x;
            var transY = this.turningPoints[this.turningPoints.length-1].y;
            var lineAngle = Util.getAngle(this.turningPoints[this.turningPoints.length-1], this.turningPoints[this.turningPoints.length-2], 0);

            path.transform(Matrix.translationMatrix(-transX, -transY));
            path.transform(Matrix.rotationMatrix(lineAngle));
            path.transform(Matrix.translationMatrix(transX, transY));

            r += path.toSVG();
        }

        

        //3. pain text (if any)
        if(this.middleText.str.length != 1){
            //paint white background
            var txtBounds = this.middleText.getBounds(); //this is actually an array of numbers [minX, minY, maxX, maxY]
            
            var poly = new Polygon();
            
            poly.addPoint(new Point(txtBounds[0], txtBounds[1]));
            poly.addPoint(new Point(txtBounds[2], txtBounds[1]));
            poly.addPoint(new Point(txtBounds[2], txtBounds[3]));
            poly.addPoint(new Point(txtBounds[0], txtBounds[3]));
            poly.style.fillStyle = "#FFFFFF";
            
            r += poly.toSVG();
            
            
            //paint actuall text
            r += this.middleText.toSVG();
        }

        return r;
    }
}

/**
 *A connection point that is attached to a figure and can accept connectors
 *
 *@constructor
 *@this {ConnectionPoint}
 *@param {Number} parentId - the parent to which this ConnectionPoint is attached. It can be either a {Figure} or a {Connector}
 *@param {Point} point - coordinate of this connection point, better than using x and y, because when we move "snap to" this
 * connectionPoint the line will follow
 *@param {Number} id - unique id to the parent figure
 *@param {String} type - the type of the parent. It can be either 'figure' or 'connector'
 *
 *@author Zack Newsham <zack_newsham@yahoo.co.uk>
 *@author Alex Gheorghiu <alex@scriptoid.com>
 */
function ConnectionPoint(parentId,point,id, type){
    /**Connection point id*/
    this.id = id;
    
    /**The {Point} that is behind this ConnectionPoint*/
    this.point = point.clone(); //we will create a clone so that no side effect will appear
    
    /**Parent id (id of the Figure or Connector)*/
    this.parentId = parentId;
    
    /**Type of ConnectionPoint. Ex: ConnectionPoint.TYPE_FIGURE*/
    this.type = type;
    
    /**Current connection point color*/
    this.color = ConnectionPoint.NORMAL_COLOR;
    
    /**Radius of the connection point*/
    this.radius = 3;
    
    /**Serialization type*/
    this.oType = 'ConnectionPoint'; //object type used for JSON deserialization

}

/**Color used by default to draw the connection point*/
ConnectionPoint.NORMAL_COLOR = "#FFFF33"; //yellow.

/*Color used to signal that the 2 connection points are about to glue*/
ConnectionPoint.OVER_COLOR = "#FF9900"; //orange

/*Color used to draw connected (glued) connection points*/
ConnectionPoint.CONNECTED_COLOR = "#ff0000"; //red

/**Connection point default radius*/
ConnectionPoint.RADIUS = 4;

/**Connection point (liked to)/ type figure*/
ConnectionPoint.TYPE_FIGURE = 'figure';

/**Connection point (liked to)/ type connector*/
ConnectionPoint.TYPE_CONNECTOR = 'connector';


/**Creates a {ConnectionPoint} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {ConnectionPoint} a newly constructed ConnectionPoint
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
ConnectionPoint.load = function(o){
    var newConnectionPoint = new ConnectionPoint(0, new Point(0,0), ConnectionPoint.TYPE_FIGURE); //fake constructor

    newConnectionPoint.id = o.id;
    newConnectionPoint.point = Point.load(o.point);
    newConnectionPoint.parentId = o.parentId;
    newConnectionPoint.type = o.type;
    
    newConnectionPoint.color = o.color;
    newConnectionPoint.radius = o.radius;

    return newConnectionPoint;
}

/**Creates a an {Array} of {ConnectionPoint} out of JSON parsed array
 *@param {JSONObject} v - the JSON parsed {Array}
 *@return {Array} of newly loaded {ConnectionPoint}s
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
ConnectionPoint.loadArray = function(v){
    var newConnectionPoints = [];

    for(var i=0; i<v.length; i++){
        newConnectionPoints.push(ConnectionPoint.load(v[i]));
    }

    return newConnectionPoints;
}

/**Clones an array of {ConnectionPoint}s
 *@param {Array} v - the array of {ConnectionPoint}s
 *@return an {Array} of {ConnectionPoint}s
 **/
ConnectionPoint.cloneArray = function(v){
    var newConnectionPoints = [];
    for(var i=0; i< v.length; i++){
        newConnectionPoints.push(v[i].clone());
    }
    return newConnectionPoints;
}


ConnectionPoint.prototype = {
    constructor : ConnectionPoint,

    
    /**Clone current {ConnectionPoint}
     **/
    clone: function(){
        //parentId,point,id, type
        return new ConnectionPoint(this.parentId, this.point.clone(), this.id, this.type );
    },
    
    /**Compares to another ConnectionPoint
     *@param {ConnectionPoint} anotherConnectionPoint - the other connection point
     *@return {Boolean} - true if equals, false otherwise
     **/
    equals:function(anotherConnectionPoint){

        return this.id == anotherConnectionPoint.id
        && this.point.equals(anotherConnectionPoint.point)
        && this.parentId == anotherConnectionPoint.parentId
        && this.type == anotherConnectionPoint.type
        && this.color == anotherConnectionPoint.color
        && this.radius == anotherConnectionPoint.radius;    
    },

    /**
     *Paints the ConnectionPoint into a Context
     *@param {Context} context - the 2D context
     **/
    paint:function(context){
        context.save();
        context.fillStyle = this.color;
        context.strokeStyle = '#000000';
        context.lineWidth = defaultThinLineWidth;
        context.beginPath();
        context.arc(this.point.x, this.point.y, ConnectionPoint.RADIUS, 0, (Math.PI/180)*360, false);
        context.stroke();
        context.fill();
        context.restore();
    },


    /**
     *Transform the ConnectionPoint through a Matrix
     *@param {Matrix} matrix - the transformation matrix
     **/
    transform:function(matrix){
        this.point.transform(matrix);
    },

    
    /**Highlight the connection point*/
    highlight:function(){
        this.color = ConnectionPoint.OVER_COLOR;
    },

    /**Un-highlight the connection point*/
    unhighlight:function(){
        this.color = ConnectionPoint.NORMAL_COLOR;
    },


    /**Tests to see if a point (x, y) is within a range of current ConnectionPoint
     *@param {Numeric} x - the x coordinate of tested point
     *@param {Numeric} y - the x coordinate of tested point
     *@return {Boolean} - true if inside, false otherwise
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    contains:function(x, y){
        return this.near(x, y, ConnectionPoint.RADIUS);
    },

    /**Tests to see if a point (x, y) is within a specified range of current ConnectionPoint
     *@param {Numeric} x - the x coordinate of tested point
     *@param {Numeric} y - the x coordinate of tested point
     *@param {Numeric} radius - the radius around this point
     *@return {Boolean} - true if inside, false otherwise
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    near:function(x, y, radius){
        return new Point(this.point.x,this.point.y).near(x,y,radius);
    },
    

    /**A String representation of the point*/
    toString:function(){
        return "ConnectionPoint id = " + this.id  + ' point = ['+ this.point + '] ,type = ' + this.type + ", parentId = " + this.parentId + ")";
    }
}



/**A Glue just glues together 2 ConnectionPoints.
 *Glued ConnectionPoints usually belongs to a Connector and a Figure.
 *
 *@constructor
 *@this {Glue}
 *@param {Number} cp1Id - the id of the first {ConnectionPoint} (usually from a {Figure})
 *@param {Number} cp2Id - the id of the second {ConnectionPoint} (usualy from a {Connector})
 *@param {Boolean} automatic - type of connection connector to a figure:
 * if true - {Connector} connects a {Figure} itself
 * else - {Connector} connects specific {ConnectionPoint} of {Figure}
 **/
function Glue(cp1Id,cp2Id,automatic){
    /**First shape's id (usually from a {Figure})*/
    this.id1 = cp1Id;    
    
    /**Second shape's id (usualy from a {Connector})*/
    this.id2 = cp2Id;

    /*By default all the Glues are created with the first number as Figure's id and second number as
     *Connector's id. In the future glues can be used to glue other types as well*/
    
    /**First id type (usually 'figure')*/
    this.type1 = 'figure';
    
    /**First id type (usually 'connector')*/
    this.type2 = 'connector';
    
    /**object type used for JSON deserialization*/
    this.oType = 'Glue';

    /**Type of connector's behaviour:
     * if it's true - connector connects the whole figure and touches it's optimum connection point
     * if it's false - connector connects one fixed connection point of the figure
     * */
    this.automatic = automatic;
}

/**Creates a {Glue} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Glue} a newly constructed Glue
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Glue.load = function(o){
    var newGlue = new Glue(-1, -1, false); //fake constructor

    newGlue.id1 = o.id1;
    newGlue.id2 = o.id2;
    newGlue.type1 = o.type1;
    newGlue.type2 = o.type2;
    newGlue.automatic = o.automatic ? o.automatic : false;

    return newGlue;
}


/**Creates a an {Array} of {Glue} out of JSON parsed array
 *@param {JSONObject} v - the JSON parsed {Array}
 *@return {Array} of newly loaded {Glue}s
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Glue.loadArray = function(v){
    var newGlues = [];

    for(var i=0; i<v.length; i++){
        newGlues.push(Glue.load(v[i]));
    }

    return newGlues;
}

/**Clones an array of points
 *@param {Array} v - the array of {Glue}s
 *@return an {Array} of {Glue}s
 **/
Glue.cloneArray = function(v){
    var newGlues = [];
    for(var i=0; i< v.length; i++){
        newGlues.push(v[i].clone());
    }
    return newGlues;
}

Glue.prototype = {
    
    constructor : Glue,
    
    
    /**Clone current {Glue}
     **/
    clone: function(){
        return new Glue(this.id1, this.id2, this.automatic);
    },
    
    /**Compares to another Glue
     *@param {Glue} anotherGlue -  - the other glue
     *@return {Boolean} - true if equals, false otherwise
     **/
    equals:function(anotherGlue){
        if(!anotherGlue instanceof Glue){
            return false;
        }

        return this.id1 == anotherGlue.id1
        && this.id2 == anotherGlue.id2
        && this.automatic == anotherGlue.automatic
        && this.type1 == anotherGlue.type1
        && this.type2 == anotherGlue.type2;
    },

    /**String representation of the Glue
     *@return {String} - the representation
     **/
    toString:function(){
        return 'Glue : (id1 = ' + this.id1
            + ', id2 = ' + this.id2
            + ', type1 = ' + this.type1
            + ', type2 = ' + this.type2
            + ', automatic = ' + this.automatic
            + ')';
    }
}