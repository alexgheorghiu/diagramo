/**
 * A wrapper for canvas element. This should only used to save / store canvas' properties
 * 
 * @constructor
 * @this {Builder}
 * @param {Number} width - the width of the {Canvas}
 * @param {Number} height - the height of the {Canvas}
 * @author Zack Newsham <zack_newsham@yahoo.co.uk>
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function CanvasProps(width, height){    
    /**Canvas width*/
    this.width = width;
    /**Canvas height*/
    this.height = height;
    /**Canvas id. Used in main.js:updateShape() to see what object we have*/
    this.id = "canvasProps"; //
    /**Serialization type*/
    this.oType = 'CanvasProps';
}

/**default height for canvas*/
CanvasProps.DEFAULT_HEIGHT = 600; 

/**default width for canvas*/
CanvasProps.DEFAULT_WIDTH = 800; 

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

    canvasprops.height = o.height;
    canvasprops.width = o.width;

    return canvasprops;
}


CanvasProps.prototype = {
    
    constructor : CanvasProps,
    
    /**Just clone the damn thing :)*/
    clone : function(){
       return new CanvasProps(this.width, this.height);
    },
    
    /**Get width of the canvas*/
    getWidth:function(){
        return this.width;
    },


    /**
     * Set the width of the canvas. Also force a canvas resize
     * @param {Numeric} width - the new width
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
     *  @param {Numeric} height - the new height
     */
    setHeight:function(height){//required for undo
        this.height = height;
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

        //whenever we change a detail of the width of the canvas, we need to update the map
        minimap.initMinimap();
    },

    /**Returns a representation of the object
     *@return {String}
     **/
    toString: function(){
       return "CanvasProp [width: " + this.width + " height: " + this.height + ' ]';
    }
}

