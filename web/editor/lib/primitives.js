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

/*
 *
 * TODO: different methods for image patterns, either whole bg, with the figure as a mask, or shrunk to size
 * if shrunk to size, keep ratios?
 *  A small library of drawing primitives.
 *  All primitives should have the following methods implemented:
 *  Like a Shape interface:
 *  -paint:void
 *		As each primitive can be painted by itself, inside paint() we need to open a new path so
 *		the last style  (from last primitive in Figure) will not override previous
 *  -tranform(matrix):void
 *  -contains(x, y):boolean
 *  -equals(object):boolean
 *  -toString():String
 *  -clone():object  - this is a deep clone
 *  -getBounds():[number, number, number, number]
 *  -near(distance):boolean - This should be used to test if a click is close to a primitive/figure
 *  -getPoints():Array - returns an array of points, so that a figure can implement contains
 *  - toSVG():String - return the SVG representation (fragment) of the shape
 */

"use strict";




/**
  * Creates an instance of Point
  *
  *
  * @constructor
  * @this {Point}
  * @param {Number} x The x coordinate of point.
  * @param {Number} y The y coordinate of point.
  * @author Alex Gheorghiu <alex@scriptoid.com>
  * Note: Even if it is named Point this class should be named Dot as Dot is closer
  * then Point from math perspective.
  **/
function Point(x, y){
    /**The x coordinate of point*/
    this.x = x;
    
    /**The y coordinate of point*/
    this.y = y;
    
    /**The {@link Style} of the Point*/
    this.style = new Style();
    
    /**Serialization type*/
    this.oType = 'Point'; //object type used for JSON deserialization
}

/**Creates a {Point} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Point} a newly constructed Point
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Point.load = function(o){
    var newPoint = new Point(Number(o.x), Number(o.y));
    newPoint.style = Style.load(o.style);
    return newPoint;
}


/**Creates an array of points from an array of {JSONObject}s
 *@param {Array} v - the array of JSONObjects
 *@return an {Array} of {Point}s
 **/
Point.loadArray = function(v){
    var newPoints = [];
    for(var i=0; i< v.length; i++){
        newPoints.push(Point.load(v[i]));
    }
    return newPoints;
}


/**Clones an array of points
 *@param {Array} v - the array of {Point}s
 *@return an {Array} of {Point}s
 **/
Point.cloneArray = function(v){
    var newPoints = [];
    for(var i=0; i< v.length; i++){
        newPoints.push(v[i].clone());
    }
    return newPoints;
}

Point.prototype = {
    constructor : Point,
    
    /*
     *Transform a point by a tranformation matrix. 
     *It is done by multiplication
     *Pay attention on the order of multiplication: The tranformation {Matrix} is
     *multiplied with the {Point} matrix.
     * P' = M x P
     *@param matrix is a 3x3 matrix
     *@see <a href="http://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations">http://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations</a>
     **/
    transform:function(matrix){
        if(this.style!=null){
            this.style.transform(matrix);
        }
        var oldX = this.x;
        var oldY = this.y;
        this.x = matrix[0][0] * oldX + matrix[0][1] * oldY + matrix[0][2];
        this.y = matrix[1][0] * oldX + matrix[1][1] * oldY + matrix[1][2];
    },

    /**Paint current {Point} withing a context
     *If you want to use a different style then the default one change the style
     **/
    paint:function(context){
        if(this.style != null){
            this.style.setupContext(context);
        }
        if(this.style.strokeStyle != ""){
            context.fillStyle = this.style.strokeStyle;
            context.beginPath();
            var width = 1;
            if(this.style.lineWidth != null){
                width = parseInt(this.style.lineWidth);
            }
            context.arc(this.x, this.y, width, 0,Math.PI/180*360,false);
            context.fill();
        }
    },


    /**Tests if this point is similar to other point
     *@param {Point} anotherPoint - the other point
     **/
    equals:function(anotherPoint){
        if(! (anotherPoint instanceof Point) ){
            return false;
        }
        return (this.x == anotherPoint.x)
        && (this.y == anotherPoint.y)
        && this.style.equals(anotherPoint.style);
    },

    /**Clone current Point
     **/
    clone: function(){
        var newPoint = new Point(this.x, this.y);
        newPoint.style = this.style.clone();
        return newPoint;
    },

    /**Tests to see if a point (x, y) is within a range of current Point
     *@param {Numeric} x - the x coordinate of tested point
     *@param {Numeric} y - the x coordinate of tested point
     *@param {Numeric} radius - the radius of the vicinity
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    near:function(x, y, radius){
        var distance = Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));

        return (distance <= radius);
    },

    contains: function(x,y){
        return this.x == x && this.y == y;
    },

    toString:function(){
        return 'point(' + this.x + ',' + this.y + ')';
    },

    getPoints:function(){
        return [this];
    },
    
    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },

    /**
     *We will draw a point a circle. The "visual" color and thicknes of the point will
     *be created by the SVG's element style
     *
     *@see <a href="http://tutorials.jenkov.com/svg/circle-element.html">http://tutorials.jenkov.com/svg/circle-element.html</a>
     *
     *Example:
     *<circle cx="40" cy="40" r="1" style="stroke:#006600; fill:#00cc00"/>
     **/
    toSVG: function(){
        var r = '';

        r += "\n" + repeat("\t", INDENTATION) + '<circle cx="' + this.x + '" cy="' + this.y + '" r="' + 1 + '"' ;
        r += this.style.toSVG();
        r += '/>';

        return r;
    }


};




/**
  * Creates an instance of a Line. A Line is actually a segment and not a pure
  * geometrical Line
  *
  * @constructor
  * @this {Line}
  * @param {Point} startPoint - starting point of the line
  * @param {Point} endPoint - the ending point of the line
  * @author Alex Gheorghiu <alex@scriptoid.com>
  **/
function Line(startPoint, endPoint){
    /**Starting {@link Point} of the line*/
    this.startPoint = startPoint;
    
    /**Ending {@link Point} of the line*/
    this.endPoint = endPoint;
    
    /**The {@link Style} of the line*/
    this.style = new Style();
    this.style.gradientBounds = this.getBounds();

    /**Serialization type*/
    this.oType = 'Line'; //object type used for JSON deserialization
}

/**Creates a {Line} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Line} a newly constructed Line
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Line.load = function(o){
    var newLine = new Line(
        Point.load(o.startPoint),
        Point.load(o.endPoint)
    );

    newLine.style = Style.load(o.style);
    return newLine;
}

Line.prototype = {
    contructor: Line,
    
    transform:function(matrix){
        this.startPoint.transform(matrix);
        this.endPoint.transform(matrix);
        if(this.style!=null){
            this.style.transform(matrix);
        }

    },

    paint:function(context){
		context.beginPath();
		
        if(this.style != null){
            this.style.setupContext(context);
        }
        context.moveTo(this.startPoint.x, this.startPoint.y);
        if(this.style.dashLength==0){
            context.lineTo(this.endPoint.x, this.endPoint.y);
            context.closePath(); // added for line's correct Chrome's displaying
        }
        else{

            //get the length of the line
            var lineLength=Math.sqrt(Math.pow(this.startPoint.x-this.endPoint.x,2)+Math.pow(this.startPoint.y-this.endPoint.y,2));

            //get the angle
            var angle = Util.getAngle(this.startPoint,this.endPoint);

            //draw a dotted line
            var move=false;
            for(var i=0; i<lineLength; i+=(this.style.dashLength)){
                var p = this.startPoint.clone();

                //translate to origin of start
                p.transform(Matrix.translationMatrix(-this.startPoint.x,-this.startPoint.y))

                //move it north by incremental dashlengths
                p.transform(Matrix.translationMatrix(0, -i));

                //rotate to correct location
                p.transform(Matrix.rotationMatrix(angle));

                //translate back
                p.transform(Matrix.translationMatrix(this.startPoint.x,this.startPoint.y))

                if (move==false){
                    context.lineTo(p.x, p.y);
                    move=true;
                }
                else{
                    context.moveTo(p.x, p.y);
                    move=false;
                }
            }
        }

        if(this.style.strokeStyle != null && this.style.strokeStyle != ""){
            context.stroke();
        }
    },

    clone:function(){
        var ret = new Line(this.startPoint.clone(), this.endPoint.clone());
        ret.style = this.style.clone();
        return ret;
    },

    equals:function(anotherLine){
        if(!anotherLine instanceof Line){
            return false;
        }
        return this.startPoint.equals(anotherLine.startPoint)
        && this.endPoint.equals(anotherLine.endPoint)
        && this.style.equals(anotherLine.style);
    },

    /** Tests to see if a point belongs to this line (not as infinite line but more like a segment)
     * Algorithm: Compute line's equation and see if (x, y) verifies it.
     * @param {Number} x - the X coordinates
     * @param {Number} y - the Y coordinates
     * @author Alex Gheorghiu <alex@scriptoid.com>
     **/
    contains: function(x, y){
        // if the point is inside rectangle bounds of the segment
        if (Math.min(this.startPoint.x, this.endPoint.x) <= x
            && x <= Math.max(this.startPoint.x, this.endPoint.x)
            && Math.min(this.startPoint.y, this.endPoint.y) <= y
            && y <= Math.max(this.startPoint.y, this.endPoint.y)) {

            // check for vertical line
            if (this.startPoint.x == this.endPoint.x) {
                return x == this.startPoint.x;
            } else { // usual (not vertical) line can be represented as y = a * x + b
                var a = (this.endPoint.y - this.startPoint.y) / (this.endPoint.x - this.startPoint.x);
                var b = this.startPoint.y - a * this.startPoint.x;
                return y == a * x + b;
            }
        } else {
            return false;
        }
    },

    /*
     *See if we are near a {Line} by a certain radius (also includes the extremities into computation)
     *@param {Number} x - the x coordinates
     *@param {Number} y - the y coordinates
     *@param {Number} radius - the radius to search for
     *@see http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
     *@see "Mathematics for Computer Graphics, 2nd Ed., by John Vice, page 227"
     *@author Zack Newsham <zack_newsham@yahoo.co.uk>
     *@author Arty
     *@author Alex
     **/
    near:function(x,y,radius){
        
        if(this.endPoint.x === this.startPoint.x){ //Vertical line, so the vicinity area is a rectangle
            return ( (this.startPoint.y-radius<=y && this.endPoint.y+radius>=y) 
                    || (this.endPoint.y-radius<=y && this.startPoint.y+radius>=y))
            && x > this.startPoint.x - radius && x < this.startPoint.x + radius ;
        }
        
        if(this.startPoint.y === this.endPoint.y){ //Horizontal line, so the vicinity area is a rectangle
            return ( (this.startPoint.x - radius<=x && this.endPoint.x+radius>=x) 
                    || (this.endPoint.x-radius<=x && this.startPoint.x+radius>=x))
                    && y>this.startPoint.y-radius && y<this.startPoint.y+radius ;
        }


        var startX = Math.min(this.endPoint.x,this.startPoint.x);
        var startY = Math.min(this.endPoint.y,this.startPoint.y);
        var endX = Math.max(this.endPoint.x,this.startPoint.x);
        var endY = Math.max(this.endPoint.y,this.startPoint.y);
        
        /*We will compute the distance from point to the line
         * by using the algorithm from 
         * http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
         * */

        //First we need to find a,b,c of the line equation ax + by + c = 0
        var a = this.endPoint.y - this.startPoint.y;
        var b = this.startPoint.x - this.endPoint.x;        
        var c = -(this.startPoint.x * this.endPoint.y - this.endPoint.x * this.startPoint.y);

        //Secondly we get the distance "Mathematics for Computer Graphics, 2nd Ed., by John Vice, page 227"
        var d = Math.abs( (a*x + b*y + c) / Math.sqrt(Math.pow(a,2) + Math.pow(b,2)) );

        //Thirdly we get coordinates of closest line's point to target point
        //http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Cartesian_coordinates
        var closestX = (b * (b*x - a*y) - a*c) / ( Math.pow(a,2) + Math.pow(b,2) );
        var closestY = (a * (-b*x + a*y) - b*c) / ( Math.pow(a,2) + Math.pow(b,2) );

        var r = ( d <= radius && endX>=closestX && closestX>=startX && endY>=closestY && closestY>=startY ) //the projection of the point falls INSIDE of the segment
            || this.startPoint.near(x,y,radius) || this.endPoint.near(x,y,radius); //the projection of the point falls OUTSIDE of the segment 

        return  r;

    },

    /**we need to create a new array each time, or we will affect the actual shape*/
    getPoints:function(){
        var points = [];
        points.push(this.startPoint);
        points.push(this.endPoint);
        return points;
    },
    
    /**Return the {Point} corresponding the t certain t value
     * @param {Number} t the value of parameter t, where t in [0,1], t is like a percent*/
    getPoint: function(t){
        var Xp = t * (this.endPoint.x - this.startPoint.x) + this.startPoint.x;
        var Yp = t * (this.endPoint.y - this.startPoint.y) + this.startPoint.y;
        
        return new Point(Xp, Yp);
    },    
    
    /**
     * Returns the middle of the line
     * @return {Point} the middle point
     * */
    getMiddle : function(){
        return Util.getMiddle(this.startPoint, this.endPoint);
    },
    
    
    getLength : function(){
        return Util.getLength(this.startPoint, this.endPoint);
    },

    /**
     *Get bounds for this line
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },

    /**String representation*/
    toString:function(){
        return 'line(' + this.startPoint + ',' + this.endPoint + ')';
    },

    /**Render the SVG fragment for this primitive*/
    toSVG:function(){
        //<line x1="0" y1="0" x2="300" y2="300" style="stroke:rgb(99,99,99);stroke-width:2"/>
        var result = "\n" + repeat("\t", INDENTATION) + '<line x1="' + this.startPoint.x + '" y1="' + this.startPoint.y + '" x2="' + this.endPoint.x  + '" y2="' + this.endPoint.y + '"';
        result += this.style.toSVG();
        result += " />"
        return  result;
    }
}



/**
  * Creates an instance of a Polyline
  *
  * @constructor
  * @this {Polyline}
  * @author Alex Gheorghiu <alex@scriptoid.com>
  **/
function Polyline(){
    /**An {Array} of {@link Point}s*/
    this.points = [];
    
    /**The {@link Style} of the polyline*/
    this.style = new Style();
    this.style.gradientBounds = this.getBounds();

    /**The starting {@link Point}. 
     * Required for path, we could use getPoints(), but this existed first.
     * Also its a lot simpler. Each other element used in path already has a startPoint
     * //TODO: (added by alex) This is bullshit....we need to remove this kind of junky code
     **/
    this.startPoint = null;
    
    /**Serialization type*/
    this.oType = 'Polyline'; //object type used for JSON deserialization
}

/**Creates a {Polyline} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Polyline} a newly constructed Polyline
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Polyline.load = function(o){
    var newPolyline = new Polyline();
    newPolyline.points = Point.loadArray(o.points);
    newPolyline.style = Style.load(o.style);
    newPolyline.startPoint = Point.load(o.startPoint);
    return newPolyline;
};

Polyline.prototype = {
    constructor : Polyline,
    
    addPoint:function(point){
        if(this.points.length==0){
            this.startPoint=point;
        }
        this.points.push(point);

        // update bound coordinates for gradient
        this.style.gradientBounds = this.getBounds();
    },
    
    transform:function(matrix){
        if(this.style!=null){
            this.style.transform(matrix);
        }
        for(var i=0; i<this.points.length; i++){
            this.points[i].transform(matrix);
        }
    },
	
    getPoints:function(){
        return Point.cloneArray(this.points);
    },
    
    /**Return the {Point} corresponding the t certain t value. 
     * NOTE: t is the visual percentage of a point from the start of the 
     * primitive and the result is
     * different than the t from getPoint(...) method
     * @param {Number} t the value of parameter t, where t in [0,1]*/
    getVisualPoint:function (t){
        var l = this.getLength();

        
        var walked = 0;
        var i;
        for(i=0; i< this.points.length-1; i++){
            if( walked + Util.distance(this.points[i], this.points[i+1]) > l * t ){
                break;
            }
            
            walked += Util.distance(this.points[i], this.points[i+1]);
        }
        
        var rest = l * t - walked;
        var currentSegmentLength = Util.distance(this.points[i], this.points[i+1]);
        
        //find the position/ration of the middle of Polyline on current segment
        var segmentPercent = rest / currentSegmentLength;
        var THEpoint = new Line(this.points[i], this.points[i+1]).getPoint(segmentPercent);
        
        return THEpoint;
    },

    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },

    clone:function(){
        var ret=new Polyline();
        for(var i=0; i<this.points.length; i++){
            ret.addPoint(this.points[i].clone());
        }
        ret.style=this.style.clone();
        return ret;
    },
    
    /**Return the length of the polyline
     * by summing up all the length of all
     * segments*/
    getLength : function(){
        var l = 0;
        for(var i=0; i< this.points.length-1; i++){
            l += Util.distance(this.points[i], this.points[i+1]);
        }
        
        return l;
    },
    

    equals:function(anotherPolyline){
        if(!anotherPolyline instanceof Polyline){
            return false;
        }
        if(anotherPolyline.points.length == this.points.length){
            for(var i=0; i<this.points.length; i++){
                if(!this.points[i].equals(anotherPolyline.points[i])){
                    return false;
                }
            }
        }
        else{
            return false;
        }

        if(!this.style.equals(anotherPolyline.style)){
            return false;
        }

        if(!this.startPoint.equals(anotherPolyline.startPoint)){
            return false;
        }



        return true;
    },
    
    
    paint:function(context){
        if(this.style != null){
            this.style.setupContext(context);
        }
        
        Log.info("Polyline:paint() start");
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        for(var i=1; i<this.points.length; i++){
            context.lineTo(this.points[i].x, this.points[i].y);
            //Log.info("Polyline:paint()" + " Paint a line to [" + this.points[i].x + ',' + this.points[i].y  + ']');
        }
               
        
        if(this.style.fillStyle!=null && this.style.fillStyle!=""){
            context.fill();
            //Log.info("Polyline:paint() We have fill: " + this.style.fillStyle)
        }
        
        if(this.style.strokeStyle !=null && this.style.strokeStyle != ""){
            //Log.info("Polyline:paint() We have stroke: " + this.style.strokeStyle)
            context.strokeStyle = this.style.strokeStyle;
            context.stroke();
        }
    },


    contains:function(x, y){
        return Util.isPointInside(new Point(x, y), this.getPoints())
    },


    near:function(x, y, radius){
        for(var i=0; i< this.points.length-1; i++){
            var l = new Line(this.points[i], this.points[i+1]);
            
            if(l.near(x,y,radius)){
                return true;
            }
        }
        
        return false;
    },

    toString:function(){
        var result = 'polyline(';
        for(var i=0; i < this.points.length; i++){
            result += this.points[i].toString() + ' ';
        }
        result += ')';
        return result;
    },

    /**Render the SVG fragment for this primitive*/
    toSVG:function(){
        //<polyline points="0,0 0,20 20,20 20,40 40,40 40,60" style="fill:white;stroke:red;stroke-width:2"/>
        var result = "\n" + repeat("\t", INDENTATION) + '<polyline points="';
        for(var i=0; i < this.points.length; i++){
            result += this.points[i].x + ',' + this.points[i].y + ' ';
        }
        result += '"';
        result += this.style.toSVG();
        result += '/>';

        return result;
    }
}


/**
  * Creates an instance of a Polygon
  *
  * @constructor
  * @this {Polygon}
  * @author Alex Gheorghiu <alex@scriptoid.com>
  **/
function Polygon(){
    /**An {Array} of {@link Point}s*/
    this.points = [];
    
    /**The {@link Style} of the polygon*/
    this.style = new Style();
    this.style.gradientBounds = this.getBounds();

    /**Serialization type*/
    this.oType = 'Polygon'; //object type used for JSON deserialization
}

/**Creates a {Polygon} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Polygon} a newly constructed Polygon
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Polygon.load = function(o){
    var newPolygon = new Polygon();
    newPolygon.points = Point.loadArray(o.points);
    newPolygon.style = Style.load(o.style);
    return newPolygon;
}


Polygon.prototype = {
    contructor : Polygon,
    
    addPoint:function(point){
        this.points.push(point);

        // update bound coordinates for gradient
        this.style.gradientBounds = this.getBounds();
    },


    getPosition:function(){
        return [this.points[0].x,[this.points[0].y]];
    },


    paint:function(context){
        context.beginPath();
        if(this.style!=null){
            this.style.setupContext(context);
        }
        if(this.points.length > 1){
            context.moveTo(this.points[0].x, this.points[0].y);
            for(var i=1; i<this.points.length; i++){
                context.lineTo(this.points[i].x, this.points[i].y)
            }
        }
        context.closePath();

        //fill current path
        if(this.style.fillStyle != null && this.style.fillStyle != ""){
            context.fill();
        }

        //stroke current path 
        if(this.style.strokeStyle != null && this.style.strokeStyle != ""){
            context.stroke();
        }
    },


    getPoints:function(){
        var p = [];
        for (var i=0; i<this.points.length; i++){
            p.push(this.points[i]);
        }
        return p;
    },


    /**
     *@return {Array<Number>} - returns [minX, minY, maxX, maxY] - bounds, where
     *  all points are in the bounds.*/
    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },

    fill:function(context,color){
        context.fillStyle=color;
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        for(var i=1; i<this.points.length; i++){
            context.lineTo(this.points[i].x, this.points[i].y);
        }
        context.lineTo(this.points[0].x, this.points[0].y);
        context.closePath();
        context.fill();
    },

    near:function(x,y,radius){
        var i=0;
        for(i=0; i< this.points.length-1; i++){
            var l = new Line(this.points[i], this.points[i+1]);
            if(l.near(x,y,radius)){
                return true;
            }
        }
        l=new Line(this.points[i], this.points[0]);
        if(l.near(x,y,radius)){
            return true;
        }
        return false;
    },
	
	
    equals:function(anotherPolygon){
        if(!anotherPolygon instanceof Polygon){
            return false;
        }
        if(anotherPolygon.points.length == this.points.length){
            for(var i=0; i<this.points.length; i++){
                if(!this.points[i].equals(anotherPolygon.points[i])){
                    return false;
                }
            }
        }
        //TODO: test for all Polygon members
        return true;
    },

    clone:function(){
        var ret=new Polygon();
        for(var i=0; i<this.points.length; i++){
            ret.addPoint(this.points[i].clone());
        }
        ret.style = this.style.clone();
        
        return ret;
    },

    contains:function(x, y, includeBorders){
        var inPath = false;
        var p = new Point(x,y);
        if(!p){
            alert('Polygon: P is null');
        }

        if (includeBorders) {
            return Util.isPointInsideOrOnBorder(p, this.points);
        } else {
            return Util.isPointInside(p, this.points);
        }
    },

    transform:function(matrix){
        if(this.style!=null){
            this.style.transform(matrix);
        }
        for(var i=0; i < this.points.length; i++){
            this.points[i].transform(matrix);
        }
    },

    toString:function(){
        var result = 'polygon(';
        for(var i=0; i < this.points.length; i++){
            result += this.points[i].toString() + ' ';
        }
        result += ')';
        return result;
    },

    /**Render the SVG fragment for this primitive*/
    toSVG:function(){
        //<polygon points="220,100 300,210 170,250" style="fill:#cccccc; stroke:#000000;stroke-width:1"/>
        var result = "\n" + repeat("\t", INDENTATION) + '<polygon points="';
        for(var i=0; i < this.points.length; i++){
            result += this.points[i].x + ',' + this.points[i].y + ' ';
        }
        result += '" '
        //+  'style="fill:#cccccc;stroke:#000000;stroke-width:1"'
        +  this.style.toSVG()
        +  ' />';
        return result;
    }
}


/**
  * Creates an instance of a DottedPolygon.
  * DottedPolygon is a poligon with all edges dotted or with a certain pattern.
  * As for now (Summer 2012) context does not support lines with a pattern
  * this had to be created
  *
  * @constructor
  * @this {DottedPolygon}
  * @param {Array} pattern - an array of dots and spaces Ex: [10,2,2 4,7] means 10 dotts, 2 spaces, 2 dots and 7 spaces.
  * @author Alex Gheorghiu <alex@scriptoid.com>
  **/
function DottedPolygon(pattern){
    /**An {Array} of {@link Point}s*/
    this.points = [];
    
    /**The {@link Style} of the polygon*/
    this.style = new Style();
    this.style.gradientBounds = this.getBounds();

    /**An {Array} of {Integer}s*/
    this.pattern = pattern;
    
    /**Serialization type*/
    this.oType = 'DottedPolygon'; //object type used for JSON deserialization
}




/**Creates a {Polygon} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Polygon} a newly constructed Polygon
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
DottedPolygon.load = function(o){
    var newPolygon = new DottedPolygon(o.pattern);
    newPolygon.points = Point.loadArray(o.points);
    newPolygon.style = Style.load(o.style);
    return newPolygon;
}


DottedPolygon.prototype = {
    contructor : DottedPolygon,
    
    addPoint:function(point){
        this.points.push(point);
    },


    getPosition:function(){
        return [this.points[0].x,[this.points[0].y]];
    },


    paint:function(context){
				
        if(this.style != null){
            this.style.setupContext(context);
        }

        //simply ignore anything that don't have at least 2 points
        if(this.points.length < 2){
            return;
        }

        var clonnedPoints = Point.cloneArray(this.points);		

        //first fill
        if(this.style.fillStyle != null && this.style.fillStyle != ""){			
            context.beginPath();
            context.moveTo(clonnedPoints[0].x, clonnedPoints[0].y);
            for(i=1;i<clonnedPoints.length; i++){
                    context.lineTo(clonnedPoints[i].x, clonnedPoints[i].y);
            }
            context.fill();
        }

        //then stroke
        if(this.style.strokeStyle != null && this.style.strokeStyle != ""){	
            context.beginPath(); //begin a new path
            Util.decorate(context, clonnedPoints, this.pattern);
            context.stroke();
        }

        //context.restore();
    },


    getPoints:function(){
		var p = [];
        for (var i=0; i<this.points.length; i++){
            p.push(this.points[i]);
        }
        return p;
    },


    /**
     *@return {Array<Number>} - returns [minX, minY, maxX, maxY] - bounds, where
     *  all points are in the bounds.*/
    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },


    near:function(x,y,radius){
        var i=0;
        for(i=0; i< this.points.length-1; i++){
            var l=new Line(this.points[i], this.points[i+1]);
            if(l.near(x,y,radius)){
                return true;
            }
        }
        l = new Line(this.points[i], this.points[0]);
        if(l.near(x,y,radius)){
            return true;
        }
        return false;
    },
	
	
    equals:function(anotherPolygon){
        if(!anotherPolygon instanceof DottedPolygon){
            return false;
        }
        if(anotherPolygon.points.length == this.points.length){
            for(var i=0; i<this.points.length; i++){
                if(!this.points[i].equals(anotherPolygon.points[i])){
                    return false;
                }
            }
        }
        //TODO: test for all DottedPolygon's pattern
        return true;
    },


    clone:function(){
        var ret = new DottedPolygon();
        for(var i=0; i<this.points.length; i++){
            ret.addPoint(this.points[i].clone());
        }
        ret.style=this.style.clone();
        return ret;
    },


    contains:function(x, y){
        var inPath = false;
        var p = new Point(x,y);
        if(!p){
            alert('DottedPolygon: P is null');
        }
        
        return Util.isPointInside(p, this.points);
    },

    transform:function(matrix){
        if(this.style != null){
                this.style.transform(matrix);
        }
        for(var i=0; i < this.points.length; i++){
                this.points[i].transform(matrix);
        }
    },

    toString:function(){
        var result = 'dottedpolygon(';
        for(var i=0; i < this.points.length; i++){
                result += this.points[i].toString() + ' ';
        }
        result += ')';
        return result;
    },

    /**Render the SVG fragment for this primitive*/
    toSVG:function(){        
        var result = "\n" + repeat("\t", INDENTATION) + '<text x="20" y="40">DottedPolygon:toSVG() - no implemented</text>';
        
        return result;
    }
}


/**
  * Creates an instance of a quad curve.
  * A curved line determined by 2 normal points (startPoint and endPoint) and 1 control point (controlPoint)
  *
  * @constructor
  * @this {QuadCurve}
  * @param {Point} startPoint - starting point of the line
  * @param {Point} controlPoint - the control point of the line
  * @param {Point} endPoint - the ending point of the line
  * @see <a href="http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves">http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves</a>
 **/
function QuadCurve(startPoint, controlPoint, endPoint){
    /**The start {@link Point}*/
    this.startPoint = startPoint;
    
    /**The controll {@link Point}*/
    this.controlPoint = controlPoint;
    
    /**The end {@link Point}*/
    this.endPoint = endPoint;
    
    /**The {@link Style} of the quad*/
    this.style = new Style();
    this.style.gradientBounds = this.getBounds();

    /**Serialization type*/
    this.oType = 'QuadCurve'; //object type used for JSON deserialization
}

/**Creates a {QuadCurve} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {QuadCurve} a newly constructed QuadCurve
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
QuadCurve.load = function(o){
    var newQuad = new QuadCurve(
        Point.load(o.startPoint),
        Point.load(o.controlPoint),
        Point.load(o.endPoint)
    );

    newQuad.style = Style.load(o.style);
    return newQuad;
};

/**Creates an {Array} of {QuadCurve} out of JSON parsed object
 *@param {JSONObject} v - the JSON parsed object (actually an {Array} of {JSONObject}s
 *@return {Array} of {QuadCurve}s
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
QuadCurve.loadArray = function(v){
    var quads = [];

    for(var i=0; i<v.length; i++){
        quads.push(QuadCurve.load(v[i]));
    }

    return quads;
};

QuadCurve.prototype = {
    constructor : QuadCurve,
    
    transform:function(matrix){
        if(this.style!=null){
            this.style.transform(matrix);
        }
        this.startPoint.transform(matrix);
        this.controlPoint.transform(matrix);
        this.endPoint.transform(matrix);
    },


    //TODO: dynamically adjust until the length of a segment is small enough
    //(1 unit)?
    getPoints:function(){
        var STEP = 0.01;
        var points = [];
        for(var t = 0; t<=1; t+=STEP){
            points.push(this.getPoint(t));
        }
        
        return points;
    },
    
    /**
     * Return the point corresponding to parameter value t
     * @param {Number} t the value of t parameter, t in [0,1]
     * @return {Point} the value of t parameter, t in [0,1]
     * @see http://html5tutorial.com/how-to-join-two-bezier-curves-with-the-canvas-api/
     * */
    getPoint:function(t){
        var a = Math.pow((1 - t), 2);            
        var b = 2 * (1 - t) * t;
        var c = Math.pow(t, 2);
        var Xp = a * this.startPoint.x + b * this.controlPoint.x + c * this.endPoint.x;
        var Yp = a * this.startPoint.y + b * this.controlPoint.y + c * this.endPoint.y;
        
        return new Point(Xp, Yp);
    },
    
    /**Return the {Point} corresponding the t certain t value. 
     * NOTE: t is the visual percentage of a point from the start of the 
     * primitive and the result is
     * different than the t from getPoint(...) method
     * @param {Number} t the value of parameter t, where t in [0,1]*/
    getVisualPoint:function (t){
        var points = this.getPoints();
        var polyline = new Polyline();
        polyline.points = points;
        
        return polyline.getVisualPoint(t);
    },    
    
    
    
    /**Computes the length of the Cubic Curve
     * TODO: This is by far not the best algorithm but only an aproximation.
     * */
    getLength:function(){
        /*Algorithm: split the Bezier curve into an aproximative 
       polyline and use polyline's near method*/
        var poly = new Polyline();
        
        for(var t=0; t<=1; t+=0.01){
            poly.addPoint(this.getPoint(t));
        }
       
       return poly.getLength();
    },


    /*We could use an interpolation algorightm t=0,1 and pick 10 points to iterate on ...but for now it's fine
     **/
    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },


    paint:function(context){
        context.beginPath();
		
        if(this.style!=null){
            this.style.setupContext(context);
        }
        
        context.moveTo(this.startPoint.x, this.startPoint.y);
        context.quadraticCurveTo(this.controlPoint.x, this.controlPoint.y, this.endPoint.x, this.endPoint.y);

        //first fill
        if(this.style.fillStyle!=null && this.style.fillStyle!=""){
            context.fill();
        }

        //then stroke
        if(this.style.strokeStyle!=null && this.style.strokeStyle!=""){
            context.stroke();
        }
        
        
        if(false){ //structure polyline
            var polyline = new Polyline();
            polyline.style.strokeStyle = '#ccc';
            polyline.points = this.getPoints();
            polyline.paint(context);
            context.stroke();
            
            context.fillStyle = "#F00";
            context.fillRect(this.startPoint.x-2, this.startPoint.y-2, 4, 4);
            context.fillRect(this.controlPoint.x-2, this.controlPoint.y-2, 4, 4);
            context.fillRect(this.endPoint.x-2, this.endPoint.y-2, 4, 4);
        }
    },

    /*
     *TODO: algorithm not clear and maybe we can find the math formula to determine if we have an intersection
     *@see <a href="http://rosettacode.org/wiki/Bitmap/B%C3%A9zier_curves/Quadratic">http://rosettacode.org/wiki/Bitmap/B%C3%A9zier_curves/Quadratic</a>
     */
    deprecated__near:function(x, y, radius){
        var polls=100;
        if(!Util.isPointInside(new Point(x,y), [this.startPoint, this.controlPoint, this.endPoint]) 
                && !this.startPoint.near(x,y,radius) && ! this.endPoint.near(x,y,radius)){
            return false;//not inside the control points, so can't be near the line
        }
        var low=0;
        var high=polls;
        var i=(high-low)/2;
        while(i >= low && i <= high && high-low>0.01){//high-low indicates>0.01 stops us from taking increasingly tiny steps
            i=low+(high-low)/2 //we want the mid point

            //don't fully understand this
            var t = i / polls;
            var fromEnd = Math.pow((1.0 - t), 2); //get how far from end we are and square it
            var a = 2.0 * t * (1.0 - t);
            var fromStart = Math.pow(t, 2); //get how far from start we are and square it
            var newX = fromEnd * this.startPoint.x + a * this.controlPoint.x + this.fromStart * this.endPoint.x;//?
            var newY = fromEnd * this.startPoint.y + a * this.controlPoint.y + this.fromStart * this.endPoint.y;//?
            var p = new Point(newX,newY);
            if(p.near(x, y, radius)){
                return true;
            }

            //get distance between start and the point we are looking for, and the current point on line
            var pToStart=Math.sqrt(Math.pow(this.startPoint.x-p.x,2)+Math.pow(this.startPoint.y-p.y,2));
            var myToStart=Math.sqrt(Math.pow(this.startPoint.x-x,2)+Math.pow(this.startPoint.y-y,2));

            //if our point is closer to start, we know that our cursor must be between start and where we are
            if(myToStart<pToStart){
                high=i;
            }
            else if(myToStart!=pToStart){
                low=i;
            }
            else{
                return false;//their distance is the same but the point is not near, return false.
            }
            return this.startPoint.near(x,y,radius)|| this.endPoint.near(x,y,radius);
            }
    },
    
    near:function(x, y, radius){
        var points = this.getPoints();
        var polyline = new Polyline();
        polyline.points = points;
        return polyline.near(x, y, radius);
    },

    clone:function(){
        var ret=new QuadCurve(this.startPoint.clone(),this.controlPoint.clone(),this.endPoint.clone());
        ret.style=this.style.clone();
        return ret;
    },

    equals:function(anotherQuadCurve){
        if(!anotherQuadCurve instanceof QuadCurve){
            return false;
        }

        return this.startPoint.equals(anotherQuadCurve.startPoint)
        && this.controlPoint.equals(anotherQuadCurve.controlPoint)
        && this.endPoint.equals(anotherQuadCurve.endPoint)
        && this.style.equals(anotherQuadCurve.style);
    },

    /**
     *@deprecated
     **/
    deprecated_contains:function(x, y){
        return this.near(x,y,3);
        points=[this.startPoint,this.controlPoint,this.endPoint];
        return Util.isPointInside(new Point(x,y),points);
    },

    /**
     * @see sources for <a href="http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/6-b14/java/awt/geom/QuadCurve2D.java">java.awt.geom.QuadCurve2D</a>
     * @author (just converted to JavaScript) alex@scriptoid.com
     */
    deprecated_2_contains:function(x,y) {

        var x1 = this.startPoint.x;
        var y1 = this.startPoint.y;
        var xc = this.controlPoint.x;
        var yc = this.controlPoint.y;
        var x2 = this.endPoint.x;
        var y2 = this.endPoint.y;

        /*
	 * We have a convex shape bounded by quad curve Pc(t)
	 * and ine Pl(t).
	 *
	 *     P1 = (x1, y1) - start point of curve
	 *     P2 = (x2, y2) - end point of curve
	 *     Pc = (xc, yc) - control point
	 *
	 *     Pq(t) = P1*(1 - t)^2 + 2*Pc*t*(1 - t) + P2*t^2 =
	 *           = (P1 - 2*Pc + P2)*t^2 + 2*(Pc - P1)*t + P1
	 *     Pl(t) = P1*(1 - t) + P2*t
	 *     t = [0:1]
	 *
	 *     P = (x, y) - point of interest
	 *
	 * Let's look at second derivative of quad curve equation:
	 *
	 *     Pq''(t) = 2 * (P1 - 2 * Pc + P2) = Pq''
	 *     It's constant vector.
	 *
	 * Let's draw a line through P to be parallel to this
	 * vector and find the intersection of the quad curve
	 * and the line.
	 *
	 * Pq(t) is point of intersection if system of equations
	 * below has the solution.
	 *
	 *     L(s) = P + Pq''*s == Pq(t)
	 *     Pq''*s + (P - Pq(t)) == 0
	 *
	 *     | xq''*s + (x - xq(t)) == 0
	 *     | yq''*s + (y - yq(t)) == 0
	 *
	 * This system has the solution if rank of its matrix equals to 1.
	 * That is, determinant of the matrix should be zero.
	 *
	 *     (y - yq(t))*xq'' == (x - xq(t))*yq''
	 *
	 * Let's solve this equation with 't' variable.
	 * Also let kx = x1 - 2*xc + x2
	 *          ky = y1 - 2*yc + y2
	 *
	 *     t0q = (1/2)*((x - x1)*ky - (y - y1)*kx) /
	 *                 ((xc - x1)*ky - (yc - y1)*kx)
	 *
	 * Let's do the same for our line Pl(t):
	 *
	 *     t0l = ((x - x1)*ky - (y - y1)*kx) /
	 *           ((x2 - x1)*ky - (y2 - y1)*kx)
	 *
	 * It's easy to check that t0q == t0l. This fact means
	 * we can compute t0 only one time.
	 *
	 * In case t0 < 0 or t0 > 1, we have an intersections outside
	 * of shape bounds. So, P is definitely out of shape.
	 *
	 * In case t0 is inside [0:1], we should calculate Pq(t0)
	 * and Pl(t0). We have three points for now, and all of them
	 * lie on one line. So, we just need to detect, is our point
	 * of interest between points of intersections or not.
	 *
	 * If the denominator in the t0q and t0l equations is
	 * zero, then the points must be collinear and so the
	 * curve is degenerate and encloses no area.  Thus the
	 * result is false.
	 */
        var kx = x1 - 2 * xc + x2;
        var ky = y1 - 2 * yc + y2;
        var dx = x - x1;
        var dy = y - y1;
        var dxl = x2 - x1;
        var dyl = y2 - y1;

        var t0 = (dx * ky - dy * kx) / (dxl * ky - dyl * kx);
        if (t0 < 0 || t0 > 1 || t0 != t0) {
            return false;
        }

        var xb = kx * t0 * t0 + 2 * (xc - x1) * t0 + x1;
        var yb = ky * t0 * t0 + 2 * (yc - y1) * t0 + y1;
        var xl = dxl * t0 + x1;
        var yl = dyl * t0 + y1;

        return (x >= xb && x < xl) ||
        (x >= xl && x < xb) ||
        (y >= yb && y < yl) ||
        (y >= yl && y < yb);
    },
    
    contains:function(x,y) {
        var points = this.getPoints();
        var polyline = new Polyline();
        polyline.points = points;
        return polyline.contains(x, y);
    },

    toString:function(){
        return 'quad(' + this.startPoint + ',' + this.controlPoint + ',' + this.endPoint + ')';
    },

    /**Render the SVG fragment for this primitive
     *@see <a href="http://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands">http://www.w3.org/TR/SVG/paths.html#PathDataQuadraticBezierCommands</a>
     **/
    toSVG:function(){
        //<path d="M200,300 Q400,50 600,300 T1000,300" fill="none" stroke="red" stroke-width="5"  />

        var result = "\n" + repeat("\t", INDENTATION) + '<path d="M';
        result += this.startPoint.x + ',' + this.endPoint.y;
        result += ' Q' + this.controlPoint.x + ',' + this.controlPoint.y;
        result += ' ' + this.endPoint.x + ',' + this.endPoint.y;

        result += '" '
        +  this.style.toSVG()
        +  ' />';

        return result;
    }
};


/**
  * Creates an instance of a cubic curve.
  * A curved line determined by 2 normal points (startPoint and endPoint) and 2 control points (controlPoint1, controlPoint2)
  *
  * @constructor
  * @this {CubicCurve}
  * @param {Point} startPoint - starting point of the line
  * @param {Point} controlPoint1 - 1st control point of the line
  * @param {Point} controlPoint2 - 2nd control point of the line
  * @param {Point} endPoint - the ending point of the line
  * @see <a href="http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B.C3.A9zier_curves">http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B.C3.A9zier_curves</a>
 **/
function CubicCurve(startPoint, controlPoint1, controlPoint2, endPoint){
    /**The start {@link Point}*/
    this.startPoint = startPoint;
    
    /**The first controll {@link Point}*/
    this.controlPoint1 = controlPoint1;
    
    /**The second controll {@link Point}*/
    this.controlPoint2 = controlPoint2;
    
    /**The end {@link Point}*/
    this.endPoint = endPoint;
    
    /**The {@link Style} of the quad*/
    this.style = new Style();
    this.style.gradientBounds = this.getBounds();

    /**Object type used for JSON deserialization*/
    this.oType = 'CubicCurve';
}

/**Creates a {CubicCurve} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {CubicCurve} a newly constructed CubicCurve
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
CubicCurve.load = function(o){
    var newCubic = new CubicCurve(
        Point.load(o.startPoint),
        Point.load(o.controlPoint1),
        Point.load(o.controlPoint2),
        Point.load(o.endPoint)
    );

    newCubic.style = Style.load(o.style);
    return newCubic;
}


CubicCurve.prototype = {
    constructor : CubicCurve,
    
    
    transform:function(matrix){
        if(this.style != null){
            this.style.transform(matrix);
        }
        this.startPoint.transform(matrix);
        this.controlPoint1.transform(matrix);
        this.controlPoint2.transform(matrix);
        this.endPoint.transform(matrix);
    },
    
    
    paint:function(context){
		context.beginPath();
		
//        Log.group("CubicCurve:paint() ");
        if(this.style != null){
            this.style.setupContext(context);
            Log.info("stroke style : " + this.style.strokeStyle);
        }
        
        context.beginPath();
        context.moveTo(this.startPoint.x, this.startPoint.y);
        context.bezierCurveTo(
            this.controlPoint1.x, this.controlPoint1.y, 
            this.controlPoint2.x, this.controlPoint2.y, 
            this.endPoint.x, this.endPoint.y
        );


        if(this.style.fillStyle != null && this.style.fillStyle != ""){
//            Log.info("Fill provided");
            context.fill();
        }
        else{
//            Log.info("Fill NOT provided")            
        }

        if(this.style.strokeStyle != null && this.style.strokeStyle != ""){
//            Log.info("Stroke provided");
            context.stroke();
        }
        else{
//            Log.info("Stroke NOT provided")
        }
        
        Log.groupEnd();
    },


    clone:function(){
        var ret = new CubicCurve(this.startPoint.clone(),this.controlPoint1.clone(), this.controlPoint2.clone(),this.endPoint.clone());
        ret.style = this.style.clone();
        return ret;
    },


    equals:function(anotherCubicCurve){
        if(!anotherCubicCurve instanceof CubicCurve){
            return false;
        }
        return this.startPoint.equals(anotherCubicCurve.startPoint)
        && this.controlPoint1.equals(anotherCubicCurve.controlPoint1)
        && this.controlPoint2.equals(anotherCubicCurve.controlPoint2)
        && this.endPoint.equals(anotherCubicCurve.endPoint);
    },

    /**
     * Inspired by java.awt.geom.CubicCurve2D
     * @author Alex
     */
    contains:function(x, y) {
        /*This piece of code is kept as a reference.
        The "old" idea was to treat the curve as a polygon
        thus closing it and apply a similar algorithm as for polygon.
        Of course it does not offer precision :(
        
//        if (!(x * 0.0 + y * 0.0 == 0.0)) {
//            Either x or y was infinite or NaN.
//             A NaN always produces a negative response to any test
//             and Infinity values cannot be "inside" any path so
//             they should return false as well.
//             
            return false;
        }
        // We count the "Y" crossings to determine if the point is
        // inside the curve bounded by its closing line.
        var x1 = this.startPoint.x //getX1();
        var y1 = this.startPoint.y //getY1();
        var x2 = this.endPoint.x //getX2();
        var y2 = this.endPoint.y //getY2();
        var crossings =
        (Util.pointCrossingsForLine(x, y, x1, y1, x2, y2) +
            Util.pointCrossingsForCubic(x, y,
                x1, y1,
                this.controlPoint1.x, this.controlPoint1.y,
                this.controlPoint2.x, this.controlPoint2.y,
                x2, y2, 0));
        return ((crossings & 1) == 1);
        */
        
        
        /*Algorithm: split the Bezier curve into an aproximative polyline and 
         * use {Polyline}'s contains(...) method
         * */
       var poly = new Polyline();
       for(var t=0; t<=1; t=t+0.01){ //101 points :D
           var a = Math.pow((1 - t), 3);            
            var b = 3 * t * Math.pow((1 - t), 2);
            var c = 3 * Math.pow(t, 2) * (1 - t);
            var d = Math.pow(t, 3);
            var Xp = a * this.startPoint.x + b * this.controlPoint1.x + c * this.controlPoint2.x + d * this.endPoint.x;
            var Yp = a * this.startPoint.y + b * this.controlPoint1.y + c * this.controlPoint2.y + d * this.endPoint.y;
            poly.addPoint(new Point(Xp, Yp));
       }
       //Log.info("CubicCurve: Aproximative polyline " + poly);
       
       return poly.contains(x, y);
    },


    /**
     *Tests to see if a point is close enough to a cubic curve
     *@param {Number} x - the x coordinates of the point
     *@param {Number} y - the x coordinates of the point
     *@param {Number} radius - the radius of vicinity
     *@author alex
     *@see <a href="http://rosettacode.org/wiki/Bitmap/B%C3%A9zier_curves/Cubic">http://rosettacode.org/wiki/Bitmap/B%C3%A9zier_curves/Cubic</a>
     */
    near:function(x, y, radius){        
       
       /*Algorithm: split the Bezier curve into an aproximative 
       polyline and use polyline's near method*/
        var poly = new Polyline();
        
        for(var t=0; t<=1; t+=0.01){
            var a = Math.pow((1 - t), 3);            
            var b = 3 * t * Math.pow((1 - t), 2);
            var c = 3 * Math.pow(t, 2) * (1 - t);
            var d = Math.pow(t, 3);
            var Xp = a * this.startPoint.x + b * this.controlPoint1.x + c * this.controlPoint2.x + d * this.endPoint.x;
            var Yp = a * this.startPoint.y + b * this.controlPoint1.y + c * this.controlPoint2.y + d * this.endPoint.y;
            poly.addPoint(new Point(Xp, Yp));
        }
       
       return poly.near(x, y, radius);
    },

    //TODO: dynamically adjust until the length of a segment is small enough
    //(1 unit)?
    getPoints:function(){
        var STEP = 0.01;
        var points = [];
        for(var t = 0; t<=1; t+=STEP){
            points.push(this.getPoint(t));
        }
        
        return points;
    },

    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },
    
    /**Computes the length of the Cubic Curve
     * TODO: This is by far not the best algorithm but only an aproximation.
     * */
    getLength:function(){
        /*Algorithm: split the Bezier curve into an aproximative 
       polyline and use polyline's near method*/
        var poly = new Polyline();
        
        poly.points = this.getPoints();      
       
       return poly.getLength();
    },
    
    /**Return the {Point} corresponding a t value, from parametric equation of Curve
     * @param {Number} t the value of parameter t, where t in [0,1]*/
    getPoint: function(t){
        var a = Math.pow((1 - t), 3);            
        var b = 3 * t * Math.pow((1 - t), 2);
        var c = 3 * Math.pow(t, 2) * (1 - t);
        var d = Math.pow(t, 3);
        var Xp = a * this.startPoint.x + b * this.controlPoint1.x + c * this.controlPoint2.x + d * this.endPoint.x;
        var Yp = a * this.startPoint.y + b * this.controlPoint1.y + c * this.controlPoint2.y + d * this.endPoint.y;
        
        return new Point(Xp, Yp);
    },
    
    /**Return the {Point} corresponding the t certain t value. 
     * NOTE: t is the visual percentage of a point from the start of the 
     * primitive and the result is
     * different than the t from getPoint(...) method
     * @param {Number} t the value of parameter t, where t in [0,1]*/
    getVisualPoint:function (t){
        var points = this.getPoints();
        var polyline = new Polyline();
        polyline.points = points;
        
        return polyline.getVisualPoint(t);
    },
    


    toString:function(){
        return 'quad(' + this.startPoint + ',' + this.controlPoint1 + ',' + this.controlPoint2 + ',' + this.endPoint + ')';
    },

    /**Render the SVG fragment for this primitive
     *@see <a href="http://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands">http://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands</a>
     **/
    toSVG:function(){
        //<path d="M100,200 C100,100 250,100 250,200" />


        var result = "\n" + repeat("\t", INDENTATION) +  '<path d="M';
        result += this.startPoint.x + ',' + this.endPoint.y;
        result += ' C' + this.controlPoint1.x + ',' + this.controlPoint1.y;
        result += ' ' + this.controlPoint2.x + ',' + this.controlPoint2.y;
        result += ' ' + this.endPoint.x + ',' + this.endPoint.y;

        result += '" ' + this.style.toSVG() +  '  />';
        return result;
    }
}


/**
 * Draws an arc.
 * To allow easy transformations of the arc we will simulate the arc by a series of curves
 *
 * @constructor
 * @this {Arc}
 * @param {Number} x - the X coordinates of the "imaginary" circle of which the arc is part of
 * @param {Number} y - the Y coordinates of the "imaginary" circle of which the arc is part of
 * @param {Number} radius - the radius of the arc
 * @param {Number} startAngle - the degrees (not radians as in Canvas'specs) of the starting angle for this arc
 * @param {Number} endAngle - the degrees (not radians as in Canvas'specs) of the starting angle for this arc
 * @param {Number} direction - the direction of drawing. For now it's from startAngle to endAngle (anticlockwise). Not really used
 * @param {Number} styleFlag (optional) -
 * 1: close path between start of arc and end,
 * 2: draw pie slice, line to center point, line to start point
 * default: empty/0/anything else: just draw the arc
 * TODO: make it a class constant
 * @see <a href="http://STACKoverflow.com/questions/2688808/drawing-quadratic-bezier-circles-with-a-given-radius-how-to-determine-control-po">http://STACKoverflow.com/questions/2688808/drawing-quadratic-bezier-circles-with-a-given-radius-how-to-determine-control-po</a>
 **/

function Arc(x, y, radius, startAngle, endAngle, direction, styleFlag){
    /**End angle. Required for dashedArc*/
    this.endAngle = endAngle;
    
    /**Start angle. required for dashedArc*/
    this.startAngle = startAngle;
    
    /**The center {@link Point} of the circle*/
    this.middle = new Point(x,y); 
    
    /**The radius of the circle*/
    this.radius = radius;
    
    /**An {Array} of {@link QuadCurve}s used to draw the arc*/
    this.curves = [];
    
    /**Accuracy. It tells the story of how many QuadCurves we will use*/
    var numControlPoints = 8;
    
    /**The start {@link Point}*/
    this.startPoint = null;
    
    /**The end {@link Point}*/
    this.endPoint = null;
    
    /**The start angle, in radians*/
    this.startAngleRadians = 0;
    
    /**The end angle, in radians*/
    this.endAngleRadians = 0;

    //code shamelessly stollen from the above site.
    var start = Math.PI/180 * startAngle; //convert the angles back to radians
    this.startAngleRadians = start;
    this.endAngleRadians = Math.PI/180 * endAngle;
    var arcLength = (Math.PI/180*(endAngle-startAngle))/ numControlPoints;
    for (var i = 0; i < numControlPoints; i++) {
        if (i < 1)
        {
            this.startPoint = new Point(x + radius * Math.cos(arcLength * i),y + radius * Math.sin(arcLength * i))
        }
        var startPoint=new Point(x + radius * Math.cos(arcLength * i),y + radius * Math.sin(arcLength * i))

        //control radius formula
        //where does it come from, why does it work?
        var controlRadius = radius / Math.cos(arcLength * .5);

        //the control point is plotted halfway between the arcLength and uses the control radius
        var controlPoint=new Point(x + controlRadius * Math.cos(arcLength * (i + 1) - arcLength * .5),y + controlRadius * Math.sin(arcLength * (i + 1) - arcLength * .5))
        if (i == (numControlPoints - 1))
        {
            this.endPoint = new Point(x + radius * Math.cos(arcLength * (i + 1)),y + radius * Math.sin(arcLength * (i + 1)));
        }
        var endPoint=new Point(x + radius * Math.cos(arcLength * (i + 1)),y + radius * Math.sin(arcLength * (i + 1)));


        //if we arent starting at 0, rotate it to where it needs to be

        //move to origin (O)
        startPoint.transform(Matrix.translationMatrix(-x,-y));
        controlPoint.transform(Matrix.translationMatrix(-x,-y));
        endPoint.transform(Matrix.translationMatrix(-x,-y));

        //rotate by angle (start)
        startPoint.transform(Matrix.rotationMatrix(start));
        controlPoint.transform(Matrix.rotationMatrix(start));
        endPoint.transform(Matrix.rotationMatrix(start));

        //move it back to where it was
        startPoint.transform(Matrix.translationMatrix(x,y));
        controlPoint.transform(Matrix.translationMatrix(x,y));
        endPoint.transform(Matrix.translationMatrix(x,y));

        this.curves.push(new QuadCurve(startPoint,controlPoint,endPoint));
    }

    /**The style flag - see  contructor's arguments*/
    this.styleFlag = styleFlag;
    
    /**The {@link Style} of the arc*/
    this.style = new Style();
    this.style.gradientBounds = this.getBounds();

    /**Adding a reference to the end point makes the transform code hugely cleaner*/
    this.direction = direction;
    
    /**Object type used for JSON deserialization*/
    this.oType = 'Arc';
}


/**Creates a {Arc} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Arc} a newly constructed Arc
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Arc.load = function(o){
    var newArc = new Arc();

    newArc.endAngle = o.endAngle;
    newArc.startAngle = o.startAngle;
    newArc.middle = Point.load(o.middle);
    newArc.radius = o.radius
    newArc.curves = QuadCurve.loadArray(o.curves);

    /*we need to load these 'computed' values as they are computed only in constructor :(
     *TODO: maybe make a new function setUp() that deal with this*/
    newArc.startPoint = Point.load(o.startPoint);
    newArc.endPoint = Point.load(o.endPoint);
    newArc.startAngleRadians = o.startAngleRadians;
    newArc.endAngleRadians = o.endAngleRadians;

    newArc.styleFlag = o.styleFlag;
    newArc.style = Style.load(o.style);
    newArc.direction = o.direction;

    return newArc;
}

/**Creates a {Arc} out of an Array of JSON parsed object
 *@param {Array} v - an {Array} of JSON parsed objects
 *@return {Array}of newly constructed Arcs
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Arc.loadArray = function(v){
    var newArcs = [];

    for(var i=0; i<v.length; i++){
        newArcs.push(Arc.load(v[i]));
    }

    return newArcs;
}



Arc.prototype = {
    
    constructor : Arc,
    
    transform:function(matrix){
        /* rotations - ok
         * translations - ok
         * scale - ok
         * skew - NOT ok (i do not know how to preserve points, angles...etc- maybe a Cola :)
         **/
        
        //transform the style
        if(this.style != null){
            this.style.transform(matrix);
        }

        //transform the center of the circle
        this.middle.transform(matrix);

        //transform each curve
        for(var i=0; i<this.curves.length; i++){
            this.curves[i].transform(matrix);
        }
    },


    paint:function(context){
        context.beginPath();
		
        if(this.style!=null){
            this.style.setupContext(context);
        }
        context.lineWidth = this.style.lineWidth;
        //context.arc(x,y,radius,(Math.PI/180)*startAngle,(Math.PI/180)*endAngle,direction);                        
        context.moveTo(this.curves[0].startPoint.x, this.curves[0].startPoint.y);
        for(var i=0; i<this.curves.length; i++){
            context.quadraticCurveTo(this.curves[i].controlPoint.x, this.curves[i].controlPoint.y
                ,this.curves[i].endPoint.x, this.curves[i].endPoint.y);
        //curves[i].paint(context);
        }

        if(this.styleFlag == 1){
            context.closePath();
        }
        else if(this.styleFlag == 2){
            context.lineTo(this.middle.x, this.middle.y);
            context.closePath();
        }

        //first fill
        if(this.style.fillStyle!=null && this.style.fillStyle!=""){
            context.fill();
        }

        //then stroke
        if(this.style.strokeStyle!=null && this.style.strokeStyle!=""){
            context.stroke();
        }

    },

    clone:function(){
        var ret = new Arc(this.middle.x, this.middle.y, this.radius, this.startAngle, this.endAngle, this.direction, this.styleFlag);
        for (var i=0; i< this.curves.length; i++){
            ret.curves[i]=this.curves[i].clone();
        }
        ret.style=this.style.clone();
        return ret;
    },

    equals:function(anotherArc){
        if(!anotherArc instanceof Arc){
            return false;
        }

        //check curves
        for(var i = 0 ; i < this.curves.lenght; i++){
            if(!this.curves[i].equals(anotherArc.curves[i])){
                return false;
            }
        }

        return this.startAngle == anotherArc.startAngle
        && this.endAngle == anotherArc.endAngle
        && this.middle.equals(anotherArc.middle)
        && this.radius == anotherArc.radius
        && this.numControlPoints == anotherArc.numControlPoints
        && this.startPoint.equals(anotherArc.startPoint)
        && this.endPoint.equals(anotherArc.endPoint)
        && this.startAngleRadians == anotherArc.startAngleRadians
        && this.endAngleRadians == anotherArc.endAngleRadians
    ;
    },

    near:function(thex,they,theradius){
        for(var i=0; i<this.curves.length; i++){
            if(this.curves[i].near(thex,they,theradius)){
                return true;
            }
        }
        //return (distance && angle) || finishLine || startLine || new Point(x,y).near(thex,they,theradius);

        return false;
    },

    contains: function(thex,they){
        var p = this.getPoints();
        return Util.isPointInside((new Point(thex,they)), p);

    },

    /**Get the points of the Arc
     *@return {Array} of {Point}s
     *@author Zack
     **/
    getPoints:function(){
        var p = [];
        if(this.styleFlag ==2){
            p.push(this.middle);
        }
        for(var i=0; i<this.curves.length; i++){
            var c = this.curves[i].getPoints();
            for(var a=0; a<c.length; a++){
                p.push(c[a]);
            }
        }
        return p;
    },

    getBounds:function(){
        return Util.getBounds(this.getPoints());
    },

    toString:function(){
        return 'arc(' + new Point(this.x,this.y) + ','  + this.radius + ',' + this.startAngle + ',' + this.endAngle + ',' + this.direction + ')';
    },


    /**
     *As we simulate an arc by {QuadCurve}s so we will collect all of them
     *and add it to a <path/> element.
     *Note: We might use the SVG's arc command but what if the arc got distorted by a transformation?
     *@see <a href="http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands">http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands</a>
     *@see <a href="http://tutorials.jenkov.com/svg/path-element.html">http://tutorials.jenkov.com/svg/path-element.html</a>
     *@author Alex <alex@scriptoid.com>
     **/
    toSVG: function(){
        var r = "\n" + repeat("\t", INDENTATION) + '<path d="';
        r += ' M' + this.curves[0].startPoint.x  + ',' + this.curves[0].startPoint.y
        for(var i=0; i<this.curves.length; i++){
            r += ' Q' + this.curves[i].controlPoint.x  + ',' + this.curves[i].controlPoint.y
            + ' ' + this.curves[i].endPoint.x + ',' + this.curves[i].endPoint.y;
        }
        r += '" ';
        r += this.style.toSVG();
        r += '/>';
        return r;
    }
}



/**
 * Approximate an ellipse through 4 bezier curves, one for each quadrant
 * 
 * @constructor
 * @this {Ellipse}
 * @param {Point} centerPoint - the center point of the ellipse
 * @param {Number} width - the width of the ellipse
 * @param {Number} height - the height of the ellipse

 * @see <a href="http://www.codeguru.com/cpp/g-m/gdi/article.php/c131">http://www.codeguru.com/cpp/g-m/gdi/article.php/c131</a>
 * @see <a href="http://www.tinaja.com/glib/ellipse4.pdf">http://www.tinaja.com/glib/ellipse4.pdf</a>
 * @author Zack Newsham <zack_newsham@yahoo.co.uk>
 **/
function Ellipse(centerPoint, width, height) {
    /**"THE" constant*/
    var EToBConst = 0.2761423749154;

    /**Width offset*/
    var offsetWidth = width * 2 * EToBConst;
    
    /**Height offset*/    
    var offsetHeight = height * 2 * EToBConst;
    
    /**The center {@link Point}*/
    this.centerPoint = centerPoint;
    
    /**Top left {@link CubicCurve}*/
    this.topLeftCurve = new CubicCurve(new Point(centerPoint.x-width,centerPoint.y),new Point(centerPoint.x-width,centerPoint.y-offsetHeight),new Point(centerPoint.x-offsetWidth,centerPoint.y-height),new Point(centerPoint.x,centerPoint.y-height));
    
    /**Top right {@link CubicCurve}*/
    this.topRightCurve = new CubicCurve(new Point(centerPoint.x,centerPoint.y-height),new Point(centerPoint.x+offsetWidth,centerPoint.y-height),new Point(centerPoint.x+width,centerPoint.y-offsetHeight),new Point(centerPoint.x+width,centerPoint.y));
    
    /**Bottom right {@link CubicCurve}*/
    this.bottomRightCurve = new CubicCurve(new Point(centerPoint.x+width,centerPoint.y),new Point(centerPoint.x+width,centerPoint.y+offsetHeight),new Point(centerPoint.x+offsetWidth,centerPoint.y+height),new Point(centerPoint.x,centerPoint.y+height));
    
    /**Bottom left {@link CubicCurve}*/
    this.bottomLeftCurve = new CubicCurve(new Point(centerPoint.x,centerPoint.y+height),new Point(centerPoint.x-offsetWidth,centerPoint.y+height),new Point(centerPoint.x-width,centerPoint.y+offsetHeight),new Point(centerPoint.x-width,centerPoint.y));
    
    /**The matrix array*/
    this.matrix = null; //TODO: do we really need this?
    
    /**The {@link Style} used*/
    this.style = new Style();
    this.style.gradientBounds = this.getBounds();

    /**Oject type used for JSON deserialization*/
    this.oType = 'Ellipse'; 
}

/**Creates a new {Ellipse} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Ellipse} a newly constructed Ellipse
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Ellipse.load = function(o){
    var newEllipse= new Ellipse(new Point(0,0), 0, 0); //fake ellipse (if we use a null centerPoint we got errors)

    newEllipse.offsetWidth = o.offsetWidth;
    newEllipse.offsetHeight = o.offsetHeight;
    newEllipse.centerPoint = Point.load(o.centerPoint);
    newEllipse.topLeftCurve = CubicCurve.load(o.topLeftCurve);
    newEllipse.topRightCurve = CubicCurve.load(o.topRightCurve);
    newEllipse.bottomRightCurve = CubicCurve.load(o.bottomRightCurve);
    newEllipse.bottomLeftCurve = CubicCurve.load(o.bottomLeftCurve);
    this.matrix = Matrix.clone(o.matrix);
    newEllipse.style = Style.load(o.style);

    return newEllipse;
}


Ellipse.prototype = {
    constructor: Ellipse,
    
    transform:function(matrix){
        this.topLeftCurve.transform(matrix);
        this.topRightCurve.transform(matrix);
        this.bottomLeftCurve.transform(matrix);
        this.bottomRightCurve.transform(matrix);
        this.centerPoint.transform(matrix);
        if(this.style){
            this.style.transform(matrix);
        }
    },

    paint:function(context){
        if(this.style!=null){
            this.style.setupContext(context);
        }
        context.beginPath();
        context.moveTo(this.topLeftCurve.startPoint.x, this.topLeftCurve.startPoint.y);
        context.bezierCurveTo(this.topLeftCurve.controlPoint1.x, 
            this.topLeftCurve.controlPoint1.y, this.topLeftCurve.controlPoint2.x, 
            this.topLeftCurve.controlPoint2.y, this.topLeftCurve.endPoint.x, 
            this.topLeftCurve.endPoint.y);
        context.bezierCurveTo(this.topRightCurve.controlPoint1.x, 
            this.topRightCurve.controlPoint1.y, this.topRightCurve.controlPoint2.x, 
            this.topRightCurve.controlPoint2.y, this.topRightCurve.endPoint.x, 
            this.topRightCurve.endPoint.y);
        context.bezierCurveTo(this.bottomRightCurve.controlPoint1.x, 
            this.bottomRightCurve.controlPoint1.y, this.bottomRightCurve.controlPoint2.x, 
            this.bottomRightCurve.controlPoint2.y, this.bottomRightCurve.endPoint.x, 
            this.bottomRightCurve.endPoint.y);
        context.bezierCurveTo(this.bottomLeftCurve.controlPoint1.x, 
            this.bottomLeftCurve.controlPoint1.y, this.bottomLeftCurve.controlPoint2.x,
            this.bottomLeftCurve.controlPoint2.y, this.bottomLeftCurve.endPoint.x, 
            this.bottomLeftCurve.endPoint.y);

        //first fill
        if(this.style.fillStyle!=null && this.style.fillStyle!=""){
            context.fill();
        }

        //then stroke
        if(this.style.strokeStyle!=null && this.style.strokeStyle!=""){
            context.stroke();
        }

    },

    contains:function(x,y){
        var points = this.topLeftCurve.getPoints();
        var curves = [this.topRightCurve, this.bottomRightCurve, this.bottomLeftCurve];
        for(var i=0; i<curves.length; i++){
            var curPoints = curves[i].getPoints();

            for(var a=0; a<curPoints.length; a++){
                points.push(curPoints[a]);
            }
        }
        return Util.isPointInside(new Point(x,y), points);

        return false;
    },

    near:function(x,y,radius){
        return this.topLeftCurve.near(x,y,radius) || this.topRightCurve.near(x,y,radius) || this.bottomLeftCurve.near(x,y,radius) || this.bottomRightCurve.near(x,y,radius);
    },

    equals:function(anotherEllipse){
        if(!anotherEllipse instanceof Ellipse){
            return false;
        }

        return this.offsetWidth == anotherEllipse.offsetWidth
        && this.offsetHeight == anotherEllipse.offsetHeight
        && this.centerPoint.equals(anotherEllipse.centerPoint)
        && this.topLeftCurve.equals(anotherEllipse.topLeftCurve)
        && this.topRightCurve.equals(anotherEllipse.topRightCurve)
        && this.bottomRightCurve.equals(anotherEllipse.bottomRightCurve)
        && this.bottomLeftCurve.equals(anotherEllipse.bottomLeftCurve);
    //TODO: add this && this.matrix.equals(anotherEllipse.bottomLeftCurve)
    //TODO: add this && this.style.equals(anotherEllipse.bottomLeftCurve)
    },

    clone:function(){
        var ret=new Ellipse(this.centerPoint.clone(),10,10);
        ret.topLeftCurve=this.topLeftCurve.clone();
        ret.topRightCurve=this.topRightCurve.clone();
        ret.bottomLeftCurve=this.bottomLeftCurve.clone();
        ret.bottomRightCurve=this.bottomRightCurve.clone();
        ret.style=this.style.clone();
        return ret;
    },

    toString:function(){
        return 'ellipse('+this.centerPoint+","+this.xRadius+","+this.yRadius+")";
    },

    /**
     *@see <a href="http://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands">http://www.w3.org/TR/SVG/paths.html#PathDataCubicBezierCommands</a>
     *@author Alex Gheorghiu <scriptoid.com>
     **/
    toSVG: function(){
        var result = "\n" + repeat("\t", INDENTATION) +  '<path d="M';
        result += this.topLeftCurve.startPoint.x + ',' + this.topLeftCurve.startPoint.y;

        //top left curve
        result += ' C' + this.topLeftCurve.controlPoint1.x + ',' + this.topLeftCurve.controlPoint1.y;
        result += ' ' + this.topLeftCurve.controlPoint2.x + ',' + this.topLeftCurve.controlPoint2.y;
        result += ' ' + this.topLeftCurve.endPoint.x + ',' + this.topLeftCurve.endPoint.y;

        //top right curve
        result += ' C' + this.topRightCurve.controlPoint1.x + ',' + this.topRightCurve.controlPoint1.y;
        result += ' ' + this.topRightCurve.controlPoint2.x + ',' + this.topRightCurve.controlPoint2.y;
        result += ' ' + this.topRightCurve.endPoint.x + ',' + this.topRightCurve.endPoint.y;

        //bottom right curve
        result += ' C' + this.bottomRightCurve.controlPoint1.x + ',' + this.bottomRightCurve.controlPoint1.y;
        result += ' ' + this.bottomRightCurve.controlPoint2.x + ',' + this.bottomRightCurve.controlPoint2.y;
        result += ' ' + this.bottomRightCurve.endPoint.x + ',' + this.bottomRightCurve.endPoint.y;

        //bottom left curve
        result += ' C' + this.bottomLeftCurve.controlPoint1.x + ',' + this.bottomLeftCurve.controlPoint1.y;
        result += ' ' + this.bottomLeftCurve.controlPoint2.x + ',' + this.bottomLeftCurve.controlPoint2.y;
        result += ' ' + this.bottomLeftCurve.endPoint.x + ',' + this.bottomLeftCurve.endPoint.y;

        result += '" ' + this.style.toSVG() +  '  />';
        return result;

    },


    getPoints:function(){
        var points = [];
        var curves = [this.topLeftCurve, this.topRightCurve,this.bottomRightCurve,this.bottomLeftCurve];

        for(var i=0; i<curves.length; i++){
            var curPoints = curves[i].getPoints();
            for(var a=0; a<curPoints.length; a++){
                points.push(curPoints[a]);
            }
        }
        return points;
    },


    getBounds:function(){
        return Util.getBounds(this.getPoints());
    }
}



/**
 * Approximate an ellipse through 4 bezier curves, one for each quadrant
 * 
 * @constructor
 * @this {DashedArc}
 * @param {Number} x - x coodinated of the center of the "invisible" circle
 * @param {Number} y - y coodinated of the center of the "invisible" circle
 * @param {Number} radius - the radius of the "invisible" circle
 * @param {Number} startAngle - the angle the arc will start from
 * @param {Number} endAngle - the angle the arc will end into
 * @param {Number} direction - direction of drawing (clockwise or anti-clock wise)
 * @param {Style} styleFlag - the style of the arc
 * @param {Number} dashGap - how big the gap between the lines will be

 * @see <a href="http://www.codeguru.com/cpp/g-m/gdi/article.php/c131">http://www.codeguru.com/cpp/g-m/gdi/article.php/c131</a>
 * @see <a href="http://www.tinaja.com/glib/ellipse4.pdf">http://www.tinaja.com/glib/ellipse4.pdf</a>
 * @author Zack Newsham <zack_newsham@yahoo.co.uk>
 **/
function DashedArc(x, y, radius, startAngle, endAngle, direction, styleFlag, dashGap){
    /**The "under the hood" {@link Arc}*/
    this.arc = new Arc(x, y, radius, startAngle, endAngle, direction, styleFlag);
    
    /*The {@link Style} used**/
    this.style = this.arc.style;
    
    /**The gap between dashes*/
    this.dashWidth = dashGap;
    
    /**An {Array} or {@link Arc}s*/
    this.lines = []; //an {Array} of {Arc}s

    //init the parts
    for(var i=0; i<100; i += this.dashWidth){
        var a = new Arc(x, y, radius+this.style.lineWidth/2, (endAngle-startAngle)/100*i, (endAngle-startAngle)/100*(i+1), false);
        a.style.strokeStyle = this.style.strokeStyle;
        this.lines.push(a);
    }

    /**Object type used for JSON deserialization*/
    this.oType = 'DashedArc'; 
}


/**Creates a new {Ellipse} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {DashedArc} a newly constructed DashedArc
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
DashedArc.load = function(o){
    var newDashedArc = new DashedArc(100,100,30,0,360,false,0,6); //fake dashed (if we do not use it we got errors - endless loop)
    newDashedArc.style.fillStyle="#ffffff"

    newDashedArc.arc = Arc.load(o.arc);
    newDashedArc.style = newDashedArc.arc.style; //strange but...
    newDashedArc.dashWidth = o.dashWidth;
    newDashedArc.lines = Arc.loadArray(o.lines);


    return newDashedArc;
}


DashedArc.prototype = {
    constructor: DashedArc,
    
    transform:function(matrix){
        this.arc.transform(matrix);
        for (var i=0; i<this.lines.length; i++){
            this.lines[i].transform(matrix);
        }
    },

    getBounds:function(){
        return this.arc.getBounds();
    },

    getPoints:function(){
        return this.arc.getPoints();
    },

    contains:function(x,y){
        return this.arc.contains(x,y);
    },

    near:function(x,y,radius){
        return this.arc.near(x,y,radius);
    },


    toString:function(){
        return this.arc.toString();
    },


    toSVG: function(){
        throw 'Arc:toSVG() - not implemented';
    },

    /***/
    equals:function(anotherDashedArc){
        if(!anotherDashedArc instanceof DashedArc){
            return false;
        }


        if(this.lines.length != anotherDashedArc.lines.length){
            return false;
        }
        else{
            for(var i in this.lines){
                if(!this.lines[i].equals(anotherDashedArc.lines[i])){
                    return false;
                }
            }
        }

        return this.arc.equals(anotherDashedArc.arc)
        && this.style.equals(anotherDashedArc.style)
        && this.dashWidth == anotherDashedArc.dashWidth;
    },

    clone:function(){
        return this.arc.clone();
    },

    paint:function(context){
        this.style.setupContext(context);
        context.lineCap="round"//this.style.lineCap;
        for(var i=0; i<this.lines.length; i++){
            context.beginPath();
            this.lines[i].paint(context);
            context.stroke();
        }
        this.style.strokeStyle=null;
        this.arc.paint(context)
    }

}


/**
 * A path contains a number of elements (like shape) but they are drawn as one, i.e.
 * 
 * @example
 * begin path
 *  loop to draw shapes
 *      draw shape
 *  close loop
 * close path
 * 
 * 
 * @constructor
 * @this {Path}
 **/
function Path() {
    /**An {Array} that will store all the basic primitives: {@link Point}s, {@link Line}s, {@link CubicCurve}s, etc that make the path*/
    this.primitives = [];
    
    /**The {@link Style} used for drawing*/
    this.style = new Style();
    this.style.gradientBounds = this.getBounds();

    /**Object type used for JSON deserialization*/
    this.oType = 'Path'; 
}

/**Creates a new {Path} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Path} a newly constructed {Path}
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Path.load = function(o){
    var newPath = new Path(); //fake path

    newPath.style = Style.load(o.style);

    for(var i=0; i< o.primitives.length; i++){
        /**We can not use instanceof Point construction as
         *the JSON objects are typeless... so JSONObject are simply objects */
        if(o.primitives[i].oType == 'Point'){
            newPath.primitives.push(Point.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Line'){
            newPath.primitives.push(Line.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Polyline'){
            newPath.primitives.push(Polyline.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Polygon'){
            newPath.primitives.push(Polygon.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'QuadCurve'){
            newPath.primitives.push(QuadCurve.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'CubicCurve'){
            newPath.primitives.push(CubicCurve.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Arc'){
            newPath.primitives.push(Arc.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Ellipse'){
            newPath.primitives.push(Ellipse.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'DashedArc'){
            newPath.primitives.push(DashedArc.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Path'){
            newPath.primitives.push(Path.load(o.primitives[i]))
        }

    }

    return newPath;
}


Path.prototype = {
    constructor : Path,
    
    transform:function(matrix){
        for(var i = 0; i<this.primitives.length; i++ ){
            this.primitives[i].transform(matrix);
        }
    },

    addPrimitive:function(primitive){
        this.primitives.push(primitive);

        // update bound coordinates for gradient
        this.style.gradientBounds = this.getBounds();
    },

    contains: function(x,y){
        var points = [];
        for(var i=0; i<this.primitives.length; i++){
            if(this.primitives[i].contains(x,y)){
                return true;
            }
            var curPoints = this.primitives[i].getPoints();
            for(var a=0; a<curPoints.length; a++){
                points.push(curPoints[a]);
            }
        }
        return Util.isPointInside(new Point(x,y),points);
    },

    near: function(x,y,radius){
        var points = [];
        for(var i=0; i<this.primitives.length; i++){
            if(this.primitives[i].near(x,y,radius)){
                return true;
            }
        }
        return false;
    },

    getPoints:function(){
        var points = [];
        for (var i=0; i<this.primitives.length; i++){
            points = points.concat(this.primitives[i].getPoints());
        }
        return points;
    },
    getBounds:function(){
        var points = [];
        for (var i in this.primitives) {
            var bounds = this.primitives[i].getBounds();
            points.push(new Point(bounds[0], bounds[1]));
            points.push(new Point(bounds[2], bounds[3]));
        }
        return Util.getBounds(points);
    },

    clone:function(){
        var ret = new Path();
        for (var i=0; i<this.primitives.length; i++){
            ret.addPrimitive(this.primitives[i].clone());
            if(this.primitives[i].parentFigure){
                ret.primitives[i].parentFigure=ret;
            }
        }
        ret.style=this.style
        return ret;
    },

    /**@author: Alex Gheorghiu <alex@scriptoid.com>*/
    equals : function(anotherPath){
        if(!anotherPath instanceof Path){
            return false;
        }

        for(var i=0; i<this.primitives.length; i++){
            if(!this.primitives[i].equals(anotherPath.primitives[i])){
                return  false;
            }
        }
        return true;
    },

    paint:function(context){
        context.save();

        if(this.style != null){
            this.style.setupContext(context);
        }

        //PAINT FILL
        //this loop is the one for the fill, we keep the reference.
        //if you try to put these two together, you will get a line that is the same colour,
        //even if you define different colours for each part of the line (i.e. fig 19)
        //not allowing multiple colours in a single path will clean this code up hugely.
        //
        if(this.style.fillStyle != null && this.style.fillStyle != "" ){
            context.beginPath();
            context.moveTo(this.primitives[0].startPoint.x,this.primitives[0].startPoint.y);
            for(var i = 0; i<this.primitives.length; i++ ){
                var primitive  = this.primitives[i];
                if(primitive instanceof Line){
                    context.lineTo(primitive.endPoint.x,primitive.endPoint.y);
                }
                else if(primitive instanceof Polyline){
                    for(var a=0; a<primitive.points.length; a++){
                        context.lineTo(primitive.points[a].x,primitive.points[a].y);
                    }
                }
                else if(primitive instanceof QuadCurve){
                    context.quadraticCurveTo(primitive.controlPoint.x, primitive.controlPoint.y, primitive.endPoint.x, primitive.endPoint.y);
                }
                else if(primitive instanceof CubicCurve){
                    context.bezierCurveTo(primitive.controlPoint1.x, primitive.controlPoint1.y, primitive.controlPoint2.x, primitive.controlPoint2.y, primitive.endPoint.x, primitive.endPoint.y)
                }
            }
            context.fill();
        }

        //PAINT STROKE
        //This loop draws the lines of each individual shape. Each part might have a different strokeStyle !
        if(this.style.strokeStyle != null && this.style.strokeStyle != "" ){
            for(var i = 0; i<this.primitives.length; i++ ){
                var primitive  = this.primitives[i];

                context.save();
                context.beginPath();

                //TODO: what if a primitive does not have a start point?
                context.moveTo(primitive.startPoint.x,primitive.startPoint.y);

                if(primitive instanceof Line){
                    context.lineTo(primitive.endPoint.x,primitive.endPoint.y);
                    context.closePath(); // added for line's correct Chrome's displaying
                //Log.info("line");
                }
                else if(primitive instanceof Polyline){
                    for(var a=0; a<primitive.points.length; a++){
                        context.lineTo(primitive.points[a].x,primitive.points[a].y);
                    //Log.info("polyline");
                    }
                }
                else if(primitive instanceof QuadCurve){
                    context.quadraticCurveTo(primitive.controlPoint.x, primitive.controlPoint.y, primitive.endPoint.x, primitive.endPoint.y);
                //Log.info("quadcurve");
                }
                else if(primitive instanceof CubicCurve){
                    context.bezierCurveTo(primitive.controlPoint1.x, primitive.controlPoint1.y, primitive.controlPoint2.x, primitive.controlPoint2.y, primitive.endPoint.x, primitive.endPoint.y)
                //Log.info("cubiccurve");
                }
                else if(primitive instanceof Arc){
                    context.arc(primitive.startPoint.x, primitive.startPoint.y, primitive.radius, primitive.startAngleRadians, primitive.endAngleRadians, true)
                //Log.info("arc" + primitive.startPoint.x + " " + primitive.startPoint.y);
                }
                else
                {
                //Log.info("unknown primitive");
                }

                //save primitive's old style
                var oldStyle = primitive.style.clone();

                //update primitive's style
                if(primitive.style == null){
                    primitive.style = this.style;
                }
                else{
                    primitive.style.merge(this.style);
                }

                //use primitive's style
                primitive.style.setupContext(context);

                //stroke it
                context.stroke();

                //change primitive' style back to original one
                primitive.style = oldStyle;

                context.restore();
            }
        }

        context.restore();

    },


    /**
     *Export this path to SVG
     *@see <a href="http://tutorials.jenkov.com/svg/path-element.html">http://tutorials.jenkov.com/svg/path-element.html</a>
     *@example 
     * &lt;path d="M50,50
     *        A30,30 0 0,1 35,20
     *        L100,100
     *        M110,110
     *        L100,0"
     *     style="stroke:#660000; fill:none;"/&gt;
     */
    toSVG: function(){

        var result = "\n" + repeat("\t", INDENTATION) + '<path d="';
        var previousPrimitive = null;
        for(var i=0; i<this.primitives.length; i++){

            var primitive = this.primitives[i];

            if(primitive instanceof Point){
                //TODO: implement me. Should we allow points?
                /**Here is a big problem as if we implement the point as a line with 1px width
                 *upon scaling it will became obvious it's a line.
                 *Alternative solutions:
                 *1 - draw it as a SVG arc
                 *2 - draw it as an independent SVG circle*/
                throw 'Path:toSVG()->Point - not implemented';
            }
            if(primitive instanceof Line){
                /*If you want the Path to be a continuous contour we check if
                 *the M is unecessary - maybe we are already comming from that spot*/
                if(previousPrimitive == null  || previousPrimitive.endPoint.x != primitive.startPoint.x || previousPrimitive.endPoint.y != primitive.startPoint.y){
                    result += ' M' + primitive.startPoint.x + ',' + primitive.startPoint.y;
                }
                result += ' L' + primitive.endPoint.x + ',' + primitive.endPoint.y;
            }
            else if(primitive instanceof Polyline){
                for(var a=0; a<primitive.points.length; a++){
                    result += ' L' + primitive.points[a].x + ',' + primitive.points[a].y;
                //Log.info("polyline");
                }
            }
            else if(primitive instanceof QuadCurve){
                result += ' Q' + primitive.controlPoint.x + ',' + primitive.controlPoint.y + ',' + primitive.endPoint.x + ',' + primitive.endPoint.y ;
            }
            else if(primitive instanceof CubicCurve){
                result += ' C' + primitive.controlPoint1.x + ',' + primitive.controlPoint1.y + ',' + primitive.controlPoint2.x + ',' + primitive.controlPoint2.y + ',' + primitive.endPoint.x + ',' + primitive.endPoint.y;
            }
            else if(primitive instanceof Arc){
                //TODO: implement me
                //<path d="M100,100 A25 25 0 0 0 150 100" stroke="lightgreen" stroke-width="4" fill="none" />
                throw 'Path:toSVG()->Arc - not implemented';
            }
            else if(primitive instanceof Polyline){
                //TODO: implement me
                throw 'Path:toSVGPolylineArc - not implemented';
            }
            else{
                throw 'Path:toSVG()->unknown primitive rendering not implemented';
            }

            previousPrimitive = primitive;
        }//end for
        result += '" '; //end of primitive shapes
        //        result += ' fill="none" stroke="#0F0F00" /> '; //end of path
        result += this.style.toSVG(); //end of path
        result += ' />'; //end of path

        return result;
    }

}



/**A figure is simply a collection of basic primitives: Points, Lines, Arcs, Curves and Paths
 * A figure should not care about grouping primitives into Paths, each shape should draw itself.
 * The Figure only delegate the painting to the composing shape.
 *
 * @constructor
 * @this {Figure}
 * @param {String} name - the name of the figure
 *
 **/
function Figure(name) {
    /**Each Figure will have an unique Id on canvas*/
    this.id = STACK.generateId();
    
    /**Figure's name*/
    this.name = name;
    
    /**An {Array} of primitives that make the figure*/
    this.primitives = [];

    /**the Group'id to which this figure belongs to*/
    this.groupId = -1;

    /*Keeps track of all the handles for a figure*/
    //this.handles = [];
    //this.handleSelectedIndex=-1;
    //this.builder = new Builder(this.id);

    /**An {Array} of {@link BuilderProperty} objects*/
    this.properties = []; 
    
    /**The {@link Style} use to draw this figure*/
    this.style = new Style();
    this.style.gradientBounds = this.getBounds();

    /**We keep the figure position by having different points
     *[central point of the figure, the middle of upper edge]
     * An {Array} or {@link Point}s
     **/
    this.rotationCoords = [];
    
    
    /**A {String} that point to a location*/
    this.url = '';

    /**Object type used for JSON deserialization*/
    this.oType = 'Figure'; 
}

/**Creates a new {Figure} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Figure} a newly constructed Figure
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Figure.load = function(o){
    var newFigure = new Figure(); //fake dashed (if we do not use it we got errors - endless loop)

    newFigure.id = o.id;
    newFigure.name = o.name;
    for(var i=0; i< o.primitives.length; i++){
        /**We can not use instanceof Point construction as
         *the JSON objects are typeless... so JSONObject are simply objects */
        if(o.primitives[i].oType == 'Point'){
            newFigure.addPrimitive(Point.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Line'){
            newFigure.addPrimitive(Line.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Polyline'){
            newFigure.addPrimitive(Polyline.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Polygon'){
            newFigure.addPrimitive(Polygon.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'DottedPolygon'){
            newFigure.addPrimitive(DottedPolygon.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'QuadCurve'){
            newFigure.addPrimitive(QuadCurve.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'CubicCurve'){
            newFigure.addPrimitive(CubicCurve.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Arc'){
            newFigure.addPrimitive(Arc.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Ellipse'){
            newFigure.addPrimitive(Ellipse.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'DashedArc'){
            newFigure.addPrimitive(DashedArc.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Text'){
            newFigure.addPrimitive(Text.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Path'){
            newFigure.addPrimitive(Path.load(o.primitives[i]))
        }
        else if(o.primitives[i].oType == 'Figure'){
            newFigure.addPrimitive(Figure.load(o.primitives[i])); //kinda recursevly
        }
        else if(o.primitives[i].oType == 'ImageFrame'){
            newFigure.addPrimitive(ImageFrame.load(o.primitives[i])); //kinda recursevly
        }
    }//end for

    newFigure.groupId = o.groupId;
    newFigure.properties = BuilderProperty.loadArray(o.properties);
    newFigure.style = Style.load(o.style);
    newFigure.rotationCoords = Point.loadArray(o.rotationCoords);
    newFigure.url = o.url;


    return newFigure ;
}

/**Creates a new {Array} of {Figure}s out of JSON parsed object
 *@param {JSONObject} v - the JSON parsed object
 *@return {Array} of newly constructed {Figure}s
 *@author Alex Gheorghiu <alex@scriptoid.com>
 *@author Janis Sejans <janis.sejans@towntech.lv>
 **/
Figure.loadArray = function(v){
    var newFigures = [];

    for(var i=0; i<v.length; i++){
        newFigures.push(Figure.load(v[i]));
    }

    return newFigures;
}

Figure.prototype = {
    
    constructor: Figure,
    
    /* TODO: Remove it!
     * This is wrong as a Figure can have many Text figure inside and picking the first Text
     * is simply wrong
     * 
     * Used by the edit panel
     * @return {Text} the text item
     * @deprecated 
     */
    getText:function(){
        for(var i=0; i<this.primitives.length; i++){
            if(this.primitives[i] instanceof Text){
                return this.primitives[i];
            }
        }

        return '';
    },

    /*TODO: Remove it!
     * This is wrong as a Figure can have many Text figure inside set all Text to same
     * text is wrong
     *
     *Set the text from edit panel
     *@param{Text} text - text object
     *@deprecated
     */
    setText:function(text){
        for(var i=0; i<this.primitives.length; i++){
            if(this.primitives[i] instanceof Text){
                this.primitives[i] = text;
            }
        }
    },

    //@param{bool} transformConnector - should we transform the connector? Used when we transform a figure,
    //without redrawing it.
    transform:function(matrix, transformConnector){
        if(transformConnector == "undefined" || transformConnector == undefined){
            transformConnector = true;
        }
        //transform all composing primitives
        for(var i = 0; i<this.primitives.length; i++ ){
            this.primitives[i].transform(matrix);
        }

        //transform the style
        this.style.transform(matrix);

        //cascade transform to the connection point
        //Log.info('Figure: transform()');
        if(transformConnector){
            CONNECTOR_MANAGER.connectionPointTransform(this.id,matrix);
        }

        //some figures don't have rotation coords, i.e. those that aren't "real" figures, such as the highlight rectangle
        if(this.rotationCoords.length!=0){
            this.rotationCoords[0].transform(matrix);
            this.rotationCoords[1].transform(matrix);
        }
    },

    getPoints:function(){
        var points = [];
        for (var i=0; i<this.primitives.length; i++){
            points = points.concat(this.primitives[i].getPoints()); //add all primitive's points in a single pass
        }
        return points;
    },

    addPrimitive:function(primitive){
        // add id property to primitive equal its index
        primitive.id = this.primitives.length;

        this.primitives.push(primitive);

        // update bound coordinates for gradient
        this.style.gradientBounds = this.getBounds();
    },

    //no more points to add, so create the handles and selectRect
    finalise:function(){
        var bounds = this.getBounds();

        if(bounds == null){
            throw 'Figure bounds are null !!!';
            return;
        }
        //central point of the figure
        this.rotationCoords[0] = new Point(
            bounds[0] + (bounds[2] - bounds[0]) / 2,
            bounds[1] + (bounds[3] - bounds[1]) / 2
        );

        //the middle of upper edge
        this.rotationCoords[1] = new Point(this.rotationCoords[0].x, bounds[1]);
    },

    clone:function(){
        var ret = new Figure(this.name);
        
        for (var i=0; i<this.primitives.length; i++){
            ret.addPrimitive(this.primitives[i].clone());
        }
        ret.properties = this.properties.slice(0);
        ret.style = this.style.clone();
        ret.rotationCoords[0]=this.rotationCoords[0].clone();
        ret.rotationCoords[1]=this.rotationCoords[1].clone();
        ret.url = this.url;
        
        //get all connection points and add them to the figure
        var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(this.id);
        
        cps.forEach(
            function(connectionPoint){
                CONNECTOR_MANAGER.connectionPointCreate(ret.id,connectionPoint.point.clone(), ConnectionPoint.TYPE_FIGURE);
            }
        );
        
        return ret;
    },

    /*
     *TODO: this is based on getText which is a WRONG (my or Zack's fault I think)
     *
     *apply/clone another figure style onto this figure
     *@param{Figure} anotherFigure - another figure
     *@author Janis Sejans <janis.sejans@towntech.lv>
     *TODO: From Janis: we don`t have Undo for this operation
     *@deprecated
     */
    applyAnotherFigureStyle:function(anotherFigure){
        this.style = anotherFigure.style.clone();
        
        var newText = this.getText(); //will contain new text object
        //TODO: From Janis: there is some problem if applying text twice, the getText returns empty string, this means it is not properly cloned
        if(newText instanceof Text){
            var currTextStr = newText.getTextStr(); //remember text str
            var currTextVector = newText.vector; //remember text vector
            
            newText = anotherFigure.getText().clone();
            newText.setTextStr(currTextStr); //restore text str
            newText.vector = currTextVector; //restore text vector
            this.setText(newText);
        }
    },

    contains:function(x,y){
        var points=[];
        for(var i=0; i<this.primitives.length; i++){
            if(this.primitives[i].contains(x,y)){
                return true;
            }
            points = points.concat(this.primitives[i].getPoints());
        }
        return Util.isPointInside(new Point(x,y),points);
    },


    /**
     * @return {Array<Number>} - returns [minX, minY, maxX, maxY] - bounds, where
     *  all points are in the bounds.
     */
    getBounds: function(){
        var points = [];
        for (var i = 0; i < this.primitives.length; i++) {
            var bounds = this.primitives[i].getBounds();
            points.push(new Point(bounds[0], bounds[1]));
            points.push(new Point(bounds[2], bounds[3]));
        }
        return Util.getBounds(points);
    },


    paint:function(context){
        if(this.style){
            this.style.setupContext(context);
        }
        for(var i = 0; i<this.primitives.length; i++ ){
			context.save();
            var primitive  = this.primitives[i];
            

            var oldStyle = null;
            if(primitive.style){ //save primitive's style
                oldStyle = primitive.style.clone();
            }

            if(primitive.style == null){ //if primitive does not have a style use Figure's one
                primitive.style = this.style.clone();
            }
            else{ //if primitive has a style merge it
                primitive.style.merge(this.style);
            }

            
            primitive.paint(context);
            primitive.style = oldStyle;
			
//            if(this.style.image != null){ //TODO: should a figure has a Style can't just delegate all to primitives?
//                //clip required for background images, there were two methods, this was the second I tried
//                //neither work in IE
//                context.clip();
//                context.save();
//                if(this.rotationCoords.length != 0){
//                    var angle=Util.getAngle(this.rotationCoords[0], this.rotationCoords[1]);
//                    if(IE && angle==0){
//                        angle=0.00000001;//stupid excanves, without this it puts all images down and right of the correct location
//                    //and by an amount relative to the distane from the top left corner
//                    }
//
//                    //if we perform a rotation on the actual rotationCoords[0] (centerPoint), when we try to translate it back,
//                    //rotationCoords[0] will = 0,0, so we create a clone that does not get changed
//                    var rotPoint = this.rotationCoords[0].clone();
//
//                    //move to origin, make a rotation, move back in place
//                    this.transform(Matrix.translationMatrix(-rotPoint.x, -rotPoint.y))
//                    this.transform(Matrix.rotationMatrix(-angle));
//                    this.transform(Matrix.translationMatrix(rotPoint.x, rotPoint.y))
//
//                    //TODO: these are not used...so why the whole acrobatics ?
//                    //this was the second method that is also not supported by IE, get the image, place it in
//                    //the correct place, then shrink it, so its still an 'image mask' but it is only a small image
//                    //context.scale below is also part of this
//                    //var shrinkBounds = this.getBounds();
//
//                    //move back to origin, 'undo' the rotation, move back in place
//                    this.transform(Matrix.translationMatrix(-rotPoint.x, -rotPoint.y))
//                    this.transform(Matrix.rotationMatrix(angle));
//                    this.transform(Matrix.translationMatrix(rotPoint.x, rotPoint.y))
//
//                    //rotate current canvas to prepare it to draw the image (you can not roate the image...:D)
//                    context.translate(rotPoint.x,rotPoint.y);
//                    context.rotate(angle);
//                    //context.scale(0.01,0.01)//1/getCanvas().width*shrinkBounds[0]+(shrinkBounds[2]-shrinkBounds[0])/2,1/getCanvas().width*shrinkBounds[1]+(shrinkBounds[3]-shrinkBounds[1])/2)
//                    context.translate(-rotPoint.x,-rotPoint.y);
//                }
//                //draw image
//                /*context.fill();
//                context.beginPath();
//                context.globalCompositeOperation = "source-atop"
//                 clip works best,but this works too, neither will work in IE*/
//                //context.fill();
//                context.drawImage(this.style.image,this.rotationCoords[0].x-this.style.image.width/2,this.rotationCoords[0].y-this.style.image.height/2,this.style.image.width,this.style.image.height)
//
//                context.restore();
//            }
//            else if (this.style.image!=null){
//                context.fill();
//            }

            context.restore();
        }
    },

    equals:function(anotherFigure){
        if(!anotherFigure instanceof Figure){
            Log.info("Figure:equals() 0");
            return false;
        }


        if(this.primitives.length == anotherFigure.primitives.length){
            for(var i=0; i<this.primitives.length; i++){
                if(!this.primitives[i].equals(anotherFigure.primitives[i])){
                    Log.info("Figure:equals() 1");
                    return false;
                }
            }
        }
        else{
            Log.info("Figure:equals() 2");
            return false;
        }
        //test group
        if(this.groupId != anotherFigure.groupId){
            return false;
        }

        //test rotation coords
        if(this.rotationCoords.length == anotherFigure.rotationCoords.length){
            for(var i in this.rotationCoords){
                if(!this.rotationCoords[i].equals(anotherFigure.rotationCoords[i])){
                    return false;
                }
            }
        }
        else{
            return false;
        }

        //test style
        if(!this.style.equals(anotherFigure.style)){
            return false;
        }
        
        //test url
        if(!this.url == anotherFigure.url){
            return false;
        }

        return true;
    },

    near:function(x,y,radius){
        for(var i=0; i<this.primitives.length; i++){
            if(this.primitives[i].near(x,y,radius)){
                return true;
            }
        }
        return false;
    },
    
    toString:function(){
        var result = this.name + ' [id: ' + this.id + '] (';
        for(var i = 0; i<this.primitives.length; i++ ){
            result += this.primitives[i].toString();
        }
        result += ')';
        return result;
    },


    toSVG: function(){
        var tempSVG = '';
        tempSVG += "\n" + repeat("\t", INDENTATION) +  "<!--Figure start-->";
        for(var i = 0; i<this.primitives.length; i++ ){
            var primitive  = this.primitives[i];

            var oldStyle = null;
            if(primitive.style){ //save primitive's style
                oldStyle = primitive.style.clone();
            }

            if(primitive.style == null){ //if primitive does not have a style use Figure's one
                primitive.style = this.style;
            }
            else{ //if primitive has a style merge it
                primitive.style.merge(this.style);
            }

            tempSVG += this.primitives[i].toSVG();
            
            //URL not exported
            throw Exception("Figure->toSVG->URL not exported");

            //restore primitives style
            primitive.style = oldStyle;
        }
        tempSVG += "\n" + repeat("\t", INDENTATION) +  "<!--Figure end-->" + "\n";

        return tempSVG;
    }
}

/**
 * Implements a NURBS component in Diagramo
 * @param {Array} points - an {Array} of {Point}s
 * @see http://en.wikipedia.org/wiki/Non-uniform_rational_B-spline
 * 
 * http://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html#path_Q
 * http://math.stackexchange.com/questions/92246/aproximate-n-grade-bezier-through-cubic-and-or-quadratic-bezier-curves
 * @see http://stackoverflow.com/questions/1257168/how-do-i-create-a-bezier-curve-to-represent-a-smoothed-polyline
 * @see http://www.codeproject.com/KB/graphics/BezierSpline.aspx Draw a Smooth Curve through a Set of 2D Points with Bezier Primitives
 *  "Paul de Casteljau, a brilliant engineer at Citroen"
 * @see http://stackoverflow.com/questions/8369488/splitting-a-bezier-curve
 * @see http://devmag.org.za/2011/04/05/bzier-curves-a-tutorial/
 * @see http://devmag.org.za/2011/06/23/bzier-path-algorithms/
 * @see http://drdobbs.com/cpp/184403417 (Forward Difference Calculation of Bezier Curves)
 * @see http://www.timotheegroleau.com/Flash/articles/cubic_bezier_in_flash.htm
 * @see http://www.algorithmist.net/bezier3.html
 * @see http://www.caffeineowl.com/graphics/2d/vectorial/bezierintro.html
 * @author Alex Gheorghiu <alex@scriptoid.com>
 **/
function NURBS(points){
    if(points.length < 2){
        throw "NURBS: contructor() We need minimum 3 points to have a NURBS";
    }
    
    /**The initial {@link Point}s*/
    this.points = Point.cloneArray(points);
    
    /**The array of {CubicCurve} s from which the NURB will be made*/
    this.fragments = this.nurbsPoints(this.points);
    
    /**The {@link Style} of the line*/
    this.style = new Style();
    this.style.gradientBounds = this.getBounds();

    /**Serialization type*/
    this.oType = 'NURBS'; //object type used for JSON deserialization
}

/**Creates a {NURBS} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {NURBS} a newly constructed NURBS
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
NURBS.load = function(o){
    
    var newNURBS = new NURBS(Point.loadArray(o.points));    
    newNURBS.style = Style.load(o.style);
    return newNURBS;
};

NURBS.prototype = {
    /**Computes a series of Bezier(Cubic) curves to aproximate a curve modeled 
     *by a set of points
     *@param {Array}- P and {Array} of {Point}s
     *@return an {Array} of {CubicCurve} (provided also as {Array})
     *Example: 
     *  [
     *      [p1, p2, p3, p4],
     *      [p1', p2', p3', p4'],
     *      etc
     *  ]
     * See /documents/specs/spline-to-bezier.pdf (pages 5 and 6 for a description)  
     **/
    nurbsPoints : function (P){
        var n = P.length;
        
        /**Contains the gathered sub curves*/        
        var sol = [];
        
        if(n === 2){
            sol.push(new Line(P[0], P[1]));
            return sol;
        }
        else if(n === 3){
            sol.push(new QuadCurve(P[0], P[1], P[2]));
            return sol;
        }
        else if(n === 4){
            sol.push(new CubicCurve(P[0], P[1], P[2], P[3]));
            return sol;
        }
        
        /**Computes factorial
         * @param {Number} k the number
         * */
        function fact(k){
            if(k===0 || k===1){
                return 1;
            }
            else{
                return k * fact(k-1);
            }
        }

        /**Computes Bernstain*/
        function B(i,n,u){
            return fact(n) / (fact(i) * fact(n-i))* Math.pow(u, i) * Math.pow(1-u, n-i);
        }

        /**Computes the sum between two points
         *@param p1 - {Point}
         *@param p2 - {Point}
         *@return {Point} the sum of initial points
         **/
        function sum(p1, p2){
            return new Point(p1.x + p2.x, p1.y + p2.y);
        }

        /**Computes the difference between first {Point} and second {Point}
         *@param p1 - {Point}
         *@param p2 - {Point}
         *@return {Point} the sum of initial points
         **/
        function minus(p1, p2){
            return new Point(p1.x - p2.x, p1.y - p2.y);
        }

        /**Computes the division of a {Point} by a number
         *@param p - {Point}
         *@param nr - {Number}
         *@return {Point}
         **/
        function divide(p, nr){
            if(nr == 0){ 
                throw "Division by zero not allowed (yet :) " + this.callee ;
            }
            return new Point(p.x/nr, p.y/nr);
        }

        /**Computes the multiplication of a {Point} by a number
         *@param p - {Point}
         *@param nr - {Number}
         *@return {Point}
         **/
        function multiply(p, nr){
            return new Point (p.x * nr, p.y * nr);
        }

        
        

        /*
         *I do not get why first 4 must be 0 and last 3 of same value.....
         *but otherwise we will get division by zero
         */
        var k = [0,0,0];                

        var j;
        for(j=0;j<=n-3;j++){
            k.push(j);
        }

        k.push(n-3, n-3);



        for(i=1; i<=n-3; i++){
            //q1 - compute start point
            var q1 = divide( sum( multiply(P[i], k[i+4] - k[i+2]), multiply(P[i+1], k[i+2] - k[i+1]) ), k[i+4] - k[i+1]);

            //q0 - compute 1st controll point
            var q_01 = (k[i+3] - k[i+2]) / (k[i+3] - k[i+1]);
            var q_02 = divide( sum( multiply(P[i-1],k[i+3] - k[i+2]), multiply(P[i], k[i+2] - k[i])), k[i+3] - k[i]);
            var q_03 = multiply(q1, ( k[i+2] - k[i+1])/ (k[i+3] - k[i+1]) );
            var q0 = sum(multiply(q_02, q_01), q_03);

            //q2 - compute 2nd controll point
            var q2 = divide( sum( multiply(P[i], k[i+4] - k[i+3]), multiply(P[i+1], k[i+3] - k[i+1]) ), k[i+4] - k[i+1] );

            //q3 - compute end point
            var q_31 = (k[i+3] - k[i+2]) / (k[i+4] - k[i+2]);
            var q_32 = divide( sum( multiply(P[i+1], k[i+5] - k[i+3]), multiply(P[i+2], k[i+3] - k[i+2]) ) , k[i+5] - k[i+2]);
            var q_33 = multiply(q2, (k[i+4] - k[i+3])/(k[i+4] - k[i+2]) );
            var q3 = sum(multiply(q_32, q_31), q_33);                    
            
            //store solution
            sol.push( new CubicCurve(q0, q1, q2, q3) );
        }

        return sol;
    },
    
    /**Paint the NURBS*/
    paint : function(context){
        context.beginPath();
		
        if(this.style != null){
            this.style.setupContext(context);
        }
        
        //Log.info("Nr of cubic curves " +  this.fragments.length);
        for(var f=0; f<this.fragments.length; f++){
            var fragment = this.fragments[f];
            fragment.style = this.style.clone();
            fragment.paint(context);
        }
    },
    
    
    transform : function(matrix){
        //transform initial points
        for(var p = 0; p<this.points.length; p++){
            var point = this.points[p];
            point.transform(matrix);
        }
        
        //transform cubic curves
        for(var f=0; f<this.fragments.length; f++){
            var fragment = this.fragments[f];
            fragment.transform(matrix);
        }
    },
    
    
    /** Tests to see if a point belongs to this NURBS
     * @param {Number} x - the X coordinates
     * @param {Number} y - the Y coordinates
     * @author Alex Gheorghiu <alex@scriptoid.com>
     **/
    contains: function(x, y){
        for(var f=0; f<this.fragments.length; f++){
            var fragment = this.fragments[f];
            if(fragment.contains(x, y)){
                return true;
            }
        }
        
        return false;
    },
    
    /**Computes the length of the {NURB} by summing the length of {CubicCurve}s
     * is made of.
     * TODO: as this involves a lot of computations it would nice to use a Math formula
     * */
    getLength : function(){
        var l = 0;
        
        for(var ci=0; ci<this.fragments.length; ci++){
            l += this.fragments[ci].getLength();
        }
        return l;
    },
    
    /**Get middle point*/
    _deprecated_getMiddle: function(){
        var ci;
        
        //gather lengths of curves
        var lengths = [];
        for(ci=0; ci<this.fragments.length; ci++){
            lengths.push(this.fragments[ci].getLength());
        }
        
        //find on what curve (index) the middle of NURBE will be        
        ci = 0;
        var collectedLength = 0;
        for(ci=0; ci<this.fragments.length; ci++){
            if(collectedLength + this.fragments[ci].getLength() > this.getLength()/2)
                break;
            
            collectedLength += this.fragments[ci].getLength();
        }
        
//        if (ci == 0 || ci == this.fragments.length)   
//            throw "Assert ci it should not be " + ci;
        
        var l = this.getLength()/2 - collectedLength;
        var t = l/this.fragments[ci].getLength();
        
        return this.fragments[ci].getVisualPoint(t);
    },
    
    getMiddle : function() {
        var points = this.getPoints();
        var poly = new Polyline();
        poly.points = points;
        
        return poly.getVisualPoint(0.5);
    },
    
    equals : function (object){
        throw Exception("Not implemented");
    },
    
    toString : function(){
        throw Exception("Not implemented");
    },
    
    
    toSVG : function() {
        
        var result = "\n" + repeat("\t", INDENTATION) +  '<path d="';
        
        for(var f=0; f<this.fragments.length; f++){
            var fragment = this.fragments[f];
            
            result += 'M' + fragment.startPoint.x + ',' + fragment.endPoint.y;
            result += ' C' + fragment.controlPoint1.x + ',' + fragment.controlPoint1.y;
            result += ' ' + fragment.controlPoint2.x + ',' + fragment.controlPoint2.y;
            result += ' ' + fragment.endPoint.x + ',' + fragment.endPoint.y;
        } 

        result += '" style="' + this.style.toSVG() +  '"  />';
        
        return result;
    },    
    
    clone : function() {
        throw Exception("Not implemented");
    },
    
    getBounds: function(){
        return Util.getBounds(this.getPoints());
    },
    
    near : function(x, y, radius){
        for(var f=0; f<this.fragments.length; f++){
            var fragment = this.fragments[f];
            if(fragment.near(x, y, radius)){
                return true;
            }
        }        
        
        return false;
    },
    
    getPoints : function(){
        var points = [];
        for(var f=0; f<this.fragments.length; f++){
            var fragment = this.fragments[f];
            points = points.concat(fragment.getPoints());
        }
        return points;
    }    
};


/**
 * A predefined matrix of a 90 degree clockwise rotation 
 *
 *@see <a href="http://en.wikipedia.org/wiki/Rotation_matrix">http://en.wikipedia.org/wiki/Rotation_matrix</a>
 */ 
var R90 = [
    [Math.cos(0.0872664626),-Math.sin(0.0872664626), 0],
    [Math.sin(0.0872664626),  Math.cos(0.0872664626), 0],
    [0,  0, 1]
    ];
    
/**
 * A predefined matrix of a 90 degree anti-clockwise rotation 
 *
 *@see <a href="http://en.wikipedia.org/wiki/Rotation_matrix">http://en.wikipedia.org/wiki/Rotation_matrix</a>
 */     
var R90A = [
    [Math.cos(0.0872664626), Math.sin(0.0872664626), 0],
    [-Math.sin(0.0872664626),  Math.cos(0.0872664626), 0],
    [0,  0, 1]
    ];

/**
 * The identity matrix
 */      

var IDENTITY=[[1,0,1],[0,1,0],[0,0,1]];


if(typeof(document) == 'undefined'){ //test only from console
    print("\n--==Point==--\n");
    p = new Point(10, 10);
    print(p);
    print("\n");
    p.transform(R90);
    print(p)

    print("\n--==Line==--\n");
    l = new Line(new Point(10, 23), new Point(34, 50));
    print(l);
    print("\n");


    print("\n--==Polyline==--\n");
    polyline = new Polyline();
    for(var i=0;i<5; i++){
        polyline.addPoint(new Point(i, i*i));
    }
    print(polyline);
    print("\n");




    print("\n--==Quad curve==--\n");
    q = new QuadCurve(new Point(75,25), new Point(25,25), new Point(25,62))
    print(q)

    print("\n");
    q.transform(R90);
    print(q)

    print("\n--==Cubic curve==--\n");
    q = new CubicCurve(new Point(75,40), new Point(75,37), new Point(70,25), new Point(50,25))
    print(q)

    print("\n");
    q.transform(R90);
    print(q)

    print("\n--==Figure==--\n");
    f = new Figure();
    f.addPrimitive(p);
    f.addPrimitive(q);
    print(f);

    f.transform(R90);
    print("\n");
    print(f);
    print("\n");
//f.draw();
}
