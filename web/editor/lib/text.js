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


/**A simple text class to render text on a HTML 5 canvas
 * Right now all the texts are horizontaly and verticaly centered so the (x,y) is the center of the text
 * 
 * @this {Text}
 * @constructor
 * @param {String} string - the text to display
 * @param {Number} x - the x pos
 * @param {Number} y - the y pos
 * @param {String} font - the font we are using for this text
 * @param {Number} size - the size of the font
 * 
 * @param {Boolean} outsideCanvas - set this on true if you want to use the Text outside of canvas (ex: Export to SVG)
 * @param {String} align - the alignment we are using for this text
 * @see list of web safe fonts : <a href="http://www.ampsoft.net/webdesign-l/WindowsMacFonts.html">http://www.ampsoft.net/webdesign-l/WindowsMacFonts.html</a> Arial, Verdana
 * </p>
 * @see /documents/specs/text.png
 * 
 * @author Alex Gheroghiu <alex@scriptoid.com>
 * @author Augustin <cdaugustin@yahoo.com>
 * @author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 * <p/>
 * Note:<br/>
 * Canvas's metrics do not report updated width for rotated (context) text ...so we need to compute it
 * <p/>
 * Alignement note: <br/>
 * It can be Center|Left|Right <a href="http://dev.w3.org/html5/2dcontext/#dom-context-2d-textalign">http://dev.w3.org/html5/2dcontext/#dom-context-2d-textalign</a>
 **/
function Text(string, x, y, font, size, outsideCanvas, align){
    /**Text used to display*/
    this.str = string;

    /**Font used to draw text*/
    this.font = font;
    
    /**Size of the text*/
    this.size = size; //TODO:Builder set this as String which is bad habit

    /**Line spacing. It should be a percent of the font size so it will grow with the font*/    
    this.lineSpacing = 1 / 4 * size; 
    
    /**Horizontal alignment of the text, can be: left, center, right*/
    this.align = align || Text.ALIGN_CENTER;

    /**Sets if text is underlined*/
    this.underlined = false;
    
    /**Vertical alignment of the text - for now always middle*/
//    this.valign = Text.VALIGN_MIDDLE;

    /**We will keep the initial point (as base line) and another point just above it - similar to a vector.
     *So when the text is transformed we will only transform the vector and get the new angle (if needed)
     *from it*/
    this.vector = [new Point(x,y),new Point(x,y-20)];

    /**Style of the text*/
    this.style = new Style();

    if(!outsideCanvas){
        this.bounds = this.getNormalBounds();
    }
        
    /*JSON object type used for JSON deserialization*/
    this.oType = 'Text'; 
}


/**Creates a new {Text} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Text} a newly constructed Text
 *@author Alex Gheorghiu <alex@scriptoid.com>
 *@author Janis Sejans <janis.sejans@towntech.lv>
 *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 **/
Text.load = function(o){
    //TODO: update
    var newText = new Text(o.str, o.x, o.y, o.font, o.size, false, o.align); //fake Text (if we do not use it we got errors - endless loop)
    //x loaded by contructor
    //y loaded by contructor
    //size loaded by contructor
    //font loaded by contructor
    //newText.lineSpacing = o.lineSpacing; //automatic computed from text size
    //align loaded by contructor
    newText.underlined = o.underlined;
    newText.vector = Point.loadArray(o.vector);
    newText.style = Style.load(o.style);

    return newText;
}

/**Left alignment*/
Text.ALIGN_LEFT = "left";

/**Center alignment*/
Text.ALIGN_CENTER = "center";

/**Right alignment*/
Text.ALIGN_RIGHT = "right";

/**An {Array} with horizontal alignments*/
Text.ALIGNMENTS = [{
    Value: Text.ALIGN_LEFT,
    Text:'Left'
},{
    Value: Text.ALIGN_CENTER,
    Text:'Center'
},{
    Value: Text.ALIGN_RIGHT,
    Text:'Right'
}];

/*
 There is no point in vertical alignment for a single text.
 A text is vertically aligned to something external to it.
 (The only exception is Chinese where they write from top to bottom
 and in that case vertical alignment is similar to horizontal alignment in Latin alphabet).
 */
/**Top alignment*/
//Text.VALIGN_TOP = "top";

/**Middle alignment*/
//Text.VALIGN_MIDDLE = "middle";

/**Bottom alignment*/
//Text.VALIGN_BOTTOM = "bottom";

/**An {Array} of  vertical alignments*/
//Text.VALIGNMENTS = [{
//    Value: Text.VALIGN_TOP,
//    Text:'Top'
//},{
//    Value: Text.VALIGN_MIDDLE,
//    Text:'Middle'
//},{
//    Value: Text.VALIGN_BOTTOM,
//    Text:'Bottom'
//}];

/**An {Array} of fonts*/
Text.FONTS = [{
    Value: "arial",
    Text: "Arial"
},{
    Value: "arial narrow",
    Text: "Arial Narrow"
},{
    Value: "courier new",
    Text: "Courier New"
},{
    Value: "tahoma",
    Text: "Tahoma"
}];

/**space between 2 caracters*/
Text.SPACE_BETWEEN_CHARACTERS = 2;

/**The default size of the created font*/
Text.DEFAULT_SIZE = 10;

/**Proportion between size of text and thickness of underline*/
Text.UNDERLINE_THICKNESS_DIVIDER = 16;


Text.prototype = {
    
    constructor : Text,
    
    getTextSize:function(){
        return this.size;
    },

    //we need to transform the connectionpoints when we change the size of the text
    //only used by the builder, for text figures (not figures with text)
    setTextSize:function(size){
        var oldBounds = this.getNormalBounds().getBounds();
        var oldSize = this.size;
        this.size = size;
        var newBounds = this.getNormalBounds().getBounds();
//        this._updateConnectionPoints(oldBounds, newBounds);
    },

    getTextStr:function(){
        return this.str;
    },

    setTextStr:function(str){
        var oldBounds = this.getNormalBounds().getBounds();
        this.str = str;
        var newBounds = this.getNormalBounds().getBounds();
//        this._updateConnectionPoints(oldBounds, newBounds);

    },

//    TODO: This should never happen in Text 
//    /*
//     *update the connection points when we change the text's size or
//     *@param {Array} oldBounds - the bounds of the primitive prior to action
//     *@param {Array} newBounds - the bounds of the primitive after action
//     */
//    _updateConnectionPoints:function(oldBounds, newBounds){
//        var oldWidth = oldBounds[2] - oldBounds[0];
//        var oldHeight = oldBounds[3] - oldBounds[1];
//
//        var newWidth = newBounds[2] - newBounds[0];
//        var newHeight = newBounds[3] - newBounds[1];
//
//        var x = oldBounds[0];
//        var y = oldBounds[1];
//
//        var figure = STACK.figureGetById(selectedFigureId);
//        figure.transform(Matrix.translationMatrix(-x, -y));
//        
//        figure.transform(Matrix.scaleMatrix(1 / oldWidth * newWidth, 1 / oldHeight * newHeight));
//
//        figure.transform(Matrix.translationMatrix(x, y));
//
//    },

    /**
     *Get a refence to a context (main, in our case)
     *Use this method when you need access to metrics.
     *@author Alex Gheorghiu <alex@scriptoid.com>
     *TODO:later will move this or use external functions
     **/
    _getContext:function(){
        //WE SHOULD NOT KEEP ANY REFERENCE TO A CONTEXT - serialization pain
        return document.getElementById("a").getContext("2d");
    },


    /**Transform the Text
     *Upon transformation the vector is tranformed but the text remains the same.
     *Later we are gonna use the vector to determine the angle of the text
     *@param {Matrix} matrix - the transformation matrix
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    transform:function(matrix){
        this.vector[0].transform(matrix);
        this.vector[1].transform(matrix);        
    },


    /**
     *Get the angle around the compas between the vector and North direction
     *@return {Number} - the angle in radians
     *@see /documentation/specs/angle_around_compass.jpg
     *@author alex@scriptoid.com
     **/
    getAngle: function(){
        return Util.getAngle(this.vector[0], this.vector[1]);
    },


    /**Returns the width of the text in normal space (no rotation)
     *We need to know the width of each line and then we return the maximum of all widths
     *@author Augustin <cdaugustin@yahoo.com>
     **/
    getNormalWidth:function(){
        var linesText = this.str.split("\n");
        var linesWidth = [];
        var maxWidth = 0;

        //store lines width
        this._getContext().save();
        this._getContext().font = this.size + "px " + this.font;
        for(var i in linesText){
            var metrics = this._getContext().measureText(linesText[i]);
            linesWidth[i] = metrics.width;
        }
        this._getContext().restore();


        //find maximum width
        for(i=0; i<linesWidth.length; i++){
            if(maxWidth < linesWidth[i]){
                maxWidth = linesWidth[i];
            }
        }

        return maxWidth;
    },


    /**Approximates the height of the text in normal space (no rotation)
     *It is based on the size of the font and the line spacing used.
     *@author Augustin <cdaugustin@yahoo.com>
     **/
    getNormalHeight:function(){
        var lines = this.str.split("\n");
        var nrLines = lines.length;
        var totalHeight = 0;

        if (nrLines > 0){
            totalHeight = nrLines * this.size  //height added by lines of text
            + (nrLines - 1) * this.lineSpacing; //height added by inter line spaces
        }

        return totalHeight;
    },


    /**Paints the text
     *@author Augustin <cdaugustin@yahoo.com>
     *@author Alex <alex@scriptoid.com>
     *@author Artyom <artyom.pokatilov@gmail.com>
     **/
    paint:function(context){

        context.save();

        var lines = this.str.split("\n");

//        var noLinesTxt = 0;
//        var txtSizeHeight = this.size;

        // update lineSpacing because it could be changed
        // in dynamic way and we do not watch it
        // TODO: reorganize by deleting lineSpacing at all or by adding get/set methods
        this.lineSpacing = 1 / 4 * this.size;

//        var txtSpaceLines = this.lineSpacing;

//        var txtOffsetY = txtSizeHeight + txtSpaceLines;

        //X - offset
        var offsetX = 0;
        if(this.align == Text.ALIGN_LEFT){
            offsetX = -this.getNormalWidth()/2;
        }
        else if(this.align == Text.ALIGN_RIGHT){
            offsetX = this.getNormalWidth()/2;
        }
        
        //Y - offset
        var offsetY = 0.5 * this.size;

//        switch(this.valign) {
//            case Text.VALIGN_TOP:
//                offsetY = -this.getNormalHeight();
//                break;
//
//            case Text.VALIGN_BOTTOM:
//                offsetY = this.getNormalHeight();
//                break;
//
//            case Text.VALIGN_MIDDLE:
//                offsetY = 0.5 * this.size;
//                break;
//        }

        var angle = Util.getAngle(this.vector[0],this.vector[1]);
        //alert("Angle is + " + angle + ' point 0: ' + this.vector[0] + ' point 1: ' + this.vector[1]);


        //visual debug :D
        if(DIAGRAMO.debug){
            //paint vector
            context.beginPath();
            context.moveTo(this.vector[0].x,this.vector[0].y);
            context.lineTo(this.vector[1].x,this.vector[1].y);
            context.closePath();
            context.stroke();

            //normal bounds (RED)  - as if the normal bounds rotated with the text
            var nBounds = this.getNormalBounds();
            nBounds.transform( Matrix.translationMatrix(-this.vector[0].x,-this.vector[0].y) );
            nBounds.transform(Matrix.rotationMatrix(angle));
            nBounds.transform(Matrix.translationMatrix(this.vector[0].x,this.vector[0].y));
            nBounds.style.strokeStyle = "rgb(250, 34, 35)";
            //alert(this.bounds);
            nBounds.paint(context);

            //text bounds (GREEN) - the actually bounds after a rotation
            context.save();
            context.strokeStyle = "rgb(30, 204, 35)";
            var v = nBounds.getBounds();
            context.beginPath();
            context.moveTo(v[0], v[1]);
            context.lineTo(v[2], v[1]);
            context.lineTo(v[2], v[3]);
            context.lineTo(v[0], v[3]);
            context.closePath();
            context.stroke();
            context.restore();
        }
        context.translate(this.vector[0].x,this.vector[0].y);
        context.rotate(angle);
        context.translate(-this.vector[0].x, -this.vector[0].y);

        //paint lines

        context.fillStyle = this.style.fillStyle;
        context.font = this.size + "px " + this.font;
        context.textAlign = this.align;
        context.textBaseline = "middle";

//        if (this.valign == Text.VALIGN_MIDDLE) {
//            context.textBaseline = "middle";
//        }

        for(var i=0; i<lines.length; i++){
//            Log.info("Line: " + lines[i] + " this.vector[0].x=" + this.vector[0].x + " offsetX=" + offsetX + " this.vector[0].y=" + this.vector[0].y + " offsetY=" + offsetY 
//            + " this.getNormalHeight()=" + this.getNormalHeight() + " this.size=" + this.size + " this.lineSpacing=" + this.lineSpacing);

            // x and y starting coordinates of text lines
            var lineStartX = this.vector[0].x + offsetX;
            var lineStartY = (this.vector[0].y - this.getNormalHeight() / 2 + i * this.size + i * this.lineSpacing) + offsetY;

            context.fillText(
                lines[i],
                lineStartX,
                lineStartY
            );

            if (this.underlined) {
                this.paintUnderline(
                    context,
                    lines[i],
                    lineStartX,
                    lineStartY
                );
            }
            //context.fillText(lines[i], this.vector[0].x, txtOffsetY * noLinesTxt);
            //context.fillText(linesText[i], -this.vector[0].x, txtOffsetY * noLinesTxt);
//            noLinesTxt = noLinesTxt + 1;
        }


        context.restore();

    },


    /**Paints underline for the text.
     * There is no native method of canvas context for now, so we're implementing it by ourselves.
     * Taken and refactored from http://scriptstock.wordpress.com/2012/06/12/html5-canvas-text-underline-workaround/
     * @argument {CanvasRenderingContext2D} context - the Canvas's 2D context
     * @argument {String} text - the text to be underlined
     * @argument {Number} x - the X coordinates of the text
     * @argument {Number} y - the Y coordinated of the the text
     * @author Artyom <artyom.pokatilov@gmail.com>
     **/
    paintUnderline:function(context, text, x, y){
        // text width
        var width = context.measureText(text).width;

        // if text align differs from "left" - add offset to X axis
        // fillText method of canvas context make this automatically
        switch(this.align){
            case "center":
                x -= (width/2);
                break;
            case "right":
                x -= width;
                break;
        }

        // add offset to Y axis equal to half of text size
        y += this.size / 2;

        context.save();

        context.beginPath();
        context.strokeStyle = this.style.fillStyle; // color the same as text
        context.lineWidth = this.size / Text.UNDERLINE_THICKNESS_DIVIDER;   // thickness taken in proportion of text size
        context.moveTo(x,y);
        context.lineTo(x + width, y);
        context.stroke();

        context.restore();
    },


    /**Text should not add it's bounds to any figure...so the figure should
     *ignore any bounds reported by text
     *@return {Array<Number>} - returns [minX, minY, maxX, maxY] - bounds, where
     *  all points are in the bounds.
     **/
    getBounds:function(){
        var angle = Util.getAngle(this.vector[0],this.vector[1]);
        var nBounds = this.getNormalBounds();
        /*if(this.align == Text.ALIGN_LEFT){
            nBounds.transform(Matrix.translationMatrix(this.getNormalWidth()/2,0));
        }
        if(this.align == Text.ALIGN_RIGHT){
            nBounds.transform(Matrix.translationMatrix(-this.getNormalWidth()/2,0));
        }*/
        nBounds.transform(Matrix.translationMatrix(-this.vector[0].x,-this.vector[0].y) );
        nBounds.transform(Matrix.rotationMatrix(angle));
        nBounds.transform(Matrix.translationMatrix(this.vector[0].x,this.vector[0].y));

        return nBounds.getBounds();
    },


    /**Returns the bounds the text might have if in normal space (not rotated)
     *We will keep it as a Polygon
     *@return {Polygon} - a 4 points Polygon
     **/
    getNormalBounds:function(){
        var lines = this.str.split("\n");

        var poly = new Polygon();
        poly.addPoint(new Point(this.vector[0].x - this.getNormalWidth()/2 ,this.vector[0].y - this.getNormalHeight()/2));
        poly.addPoint(new Point(this.vector[0].x + this.getNormalWidth()/2 ,this.vector[0].y - this.getNormalHeight()/2));
        poly.addPoint(new Point(this.vector[0].x + this.getNormalWidth()/2 ,this.vector[0].y + this.getNormalHeight()/2));
        poly.addPoint(new Point(this.vector[0].x - this.getNormalWidth()/2 ,this.vector[0].y + this.getNormalHeight()/2));

        return poly;
    },


    getPoints:function(){
        return [];
    },


    contains: function(x,y){
        var angle = Util.getAngle(this.vector[0],this.vector[1]);
        var nBounds = this.getNormalBounds();
        nBounds.transform( Matrix.translationMatrix(-this.vector[0].x,-this.vector[0].y) );
        nBounds.transform(Matrix.rotationMatrix(angle));
        nBounds.transform(Matrix.translationMatrix(this.vector[0].x,this.vector[0].y));

        // check if (x,y) is inside or on a borders of nBounds
        return nBounds.contains(x,y,true);
    },


    near:function(x, y, radius){
        var angle = Util.getAngle(this.vector[0],this.vector[1]);
        var nBounds = this.getNormalBounds();
        nBounds.transform( Matrix.translationMatrix(-this.vector[0].x,-this.vector[0].y) );
        nBounds.transform(Matrix.rotationMatrix(angle));
        nBounds.transform(Matrix.translationMatrix(this.vector[0].x,this.vector[0].y));

        return nBounds.near(x,y, radius);
    },


    equals:function(anotherText){
        if(!anotherText instanceof Text){
            return false;
        }

        if(
            this.str != anotherText.str
            || this.font != anotherText.font
            || this.size != anotherText.size
            || this.lineSpacing != anotherText.lineSpacing
            || this.size != anotherText.size){
            return false;
        }


        for(var i=0; i<this.vector.length; i++){
            if(!this.vector[i].equals(anotherText.vector[i])){
                return false;
            }
        }

        if(!this.style.equals(anotherText.style)){
            return false;
        }

        //TODO: compare styles too this.style = new Style();
        return true;
    },


    /**Creates a clone of current text*/
    clone: function(){
        var cText = new Text(this.str, this.x, this.y, this.font, this.size, this.outsideCanvas);
        cText.align = this.align;
    
//        cText.valign = this.valign;
        cText.vector = Point.cloneArray(this.vector);
        cText.style = this.style.clone();

        if(!cText.outsideCanvas){
            cText.bounds = this.bounds.clone(); //It's a Polygon (so we can clone it)
        }

        return cText;
        
        /*
        var newText = {};
        for (i in this) {
            if (i == 'vector'){
                newText[i] = Point.cloneArray(this[i]);
                continue;
            }
            if (this[i] && typeof this[i] == "object") {
                newText[i] = this[i].clone();
            } else newText[i] = this[i]
        } return newText;
        */
    },


    toString:function(){
        return 'Text: ' + this.str + ' x:' + this.vector[0].x +  ' y:' + this.vector[0].y;
    },

    /**There are characters that must be escaped when exported to SVG
     *Ex: < (less then) will cause SVG parser to fail
     *@author Alex <alex@scriptoid.com>
     **/
    escapeString:function(s){
        var result = new String(s);
        
        var map = [];
        map.push(['<','&lt;']);

        for(var i = 0; i<map.length; i++){
            result = result.replace(map[i][0], map[i][1]);
        }

        return result;
    },

    /**
     *Convert text to SVG representation 
     *@see <a href="http://www.w3.org/TR/SVG/text.html">http://www.w3.org/TR/SVG/text.html</a>
     *@see <a href="http://tutorials.jenkov.com/svg/text-element.html">http://tutorials.jenkov.com/svg/text-element.html</a> for rotation
     *@see <a href="http://tutorials.jenkov.com/svg/tspan-element.html">http://tutorials.jenkov.com/svg/tspan-element.html</a> for tspan
     *@see <a href="http://tutorials.jenkov.com/svg/svg-transformation.html">http://tutorials.jenkov.com/svg/svg-transformation.html</a> for detailed rotation
     *@see <a href="http://www.w3.org/TR/SVG/coords.html#TransformAttribute">http://www.w3.org/TR/SVG/coords.html#TransformAttribute</a> for a very detailed rotation documentation
     *<p/>
     *@see Also read /documents/specs/text.png
     *@author Alex <alex@scriptoid.com>
     *
     * 
     * Note:
     * The position of the text is determined by the x and y attributes of the <text> element.
     * The x-attribute determines where to locate the left edge of the text (the start of the text).
     * The y-attribute determines where to locate the bottom of the text (not the top).
     * Thus, there is a difference between the y-position of a text and the y-position of lines,
     * rectangles, or other shapes.
     **/
    toSVG: function(){
        /*Example:
          <text x="200" y="150" fill="blue" style="stroke:none; fill:#000000;text-anchor: middle"  transform="rotate(30 200,150)">
              You are not a banana.
          </text>
        */

        var angle = this.getAngle() * 180 / Math.PI;
        var height = this.getNormalHeight();

        //X - offset
        var offsetX = 0;
        var alignment = 'middle';
        if(this.align == Text.ALIGN_LEFT){
            offsetX = -this.getNormalWidth()/2;
            alignment = 'start';
        }
        else if(this.align == Text.ALIGN_RIGHT){
            offsetX = this.getNormalWidth()/2;
            alignment = 'end';
        }

        //svg alignment
//        if(this.align)

        //general text tag
        var result = "\n" + repeat("\t", INDENTATION) + '<text y="' + (this.vector[0].y - height/2) + '" ';
        result += ' transform="rotate(' + angle + ' ' + this.vector[0].x + ' ,' + this.vector[0].y + ')" ';
        result += ' font-family="' + this.font + '" ';
        result += ' font-size="' + this.size + '" ';

        /**
         *We will extract only the fill properties from Style, also we will not use
         *Note: The outline color of the font. By default text only has fill color, not stroke.
         *Adding stroke will make the font appear bold.*/
        if(this.style.fillStyle != null){
//            result += ' stroke=" ' + this.style.fillStyle + '" ';
            result += ' fill=" ' + this.style.fillStyle + '" ';
        }
        result += ' text-anchor="' + alignment + '" ';
        result +=  '>';

        INDENTATION++;

        //any line of text (tspan tags)
        var lines = this.str.split("\n");
        for(var i=0; i< lines.length; i++){
            var dy = parseFloat(this.size);
            if(i > 0){
                dy += parseFloat(this.lineSpacing);
            }
            
            //alert('Size: ' + this.size + ' ' + (typeof this.size) + ' lineSpacing:' + this.lineSpacing + ' dy: ' + dy);
            result += "\n" + repeat("\t", INDENTATION) + '<tspan x="' + (this.vector[0].x + offsetX) + '" dy="' + dy  + '">' + this.escapeString(lines[i]) + '</tspan>'
        } //end for
        
        INDENTATION--;
        
        //result += this.str;
        result += "\n" + repeat("\t", INDENTATION) + '</text>';

        if(this.debug){
            result += "\n" + repeat("\t", INDENTATION) + '<circle cx="' + this.vector[0].x + '" cy="' + this.vector[0].y + '" r="3" style="stroke: #FF0000; fill: yellow;" '
            + ' transform="rotate(' + angle + ' ' + this.vector[0].x + ' ,' + this.vector[0].y + ')" '
            + '/>';
        
            result += "\n" + repeat("\t", INDENTATION) + '<circle cx="' + this.vector[0].x + '" cy="' + (this.vector[0].y - height/2) + '" r="3" style="stroke: #FF0000; fill: green;" '
            + ' transform="rotate(' + angle + ' ' + this.vector[0].x + ' ,' + this.vector[0].y + ')" '
            + ' />';
        }
        
        return result;
       
    }

}



