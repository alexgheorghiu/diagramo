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
    if(id == null){
        this.id = STACK.generateId();        
    }
    else{
        this.id = id;
    }
    
    this.topLeft = topLeft.clone();
    this.bottomRight = bottomRight.clone();        

    /**An {Array} of primitives that make the figure*/
    this.primitives = [];
    
    /**An {Array} of primitives*/
    this.properties = [];

    /**The {@link Style} of the polygon*/
    this.style = new Style();
    this.style.strokeStyle = "#000000";
    this.style.fillStyle = "#F9F8F6";
    this.style.lineStyle = Style.LINE_STYLE_CONTINOUS;
    this.style.gradientBounds = this.getBounds();

    
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

    // figure's path
    var containerPath = new Path();

    //HEADER
    var hBottomRight = new Point(this.bottomRight.x, this.topLeft.y + headerHeight);
    var roundness = 10;

    var l1 = new Line(
            new Point(this.topLeft.x, hBottomRight.y),
            new Point(this.topLeft.x, this.topLeft.y + roundness)
        );
    containerPath.addPrimitive(l1);

    var c1 = new QuadCurve(           
            new Point(this.topLeft.x, this.topLeft.y + roundness),
            new Point(this.topLeft.x, this.topLeft.y),
            new Point(this.topLeft.x + roundness, this.topLeft.y)
        );
    containerPath.addPrimitive(c1);

    var l2 = new Line(
            new Point(this.topLeft.x + roundness, this.topLeft.y),
            new Point(hBottomRight.x - roundness, this.topLeft.y)
        );
    containerPath.addPrimitive(l2);

    var c2 = new QuadCurve(
            new Point(hBottomRight.x - roundness, this.topLeft.y),
            new Point(hBottomRight.x, this.topLeft.y),
            new Point(hBottomRight.x, this.topLeft.y + roundness)
        );
    containerPath.addPrimitive(c2);

    var l3 = new Line(
            new Point(hBottomRight.x, this.topLeft.y + roundness),
            new Point(hBottomRight.x, hBottomRight.y)
        );
    containerPath.addPrimitive(l3);


    //BODY
    var l = new Line(
            new Point(this.topLeft.x, this.topLeft.y + headerHeight),
            new Point(this.bottomRight.x, this.topLeft.y + headerHeight)
        );
    containerPath.addPrimitive(l);
    
    l = new Line(
            new Point(this.bottomRight.x, this.topLeft.y + headerHeight),
            new Point(this.bottomRight.x, this.bottomRight.y - roundness)
        );
    containerPath.addPrimitive(l);
    
    var c = new QuadCurve(
            new Point(this.bottomRight.x, this.bottomRight.y - roundness),
            new Point(this.bottomRight.x, this.bottomRight.y),
            new Point(this.bottomRight.x - roundness, this.bottomRight.y)
        );
    containerPath.addPrimitive(c);
    
    l = new Line(
            new Point(this.bottomRight.x - roundness, this.bottomRight.y),
            new Point(this.topLeft.x + roundness, this.bottomRight.y)
        );
    containerPath.primitives.push(l);
    
    c = new QuadCurve(
            new Point(this.topLeft.x + roundness, this.bottomRight.y),
            new Point(this.topLeft.x, this.bottomRight.y),
            new Point(this.topLeft.x, this.bottomRight.y - roundness)
        );
    containerPath.addPrimitive(c);
    
    l = new Line(
            new Point(this.topLeft.x, this.bottomRight.y - roundness),
            new Point(this.topLeft.x, this.topLeft.y + headerHeight)
        );
    containerPath.primitives.push(l);


    this.addPrimitive(containerPath);

    this.properties.push(new BuilderProperty('Stroke Style', 'style.strokeStyle', BuilderProperty.TYPE_COLOR));
    this.properties.push(new BuilderProperty('Fill Style', 'style.fillStyle', BuilderProperty.TYPE_COLOR));
    this.properties.push(new BuilderProperty('Line Width', 'style.lineWidth',BuilderProperty.TYPE_LINE_WIDTH));
    this.properties.push(new BuilderProperty('Line Style', 'style.lineStyle',BuilderProperty.TYPE_LINE_STYLE));
    
    //TITLE
    var title = new Text("Container", (this.topLeft.x + this.bottomRight.x)/2, this.topLeft.y + Text.DEFAULT_SIZE /*@see https://bitbucket.org/scriptoid/diagramo/issue/31/text-vertical-aligment*/, Text.FONTS[0].Text, Text.DEFAULT_SIZE, false);
//    title.debug = true;
    title.style.fillStyle = '#000000';
    this.addPrimitive(title);
    
//    this.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    this.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    this.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    this.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    this.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    this.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    this.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    

    /**Serialization type*/
    this.oType = 'Container';
}

/**Creates a new {Array} of {Container}s out of JSON parsed object
 *@param {JSONObject} v - the JSON parsed object
 *@return {Array} of newly constructed {Container}s
 *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 **/
Container.loadArray = function(v){
    var newContainers = [];
    var containerLength = v.length;

    for(var i = 0; i < containerLength; i++){
        newContainers.push(Container.load(v[i]));
    }

    return newContainers;
}

/**Creates a new {Container} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Container} a newly constructed Container
 *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 **/
Container.load = function(o){
    // parse first topLeft and bottomRight points from JSON
    var topLeft = Point.load(o.topLeft);
    var bottomRight = Point.load(o.bottomRight);

    var newContainer = new Container(Number(o.id), topLeft, bottomRight);
    newContainer.primitives = [];
    for(var i=0; i< o.primitives.length; i++){
        var primitive = Util.loadPrimitive(o.primitives[i]);
        if (primitive != null) {
            newContainer.addPrimitive(primitive);
        }
    }

    newContainer.style = Style.load(o.style);
    newContainer.properties = BuilderProperty.loadArray(o.properties);
    newContainer.rotationCoords = Point.loadArray(o.rotationCoords);

    return newContainer;
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


    equals:function(anotherFigure){
        if( !(anotherFigure instanceof Container) ){
            Log.info("Container:equals() 0");
            return false;
        }

        //test primitives
        if(this.primitives.length == anotherFigure.primitives.length){
            for(var i=0; i<this.primitives.length; i++){
                if(!this.primitives[i].equals(anotherFigure.primitives[i])){
                    Log.info("Container:equals() 1");
                    return false;
                }
            }
        }
        else{
            Log.info("Container:equals() 2");
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

        return true;
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
    },

    addPrimitive:function(primitive){
        // add id property to primitive equal its index
        primitive.id = this.primitives.length;

        this.primitives.push(primitive);
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



/**Manages the relation between containers and figures.
 * The figures and containers are stored in {Stack}
 * but the relationship between them are stored inside {ContainerFigureManager}
 * @constructor
 * @this {ContainerFigure}
 * */
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
    },

    equals:function (anotherManager){
        if ( !(anotherManager instanceof ContainerFigureManager) ) {
            Log.info("ContainerFigureManager:equals() 0");
            return false;
        }

        // test data
        if(this.data.length === anotherManager.data.length){
            for(var i = 0; i < this.data.length; i++){
                if(this.data[i][0] !== anotherManager.data[i][0]
                || this.data[i][1] !== anotherManager.data[i][1]){
                    Log.info("ContainerFigureManager:equals() 1");
                    return false;
                }
            }
        }
        else{
            Log.info("ContainerFigureManager:equals() 2");
            return false;
        }

        return true;
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
    containerFigureManager.data = [];

    var dataLength = o.data.length;
    for (var i = 0; i < dataLength; i++) {
        var newData = [  // convert value to Number
            Number(o.data[i][0]),
            Number(o.data[i][1])
        ];
        containerFigureManager.data.push(newData);
    }

    return containerFigureManager;
};