/** Container holds one or more figure into a visual (and probably conceptual)
 * unit
 * 
 * @constructor
 * @this {Container}
 * @param {Number} id the id of the Container
 * @param {Point} topLeft top left {Point}
 * @param {Point} bottomRight bottom right {Point}
 * @author Alex
 */
function Container(id, topLeft, bottomRight) {
    /**Group's id*/
    if(id){
        this.id = id;
    }
    else{
        this.id = STACK.generateId();
    }
    
    /**The {@link Style} of the polygon*/
    this.style = new Style();
    this.style.strokeStyle = "#000000";
    this.style.fillStyle = "#F9F8F6";
    
    this.topLeft = topLeft.clone();
    this.bottomRight = bottomRight.clone();        
    
    /**An {Array} of primitives that make the figure*/
    this.primitives = [];
    
    /**An {Array} of primitives*/
    this.properties = [];
    
    //SHAPE - or decoration of the container
    var headerSize = 20;
    
    //HEADER
    var header = new Polygon();            
    header.addPoint(new Point(this.topLeft.x, this.topLeft.y));
    header.addPoint(new Point(this.topLeft.x, this.topLeft.y + headerSize));
    header.addPoint(new Point(this.bottomRight.x, this.topLeft.y + headerSize));
    header.addPoint(new Point(this.bottomRight.x, this.topLeft.y));
    this.primitives.push(header);    
    
    this.properties.push(new BuilderProperty('Stroke Style', 'primitives.0.style.strokeStyle', BuilderProperty.TYPE_COLOR));
    this.properties.push(new BuilderProperty('Fill Style', 'primitives.0.style.fillStyle', BuilderProperty.TYPE_COLOR));
    this.properties.push(new BuilderProperty('Line Width', 'primitives.0.style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    
    //CONTAINER
    var actualContainer = new Polygon();
    actualContainer.addPoint(new Point(this.topLeft.x, this.topLeft.y + headerSize));
    header.addPoint(new Point(this.bottomRight.x, this.topLeft.y + headerSize));
    header.addPoint(new Point(this.bottomRight.x, this.bottomRight.y));
    header.addPoint(new Point(this.topLeft.x, this.bottomRight.y)); 
    header.addPoint(new Point(this.topLeft.x, this.topLeft.y + headerSize)); 
    this.primitives.push(actualContainer);    
    
    this.properties.push(new BuilderProperty('Stroke Style', 'primitives.1.style.strokeStyle', BuilderProperty.TYPE_COLOR));
    this.properties.push(new BuilderProperty('Fill Style', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    this.properties.push(new BuilderProperty('Line Width', 'primitives.1.style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    
    
    
    
    //TITLE
    var title = new Text("Container", (this.topLeft.x + this.bottomRight.x)/2, this.topLeft.y, Text.FONTS[0], Text.DEFAULT_SIZE, false);
    title.style.fillStyle = '#000000';
    this.primitives.push(title);
    
    this.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    this.properties.push(new BuilderProperty('Text', 'primitives.2.str', BuilderProperty.TYPE_TEXT));
    this.properties.push(new BuilderProperty('Text Size', 'primitives.2.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    this.properties.push(new BuilderProperty('Font', 'primitives.2.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    this.properties.push(new BuilderProperty('Alignment', 'primitives.2.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    this.properties.push(new BuilderProperty('Text Color', 'primitives.2.style.fillStyle', BuilderProperty.TYPE_COLOR));
    

    /**Serialization type*/
    this.oType = 'Container';
}

Container.prototype = {
    constructor: Container,
            
            
    /**Paint the container into certain context
     * @param {Context2D} context - the context where to paint the container
     */
    paint: function(context) {
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

            context.restore();
        }
    },
        
    transform: function(matrix) {
        //throw "container:transform() Not implemented";
        if(this.style != null){
            this.style.transform(matrix);
        }
        
        this.bottomRight.transform(matrix);
        this.topLeft.transform(matrix);
        
        for(var i = 0; i<this.primitives.length; i++ ){
            this.primitives[i].transform(matrix);
        }
    },
        
        
    /**See if a container contains a point
     *@param {Number} x - the x coordinate of the point
     *@param {Number} y - the y coordinate of the point
     **/
    contains: function(x, y) {
        var topRight = new Point(this.bottomRight.x, this.topLeft.y);
        var bottomLeft = new Point(this.topLeft.x, this.bottomRight.y);
        return Util.isPointInside(new Point(x,y),[this.topLeft, topRight, this.bottomRight, bottomLeft]);
    },
        
        
    /***/
    equals: function(c) {
        throw "container:equals() Not implemented";
    },
        
        
    toString: function() {
        return "Container " + this.id + " topLeft: " + this.topLeft + " bottomRight:" + this.bottomRight;
    },
        
        
    clone: function() {
        throw "container:clone() Not implemented";
    },
        
    /**
     * @return {Array<Number>} - returns [minX, minY, maxX, maxY] - bounds, where
     *  all points are in the bounds.
     */    
    getBounds: function() {
        return Util.getBounds([this.bottomRight, this.topLeft]);
    },
        
    /**Detects if */
    onEdge : function(theX, theY){
        var topRight = new Point(this.bottomRight.x, this.topLeft.y);
        var bottomLeft = new Point(this.topLeft.x, this.bottomRight.y);
        
        var edge = new Polygon();
        edge.points = [this.topLeft, topRight, this.bottomRight, bottomLeft];
        
        return edge.near(theX, theY, 3);
    },
        
        
    near: function() {
        throw "container:near() Not implemented";
    },
        
        
    getPoints: function() {
        throw "container:getPoints() Not implemented";
    }

}

