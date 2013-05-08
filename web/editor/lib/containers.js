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
    
    
    /**We keep the figure position by having different points
     *[central point of the figure, the middle of upper edge]
     * An {Array} or {@link Point}s
     **/
    //TODO: These coordinates are no necessary as we already have topLeft and bottomRight
    //but this will request changes to code for Container to work
    this.rotationCoords = [
        new Point( (this.topLeft.x + this.bottomRight.x) / 2, (this.topLeft.y + this.bottomRight.y)/2),
        new Point( (this.topLeft.x + this.bottomRight.x) / 2, this.topLeft.y)
    ];    
    
    //SHAPE - or decoration of the container
    var headerHeight = 20;
    
    //HEADER
    var header = new Path();
    var hBottomRight = new Point(this.bottomRight.x, this.topLeft.y + headerHeight);
    var roundness = 10;   
    var l1 = new Line(
            new Point(this.topLeft.x, hBottomRight.y),
            new Point(this.topLeft.x, this.topLeft.y + roundness)
        );

    var c1 = new QuadCurve(           
            new Point(this.topLeft.x, this.topLeft.y + roundness),
            new Point(this.topLeft.x, this.topLeft.y),
            new Point(this.topLeft.x + roundness, this.topLeft.y)
        );

    var l2 = new Line(
            new Point(this.topLeft.x + roundness, this.topLeft.y),
            new Point(hBottomRight.x - roundness, this.topLeft.y)
        );

    var c2 = new QuadCurve(
            new Point(hBottomRight.x - roundness, this.topLeft.y),
            new Point(hBottomRight.x, this.topLeft.y),
            new Point(hBottomRight.x, this.topLeft.y + roundness)
        );

    var l3 = new Line(
            new Point(hBottomRight.x, this.topLeft.y + roundness),
            new Point(hBottomRight.x, hBottomRight.y)
        );
            
    var l4 = new Line(
            new Point(hBottomRight.x, hBottomRight.y),
            new Point(this.topLeft.x, hBottomRight.y)
        );

    
        
    header.addPrimitive(l1);
    header.addPrimitive(c1);
    header.addPrimitive(l2);
    header.addPrimitive(c2);
    header.addPrimitive(l3);    
    header.addPrimitive(l4);    
    
    this.primitives.push(header);

//    var header = new Polygon();            
//    header.addPoint(new Point(this.topLeft.x, this.topLeft.y));
//    header.addPoint(new Point(this.topLeft.x, this.topLeft.y + headerSize));
//    header.addPoint(new Point(this.bottomRight.x, this.topLeft.y + headerSize));
//    header.addPoint(new Point(this.bottomRight.x, this.topLeft.y));
//    this.primitives.push(header);    
    
    this.properties.push(new BuilderProperty('Stroke Style', 'primitives.0.style.strokeStyle', BuilderProperty.TYPE_COLOR));
    this.properties.push(new BuilderProperty('Fill Style', 'primitives.0.style.fillStyle', BuilderProperty.TYPE_COLOR));
    this.properties.push(new BuilderProperty('Line Width', 'primitives.0.style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    
    //CONTAINER
    var actualContainer = new Path();
    var l = new Line(
            new Point(this.topLeft.x, this.topLeft.y + headerHeight),
            new Point(this.bottomRight.x, this.topLeft.y + headerHeight)
        );
    actualContainer.addPrimitive(l);
    
    l = new Line(
            new Point(this.bottomRight.x, this.topLeft.y + headerHeight),
            new Point(this.bottomRight.x, this.bottomRight.y - roundness)
        );
    actualContainer.addPrimitive(l);
    
    var c = new QuadCurve(
            new Point(this.bottomRight.x, this.bottomRight.y - roundness),
            new Point(this.bottomRight.x, this.bottomRight.y),
            new Point(this.bottomRight.x - roundness, this.bottomRight.y)
        );
    actualContainer.addPrimitive(c);
    
    l = new Line(
            new Point(this.bottomRight.x - roundness, this.bottomRight.y),
            new Point(this.topLeft.x + roundness, this.bottomRight.y)
        );
    actualContainer.primitives.push(l);
    
    var c = new QuadCurve(
            new Point(this.topLeft.x + roundness, this.bottomRight.y),
            new Point(this.topLeft.x, this.bottomRight.y),
            new Point(this.topLeft.x, this.bottomRight.y - roundness)
        );
    actualContainer.addPrimitive(c);
    
    l = new Line(
            new Point(this.topLeft.x, this.bottomRight.y - roundness),
            new Point(this.topLeft.x, this.topLeft.y + headerHeight)
        );
    actualContainer.primitives.push(l);    
    
    this.primitives.push(actualContainer);    
    
    this.properties.push(new BuilderProperty('Stroke Style', 'primitives.1.style.strokeStyle', BuilderProperty.TYPE_COLOR));
    this.properties.push(new BuilderProperty('Fill Style', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    this.properties.push(new BuilderProperty('Line Width', 'primitives.1.style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    
    
    
    
    //TITLE
    var title = new Text("Container", (this.topLeft.x + this.bottomRight.x)/2, this.topLeft.y + Text.DEFAULT_SIZE /*@see https://bitbucket.org/scriptoid/diagramo/issue/31/text-vertical-aligment*/, Text.FONTS[0], Text.DEFAULT_SIZE, false);
//    title.debug = true;
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
        
        //some figures dont have rotation coords, i.e. those that arent "real" figures, such as the highlight rectangle
        if(this.rotationCoords.length != 0){
            this.rotationCoords[0].transform(matrix);
            this.rotationCoords[1].transform(matrix);
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

};

/** Creates the link between a {Container} and a {Figure}
 * As relation between Container and Figure is a 1-to-many (at least now)
 * we will use this class to represent the link
 * 
 * @constructor
 * @this {ContainerFigure}
 * @param {Number} containerId the id of the {Container}
 * @param {Number} figureId the id of the {Figure}
 * @author Alex
 */
function ContainerFigure(containerId, figureId) {
    this.containerId = containerId;
    
    this.figureId = figureId;
}


ContainerFigure.prototype = {
    constructor: ContainerFigure        
};

function ContainerFigureManager() {
    /**An {Array} of [containerId, figureId] */
    this.data = [];            
}

ContainerFigureManager.prototype = {
    constructor: ContainerFigure,
    
    /**Adds a figure to a container
     * @param {Number} containerId the id of the {Container}
     * @param {Number} figureId the id of the {Figure}
     * */
    addFigure : function(containerId, figureId){
        var i;
        var v;
        var present = false;
        
        //Test to see if figure is in ANY container ad a figure should be present in ONLY ONE container
        for(i in this.data){
            v = this.data[i];
            if(v[1] === figureId){
                present = true;
                break;
            }
        }
        
        if(!present){
            this.data.push([containerId, figureId]);
        }
    },
         
    /**Removes a figure from a container
     * @param {Number} containerId the id of the {Container}
     * @param {Number} figureId the id of the {Figure}
     * */
    removeFigure : function(containerId, figureId){
        var i;
        var v;
        var index = -1;
        
        for(i in this.data){
            v = this.data[i];
            if(v[0] === containerId && v[1] === figureId){
                index = i;
                break;
            }
        }
        
        if(index !== -1){
            this.data.splice(index, 1);
        }
    },
    
    /**Get all {Figure}s' ids that live inside a container
     * @param {Number} containerId the id of the {Container}
     * @return {Array}{Number} an array of Figure id
     * @author Alex
     * */
    getAllFigures : function(containerId){
        var i;
        var figureIds = [];
        
        for(i in this.data){
            var v = this.data[i];
            if(v[0] === containerId){
                figureIds.push(v[1]);
            }
        }
        
        return figureIds;
    },
          
    /**Check if a figure is inside a container
     * @param {Number} containerId the id of the {Container}
     * @param {Number} figureId the id of the {Figure}
     * @return {Boolean} true - if figure is inside a container
     * */        
    isFigureInContainer : function(containerId, figureId){
        var i;
        var v;
        var present = false;
        
        for(i in this.data){
            v = this.data[i];
            if(v[0] === containerId && v[1] === figureId){
                present = true;
                break;
            }
        }
        
        return present;
    },
    
    
    /**Check if a figure is inside a container
     * @param {Number} figureId the id of the {Figure}
     * @return {Number} containerId the id of the {Container} or -1 if none found
     * */        
    getContainerForFigure : function(figureId){
        var i;
        var v;
        var containerId = -1;
        
        for(i in this.data){
            v = this.data[i];
            if( v[1] === figureId){
                containerId = v[0];
                break;
            }
        }
        
        return containerId;
    }
    
};

/**Creates a {ContainerFigureManager} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {ContainerFigureManager} a newly constructed ContainerFigureManager
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
ContainerFigureManager.load = function(o){
    var containerFigureManager = new ContainerFigureManager(); //empty constructor
    
    //TODO: it should work....not tested
    containerFigureManager.data = o.data; 

    return containerFigureManager;
};