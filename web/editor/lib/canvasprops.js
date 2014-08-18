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

/**
 * A wrapper for canvas element. This should only used to save / store canvas' properties
 * 
 * @constructor
 * @this {Builder}
 * @param {Number} width - the width of the {Canvas}
 * @param {Number} height - the height of the {Canvas}
 * @param {String} fillColor - the fill color of the {Canvas}
 * @author Zack Newsham <zack_newsham@yahoo.co.uk>
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function CanvasProps(width, height, fillColor){
    /**Canvas width*/
    this.width = width;
    /**Canvas height*/
    this.height = height;
    /**Canvas fill color*/
    this.fillColor = fillColor;
    /**Canvas id. Used in main.js:updateShape() to see what object we have*/
    this.id = "canvasProps"; //
    /**Serialization type*/
    this.oType = 'CanvasProps';
}

/**default height for canvas*/
CanvasProps.DEFAULT_HEIGHT = 600; 

/**default width for canvas*/
CanvasProps.DEFAULT_WIDTH = 800;

/**default fill color for canvas*/
CanvasProps.DEFAULT_FILL_COLOR = "#ffffff";

/**
 *We only ever have one instance of this class (like STACK)
 *but we need the creation of the Canvas to appear AFTER the page exists,
 *otherwise we would not be able to add it dinamically to the document.
 *@param {JSONObject} o
 *@return new {Canvas}
 *@author Zack Newsham <zack_newsham@yahoo.co.uk>
 *@author Alex Gheorghiu <alex@scriptoid.com>
 */
CanvasProps.load = function(o){
    var canvasprops = new CanvasProps();

    var tempVal = Number(o.height);
    canvasprops.height = !isNaN(tempVal) ? tempVal : CanvasProps.DEFAULT_HEIGHT;

    tempVal = Number(o.width);
    canvasprops.width = !isNaN(tempVal) ? tempVal : CanvasProps.DEFAULT_WIDTH;

    canvasprops.fillColor = o.fillColor;

    return canvasprops;
}


CanvasProps.prototype = {
    
    constructor : CanvasProps,
    
    /**Just clone the damn thing :)*/
    clone : function(){
       return new CanvasProps(this.width, this.height, this.fillColor);
    },
    
    /**Get width of the canvas*/
    getWidth:function(){
        return this.width;
    },


    /**
     * Set the width of the canvas. Also force a canvas resize
     * @param {Number} width - the new width
     */
    setWidth:function(width){//required for undo
        this.width = width;
        this.sync();
    },


    /**Return the height of the canvas*/
    getHeight:function(){
        return this.height;
    },


    /**
     * Set the height of the canvas. Also force a Canvas resize
     *  @param {Number} height - the new height
     */
    setHeight:function(height){//required for undo
        this.height = height;
        this.sync();
    },


    /**Return the fill color of the canvas*/
    getFillColor:function(){
        return this.fillColor;
    },


    /**
     * Set the fill color of the canvas. Also force a Canvas sync
     *  @param {String} fillColor - the new height
     */
    setFillColor:function(fillColor){//required for undo
        this.fillColor = fillColor;
        this.sync();
    },


    /**
     *Resize the Canvas to current values
     *@author alex@scriptoid.com
     **/
    sync:function() {
        var canvas = getCanvas();
        
        canvas.height = this.height;
        canvas.width = this.width;
        canvas.fillColor = this.fillColor;

        //whenever we change a detail of the width of the canvas, we need to update the map
        minimap.initMinimap();
		
        //also the background //TODO: move it someplace else
        backgroundImage = null;
    },

    /**Returns a representation of the object
     *@return {String}
     **/
    toString: function(){
       return "CanvasProp [width: " + this.width + " height: " + this.height + " fillColor: " + this.fillColor + ' ]';
    }
};

