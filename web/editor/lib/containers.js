/** Container holds one or more figure into a visual (and probably conceptual)
 * unit
 * 
 * @constructor
 * @this {Container}
 * @param {Point} topLeft top left {Point}
 * @param {Point} bottomRight bottom right {Point}
 * @author Alex
 */
function Container(topLeft, bottomRight) {
    /**The {@link Style} of the polygon*/
    this.style = new Style();
    this.style.strokeStyle = "#000000";
    
    this.topLeft = topLeft.clone();
    this.bottomRight = bottomRight.clone();

    /**Serialization type*/
    this.oType = 'Container';
}

Container.prototype = {
    constructor: Container,
            
            
    /**Paint the container into certain context
     * @param {Context2D} context - the context where to paint the container
     */
    paint: function(context) {
        context.beginPath();

        if (this.style != null) {
            this.style.setupContext(context);
        }

        context.moveTo(this.topLeft.x, this.topLeft.y);
        context.lineTo(this.bottomRight.x, this.topLeft.y);
        context.lineTo(this.bottomRight.x, this.bottomRight.y);
        context.lineTo(this.topLeft.x, this.bottomRight.y);

        closePath();

        //fill current path
        if (this.style.fillStyle != null && this.style.fillStyle != "") {
            fill();
        }

        //stroke current path 
        if (this.style.strokeStyle != null && this.style.strokeStyle != "") {
            stroke();
        }
    },
        
    transform: function(matrix) {
        throw "Not implemented";
    },
        
        
    /**See if a container contains a point
     *@param {Number} x - the x coordinate of the point
     *@param {Number} y - the y coordinate of the point
     **/
    contains: function(x, y) {
        throw "Not implemented";
    },
        
        
    /***/
    equals: function(c) {
        throw "Not implemented";
    },
        
        
    toString: function() {
        throw "Not implemented";
    },
        
        
    clone: function() {
        throw "Not implemented";
    },
        
        
    getBounds: function() {
        throw "Not implemented";
    },
        
        
    near: function() {
        throw "Not implemented";
    },
        
        
    getPoints: function() {
        throw "Not implemented";
    }

}

