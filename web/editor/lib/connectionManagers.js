/**
 * It manages all the Connectors on a diagram
 * 
 * @constructor
 * @this {ConnectorManager}
 **/
function ConnectorManager(){
    /**An {Array} of {Connector}s. Keeps all Connectors from canvas*/
    this.connectors = [];
    
    /**An {Array} of {ConnectionPoint}s. Keeps all ConnectionPoints from canvas*/
    this.connectionPoints = []; 
    
    /**Used to generate unique IDs for ConnectionPoint*/
    this.connectionPointCurrentId = 0; //

    /**An {Array} of {Glue}s. Keeps all Glues from canvas*/
    this.glues = [];

    /** Tells in what mode are we:
     * 0 = disabled
     * 1 = choosing first location (creation)
     * 2 = choosing second location (creation)
     * 3 = dragging connector
     */
    this.connectionMode = ConnectorManager.MODE_DISABLED;
}


/**Creates a {ConnectorManager} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {ConnectorManager} a newly constructed ConnectorManager
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
ConnectorManager.load = function(o){
    var newConnectionManager = new ConnectorManager(); //empty constructor

    var localLog = '';

    //1 - load connectors
    localLog += '\nCONNECTORS';
    newConnectionManager.connectors = Connector.loadArray(o.connectors);    
//    newConnectionManager.connectorSelectedIndex = o.connectorSelectedIndex;
    for(var i=0;i<newConnectionManager.connectors.length;i++){
        localLog += '\n' + newConnectionManager.connectors[i].toString();
    }

    //2 - load connection points
    localLog += '\nCONNECTION POINTS';
    newConnectionManager.connectionPoints = ConnectionPoint.loadArray(o.connectionPoints);
    for(var i=0;i<newConnectionManager.connectionPoints.length; i++){
        localLog += "\n" +  newConnectionManager.connectionPoints[i].toString();
    }
    //alert(str);
    
//    newConnectionManager.connectionPointSelectedIndex = o.connectionPointSelectedIndex;
    newConnectionManager.connectionPointCurrentId = o.connectionPointCurrentId;


    //3 - load glues
    localLog += '\nGLUES';
    newConnectionManager.glues = Glue.loadArray(o.glues);
    
    //localLog += 'Connection manager has ' + newConnectionManager.glues.length + " glues";
    for(var i=0;i<newConnectionManager.glues.length; i++){
        localLog += "\n" +  newConnectionManager.glues[i].toString();
    }
    
    //alert(localLog);
    
    newConnectionManager.connectionMode = o.connectionMode;

    return newConnectionManager ;
}

ConnectorManager.prototype = {
    
    constructor : ConnectorManager,
    
    /**
     *Performs a deeps equals
     *@param {ConnectorManager} anotherConnectionManager - the other object to compare against
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    equals : function(anotherConnectionManager){
        if(!anotherConnectionManager instanceof ConnectorManager){
            return false;
        }

        //test Connectors
        for(var i=0; i<this.connectors.length; i++){
            if(!this.connectors[i].equals(anotherConnectionManager.connectors[i])){
                return false;
            }
        }

        //test ConnectionPoints
        for(var i=0; i<this.connectionPoints.length; i++){
            if(!this.connectionPoints[i].equals(anotherConnectionManager.connectionPoints[i])){
                return false;
            }
        }

        //test Glues
        for(var i=0; i<this.glues.length; i++){
            if(!this.glues[i].equals(anotherConnectionManager.glues[i])){
                return false;
            }
        }



        return this.connectionPointCurrentId == anotherConnectionManager.connectionPointCurrentId
        && this.connectionMode == anotherConnectionManager.connectionMode;
    },


    /**Export the entire ConnectionManager to SVG format*/
    toSVG : function(){
        var r = '';
        
        for(var i=0; i<this.connectors.length; i++){
            r += this.connectors[i].toSVG();
        }

        return r;
    },

    /****************************************************************/
    /**************************Connector*****************************/
    /****************************************************************/
    
    /** 
     * Creates a new connector. Also store the connector into the pool of connectors.
     * 
     * @param {Point} startPoint
     * @param {Point} endPoint
     * @param {String} type of Connector. It can be either 'straight' or 'jagged'
     * @return {Number} the id of the newly created Connector
     */
    connectorCreate:function(startPoint,endPoint,type){
        //get a new id for Connector
        var id = STACK.currentId++;

        //create and save connector
        this.connectors.push(new Connector(startPoint,endPoint,type, id));

        //create ConnectionPoints for Connector
        this.connectionPointCreate(id, startPoint, ConnectionPoint.TYPE_CONNECTOR);
        this.connectionPointCreate(id, endPoint, ConnectionPoint.TYPE_CONNECTOR);

        //log
        var c = this.connectorGetById(id);
        //alert('log:connectorCreate: connector has ' + c.turningPoints.length);

        return id;
    },


    /**
     * Remove a connector and all other objects( ConnectionPoints, Glues) linked to it
     * @param {Connector} connector - the connector you want to remove
     */
    connectorRemove:function(connector){
        this.connectorRemoveById(connector.id, true);
    },


    /**
     *Remove a connector by Id
     *@param {Number} connectorId - the {Connector}'s id
     *@param {Boolean} cascade - if cascade is true it will delete the (linked) ConnectionPoints and Glues
     */
    connectorRemoveById:function(connectorId, cascade){
        
        if(cascade){
            
            //remove all affected Glues
            var cCPs = this.connectionPointGetAllByParent(connectorId); //get all connection points             
            for(var k=0; k<cCPs.length; k++){
                this.glueRemoveAllBySecondId(cCPs[k].id);
            }
            
            //remove all affected ConnectionPoints 
            this.connectionPointRemoveAllByParent(connectorId);
        }
        
        //remove the connector
        for(var i=0; i<this.connectors.length; i++){
            if(this.connectors[i].id == connectorId){
                this.connectors.splice(i,1);
                break;
            }//end if
        }//end for
    },


    /**Paints all connectors and highlight the selected one
     *@param {Context} context - a reference to HTML5's canvas
     *@param {Number} highlightedConnectorId - the id of the highlighted connector
     *@author Zack
     *@author Alex
     *TODO: maybe all painting should not be made in managers
     **/
    connectorPaint:function(context, highlightedConnectorId){
        for(var i=0; i<this.connectors.length; i++){
            //PAINT A CONNECTOR

            //1 - paint highlight color
            //detect if we have a currenly selected Connector and "highlight" its ConnectionPoints
            if(this.connectors[i].id == highlightedConnectorId){
                //paint a lime line underneath the connector
                context.save();
                if(this.connectors[i].style.lineWidth == null){
                    this.connectors[i].style.lineWidth = 1;
                }
                var oldStyle = this.connectors[i].style.clone();
                var oldWidth = this.connectors[i].style.lineWidth;
                this.connectors[i].style = new Style();
                this.connectors[i].style.lineWidth = parseInt(oldWidth) + 2;
                this.connectors[i].style.strokeStyle = "lime";
                this.connectors[i].paint(context);
                this.connectors[i].style = oldStyle;
                context.restore();                                
            }

            //2 - paint the connector
            this.connectors[i].paint(context);
            
            //3 - paint the connection points (as they are on top of the connector)
            if(this.connectors[i].id == highlightedConnectorId){
                this.connectionPointPaint(context, this.connectors[i].id)
            }

//            //(if selected) activate the handlers for the connector
//            if(i == this.connectorSelectedIndex){
//                HandleManager.shapeSet(this.connectors[i]);
//                HandleManager.paint(context);
//            }
            
        }//end for
    },

    /**
     * Disconnects all Connectors (actually one) that have a ConnectionPoint
     * @param {Number} conectionPointId - connectionPoint to disconnect
     * should only ever be called using the conPoint of a Connector, but could work either way
     */
    connectorDisconnect:function(conectionPointId){
        if(this.connectionPointHasGlues(conectionPointId)){
            this.glueRemove(conectionPointId);
        }
    },


    /** Simplifies the connection of 2 ConnectionPoints
     * @param {ConnectionPoint} connectionPoint1 - connectionPoint on a figure/connector
     * @param {ConnectionPoint} connectionPoint2 - connectionPoint on a figure/connector
     *
     * TODO: Is it mandatory that one ConnectionPoint is from a figure an the another one from a Connector?
     */
    connectorConnect:function(connectionPoint1, connectionPoint2){
        //connect the two figures, they were highlighted, so now unhighlight them
        connectionPoint1.color = ConnectionPoint.CONNECTED_COLOR;
        connectionPoint2.color = ConnectionPoint.CONNECTED_COLOR;

        //select the figure we jusfigurest connected to
        var figurePoint;
        var nonFigurePoint;

        //find out which one is from a connector
        //set the connectors point to the figures point, has a "snap to" effect
        if(connectionPoint1.type == ConnectionPoint.TYPE_FIGURE){
            figurePoint = connectionPoint1;
            nonFigurePoint = connectionPoint2;
        }
        else{
            figurePoint = connectionPoint2;
            nonFigurePoint = connectionPoint1;
        }

        //make connector's point be identical with Figure's point
        nonFigurePoint.point.x = figurePoint.point.x;
        nonFigurePoint.point.y = figurePoint.point.y;

        //are these connectionPoints already connected, if not connect them now?
        if(!this.connectionPointIsConnected(nonFigurePoint.id,figurePoint.id)){
            this.glueCreate(nonFigurePoint.id,figurePoint.id);
        }
        
        //if we are now connected at two places, make the line jagged.
        var connector = this.connectorGetById(nonFigurePoint.parentId);

        if(connector != null){
            if(this.connectionPointHasGlues(this.connectionPointGetAllByParent(connector.id)[0].id) //is Connector's first ConnectionPoint glued
                && this.connectionPointHasGlues(this.connectionPointGetAllByParent(connector.id)[1].id) //is Connector's second ConnectionPoint glued
                && connector.type == Connector.TYPE_JAGGED) //is Connector's type jagged
                {
                //TODO: it seems that Connector does not have a parameter....!?
                alert('Problem connector has ' + connector.turningPoints.length + " points");
                //connector.jagged();
                connector.jaggedReloaded();
                connector.redraw();
            }
        }
        
    },


    /** Selects a connector using x and y coordinates, same as figure and handle
     * @param {Number} x - the x coordinate
     * @param {Number} y - the y coordinate
     */
    connectorSelectXY:function(x,y){
        //try to pick the new selected connector
        this.connectorSelectedIndex = -1;
        for(var i=0; i<this.connectors.length; i++){
            if(this.connectors[i].contains(x,y)){
                this.connectorSelectedIndex = i;
                break;
            }
        }
    },


    /** Returns the currently selected connector
     * or null if none available
     */
    connectorGetSelected:function(){
        if(this.connectorSelectedIndex!=-1){
            return this.connectors[this.connectorSelectedIndex];
        }
        return null;
    },


    /**Get a Connector by its id
     *@param {Number} connectorId
     *@return {Connetor} if founded or null if none finded
     **/
    connectorGetById:function(connectorId){
        for(var i=0; i<this.connectors.length; i++){
            if(this.connectors[i].id == connectorId){
                return this.connectors[i];
            }
        }
        return null;
    },


    /**Returns the id of the connector the mouse is over.
     *It actually return the first connector we found in a vicinity of that point
     *@param {Number} x - the x coord
     *@param {Number} y - the y coord
     *@return {Number} - the id of the connector or -1 if no connector found
     *
     *TODO: Note: We are picking the Connector the most far from user as if
     *we iterate from 0 to connectors.lenght we are going from back to front, similar
     *to painting
     */
    connectorGetByXY:function(x,y){
        var id = -1;
        for(var i=0; i<this.connectors.length; i++){
            if(this.connectors[i].near(x, y, 3)){
                id = this.connectors[i].id;
                break;
            }
        }
        return id;
    },

    /**Adjust a Connector by its (one) ConnectionPoint
     *@param {Integer} cpId - the id of the connector
     *@param {Number} x - the x coordinates of the point
     *@param {Number} y - the y coordinates of the point
     **/
    connectorAdjustByConnectionPoint: function(cpId, x, y){
        var cp = this.connectionPointGetById(cpId); //ConnectionPoint
        Log.debug("connectorAdjustByConnectionPoint() - Cp is :" + cp);
        var con = this.connectorGetById(cp.parentId); //Connector
        var conCps = this.connectionPointGetAllByParent(con.id); //Conector's ConnectionPoints
        
        if(con.type == Connector.TYPE_STRAIGHT){
            /**For STRAIGHT is very simple just update the tunrning points to the start and end connection points*/
            var start = conCps[0].point.clone();
            var end = conCps[1].point.clone();
            con.turningPoints = [start, end];
        }
        else if(con.type == Connector.TYPE_JAGGED || con.type == Connector.TYPE_ORGANIC){
            //first point
            var startPoint = conCps[0].point.clone();
            
            //second point
            var endPoint = conCps[1].point.clone();
            
            //first bounds
            var sFigure = STACK.figureGetAsFirstFigureForConnector(con.id);
            var sBounds =  sFigure == null ? null : sFigure.getBounds();
                
            //second bounds
            var eFigure = STACK.figureGetAsSecondFigureForConnector(con.id);
            var eBounds = eFigure == null ? null : eFigure.getBounds();
            
            //adjust connector
            var solutions = this.connector2Points(Connector.TYPE_JAGGED, startPoint, endPoint, sBounds, eBounds);
            var solution = solutions[0][2];
            
            con.turningPoints = solution;
            conCps[0].point = con.turningPoints[0].clone();
            conCps[1].point = con.turningPoints[con.turningPoints.length - 1].clone();
        }        
        
        con.updateMiddleText();
    },
    
    

    /**Simple function to get access to first {ConnectionPoint}
     *@param {Number} connectorId - the id of the connector
     *@return {ConnectionPoint} - the start {ConnectionPoint}
     *@author Alex Gheorghiu
     **/
    connectionPointGetFirstForConnector : function(connectorId) {
        return this.connectionPointGetAllByParentIdAndType(connectorId, ConnectionPoint.TYPE_CONNECTOR)[0];
    },
    
    
    /**Simple function to get access to second {ConnectionPoint}
     *@param {Number} connectorId - the id of the connector
     *@return {ConnectionPoint} - the end {ConnectionPoint}
     *@author Alex Gheorghiu
     **/
    connectionPointGetSecondForConnector : function(connectorId) {
        return this.connectionPointGetAllByParentIdAndType(connectorId, ConnectionPoint.TYPE_CONNECTOR)[1];
    },



    /**This function returns a "temp" connector between 2 points
     *@param {Number} type - Connector.TYPE_STRAIGHT or Connector.TYPE_JAGGED
     *@param {Point} startPoint - the start {Point}
     *@param {Point} endPoint - the end {Point}
     *@param {Array} sBounds - the starting bounds (of a Figure) as [left, top, right, bottom] - area we should avoid
     *@param {Array} eBounds - the ending bounds (of a Figure) as [left, top, right, bottom] - area we shoudl avoid
     *
     *@retun {Array} - in a form ('general case', 'solution', [point1, point2, ...])
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    connector2Points: function(type,  startPoint, endPoint, sBounds, eBounds ){
        Log.level = LOG_LEVEL_NONE; 
        
        Log.group("connectionManager: connector2Points");
        
        
        Log.info("ConnectionManager: connector2Points (" + type + ", " + startPoint + ", " + endPoint + ", " + sBounds + ", " + eBounds + ')');
        var solutions = [];
        
        
        
        switch(type){
            case Connector.TYPE_STRAIGHT:
                var points = [startPoint.clone(), endPoint.clone()];
                solutions.push( ['straight', 'straight', points] );
                break;
                
            case Connector.TYPE_ORGANIC:
                //do nothing....just flow with JAGGED...for now
                
            case Connector.TYPE_JAGGED:
                var startExitPoint = null;
                var endExitPoint = null;
                
                //find start exit point
                if(sBounds != null){
                    var potentialExits = [];
                    
                    potentialExits.push(new Point(startPoint.x, sBounds[1] - FIGURE_ESCAPE_DISTANCE)); //north
                    potentialExits.push(new Point(sBounds[2] + FIGURE_ESCAPE_DISTANCE, startPoint.y)); //east
                    potentialExits.push(new Point(startPoint.x, sBounds[3] + FIGURE_ESCAPE_DISTANCE)); //south
                    potentialExits.push(new Point(sBounds[0] - FIGURE_ESCAPE_DISTANCE, startPoint.y)); //west

                    //pick closest exit point
                    startExitPoint = potentialExits[0];
                    for(var i=1; i < potentialExits.length; i++){
                        if(Util.distance(startPoint, potentialExits[i]) < Util.distance(startPoint, startExitPoint)){
                            startExitPoint = potentialExits[i];
                        }
                    }
                    
                    if(startExitPoint == null){
                        alert("No way");
                    }
                }
                
                
                //find end exit point
                if(eBounds != null){
                    var potentialExits = [];
                    
                    potentialExits.push(new Point(endPoint.x, eBounds[1] - FIGURE_ESCAPE_DISTANCE)); //north
                    potentialExits.push(new Point(eBounds[2] + FIGURE_ESCAPE_DISTANCE, endPoint.y)); //east
                    potentialExits.push(new Point(endPoint.x, eBounds[3] + FIGURE_ESCAPE_DISTANCE)); //south
                    potentialExits.push(new Point(eBounds[0] - FIGURE_ESCAPE_DISTANCE, endPoint.y)); //west

                    //pick closest exit point
                    endExitPoint = potentialExits[0];
                    for(var i=1; i < potentialExits.length; i++){
                        if(Util.distance(endPoint, potentialExits[i]) < Util.distance(endPoint, endExitPoint)){
                            endExitPoint = potentialExits[i];
                        }
                    }
                    
                    if(endExitPoint == null){
                        alert("No way");
                    }
                }
                
                //Basic solution (basic kit :p)
                var s = [startPoint];
                var gapIndex = 0; //the index of the gap (where do we need to insert new points) DO NOT CHANGE IT
                if(startExitPoint){
                    s.push(startExitPoint);
                    gapIndex = 1;
                }
                if(endExitPoint){
                    s.push(endExitPoint);
                }
                s.push(endPoint);
                
                
                
                //SO - no additional points
                var s0 = Point.cloneArray(s);
                solutions.push(['s0', 's0', s0]);
                
                
                
                //S1
                var s1 = Point.cloneArray(s);
                
                //first variant
                var s1_1 = Point.cloneArray(s1);
                s1_1.splice(gapIndex + 1, 0, new Point(s1_1[gapIndex].x , s1_1[gapIndex+1].y) );
                solutions.push(['s1', 's1_1', s1_1]);
                
                //second variant
                var s1_2 = Point.cloneArray(s1);
                s1_2.splice(gapIndex + 1, 0, new Point(s1_2[gapIndex+1].x , s1_2[gapIndex].y) );
                solutions.push(['s1', 's1_2', s1_2]);    
                
                
                //S2     
                                
                //Variant I
                var s2_1 = Point.cloneArray(s);
                var s2_1_1 = new Point( (s2_1[gapIndex].x + s2_1[gapIndex+1].x) / 2,  s2_1[gapIndex].y);
                var s2_1_2 = new Point( (s2_1[gapIndex].x + s2_1[gapIndex+1].x) / 2,  s2_1[gapIndex+1].y);                
                s2_1.splice(gapIndex + 1, 0, s2_1_1, s2_1_2);
                solutions.push(['s2', 's2_1', s2_1]);
                
                
                //Variant II
                var s2_2 = Point.cloneArray(s);
                var s2_2_1 = new Point( s2_2[gapIndex].x, (s2_2[gapIndex].y + s2_2[gapIndex+1].y)/2 );
                var s2_2_2 = new Point( s2_2[gapIndex+1].x, (s2_2[gapIndex].y + s2_2[gapIndex+1].y)/2);
                s2_2.splice(gapIndex + 1, 0, s2_2_1, s2_2_2);
                solutions.push(['s2', 's2_2', s2_2]);
                
                
                //Variant III
                var s2_3 = Point.cloneArray(s);
                //find the amount (stored in delta) of pixels we need to move right so no intersection with a figure will be present
                //!See:  /documents/specs/connected_figures_deltas.jpg file
                
                var eastExits = [s2_3[gapIndex].x + 20, s2_3[gapIndex+1].x + 20]; //add points X coordinates to be able to generate Variant III even in the absence of figures :p
                
                if(sBounds){
                    eastExits.push(sBounds[2] + 20); 
                }

                if(eBounds){
                    eastExits.push(eBounds[2] + 20);
                }
                
                var eastExit = Util.max(eastExits);
                var s2_3_1 = new Point( eastExit, s2_3[gapIndex].y );
                var s2_3_2 = new Point( eastExit, s2_3[gapIndex+1].y );
                s2_3.splice(gapIndex + 1, 0, s2_3_1, s2_3_2);
                solutions.push(['s2', 's2_3', s2_3]);
                
                
                //Variant IV
                var s2_4 = Point.cloneArray(s);
                //find the amount (stored in delta) of pixels we need to move up so no intersection with a figure will be present
                //!See:  /documents/specs/connected_figures_deltas.jpg file
                
                var northExits = [s2_4[gapIndex].y - 20, s2_4[gapIndex+1].y - 20]; //add points y coordinates to be able to generate Variant III even in the absence of figures :p
                
                if(sBounds){
                    northExits.push(sBounds[1] - 20);  
                }

                if(eBounds){
                    northExits.push(eBounds[1] - 20);
                }
                
                var northExit = Util.min(northExits);
                var s2_4_1 = new Point( s2_4[gapIndex].x, northExit);
                var s2_4_2 = new Point( s2_4[gapIndex+1].x, northExit);
                s2_4.splice(gapIndex + 1, 0, s2_4_1, s2_4_2);
                solutions.push(['s2', 's2_4', s2_4]);
                
                
                //Variant V
                var s2_5 = Point.cloneArray(s);
                //find the amount (stored in delta) of pixels we need to move left so no intersection with a figure will be present
                //!See:  /documents/specs/connected_figures_deltas.jpg file
                
                var westExits = [s2_5[gapIndex].x - 20, s2_5[gapIndex+1].x - 20]; //add points x coordinates to be able to generate Variant III even in the absence of figures :p
                
                if(sBounds){
                    westExits.push(sBounds[0] - 20);  
                }

                if(eBounds){
                    westExits.push(eBounds[0] - 20);
                }
                
                var westExit = Util.min(westExits);
                var s2_5_1 = new Point( westExit, s2_5[gapIndex].y);
                var s2_5_2 = new Point( westExit, s2_5[gapIndex+1].y);
                s2_5.splice(gapIndex + 1, 0, s2_5_1, s2_5_2);
                solutions.push(['s2', 's2_5', s2_5]);
                
                
                //Variant VI
                var s2_6 = Point.cloneArray(s);
                //find the amount (stored in delta) of pixels we need to move down so no intersection with a figure will be present
                //!See:  /documents/specs/connected_figures_deltas.jpg file
                
                var southExits = [s2_6[gapIndex].y + 20, s2_6[gapIndex+1].y + 20]; //add points y coordinates to be able to generate Variant III even in the absence of figures :p
                
                if(sBounds){
                    southExits.push(sBounds[3] + 20);  
                }

                if(eBounds){
                    southExits.push(eBounds[3] + 20);
                }
                
                var southExit = Util.max(southExits);
                var s2_6_1 = new Point( s2_6[gapIndex].x, southExit);
                var s2_6_2 = new Point( s2_6[gapIndex+1].x, southExit);
                s2_6.splice(gapIndex + 1, 0, s2_6_1, s2_6_2);
                solutions.push(['s2', 's2_6', s2_6]);
                
                
                
                //FILTER solutions
                
                /*Algorithm
                 * 0. solutions are ordered from minimmun nr of points to maximum >:)
                 * 1. remove all solutions that are not orthogonal (mainly s0 solution)
                 * 2. remove all solutions that go backward (we will not need them ever)
                 * 3. remove all solutions with intersections
                 * 4. pick first class of solutions with same nr of points (ex: 2)
                 * 5. pick the first solution with 90 degree angles (less turnarounds)
                 * (not interesteted) sort by length :p
                 */
                
                //1. filter non ortogonal solutions
                if(true){
                    Log.info("Filter orthogonal solutions. Initial number of solutions = " + solutions.length);
                    var orthogonalSolution = [];
                    for(var l=0; l<solutions.length; l++){
                        var solution = solutions[l][2];
                        if(Util.orthogonalPath(solution)){
                            orthogonalSolution.push(solutions[l]);
                        }
                    }
                    solutions = orthogonalSolution;
                    Log.info("\n\tOrthogonalSolutions = " + solutions.length);
                }
                
                //2. filter backward solutions
                if(true){ 
                    //do not allow start and end points to coincide - ignore them
                    if(startPoint.equals(endPoint)){
                        Log.info("Start and end point coincide...skip backward solution. I think we will just fall on s0 :)");
                    }
                    else{
                        Log.info("Filter backward solutions. Initial number of solutions = " + solutions.length);
                        var forwardSolutions = [];
                        var temp = '';
                        for(var l=0; l<solutions.length; l++){
                            var solution = solutions[l][2];
                            if(Util.forwardPath(solution)){
                                forwardSolutions.push(solutions[l]);                                
                            }
                            else{
                                temp = temp +  "\n\t" + solution;
                            }
                        }
                        solutions = forwardSolutions;                    
                        Log.info("\n\t ForwardSolutions = " + solutions.length);
                        if(solutions.length == 0){
                            Log.info("Discarded solutions: " + temp);
                        }
                    }
                }
                
                
                //3. Filter non intersecting solutions
                if(true){
                    Log.info("Filter non intersecting solutions. Initial number of solutions = " + solutions.length);
                    var nonIntersectionSolutions = []
                    for(var l=0; l<solutions.length; l++){
                        var solution = solutions[l][2];
                        //Log.info("Solution id= " + solutions[l][1] + ' nr points = ' + solution.length + ", points = " + solution);
                        var intersect = false;

                        var innerLines = solution.slice(); //just a shallow copy

                        /*If any bounds just trim the solution. So we avoid the strange case when a connection
                         *startes from a point on a figure and ends inside of the same figure, but not on a connection point*/
                        if(eBounds || sBounds){
                            //i0nnerLines = innerLines.slice(0, innerLines.length - 1);
                            innerLines = innerLines.slice(1, innerLines.length - 1);
                            //Log.info("\t eBounds present,innerLines nr. points = " + innerLines.length + ", points = " + innerLines);                        
                        }



                        //now test for intersection
                        if(sBounds){
                            intersect = intersect || Util.polylineIntersectsRectangle(innerLines, sBounds);
                        }
                        if(eBounds){
                            intersect = intersect || Util.polylineIntersectsRectangle(innerLines, eBounds);
                        }

                        if(!intersect){
                            nonIntersectionSolutions.push(solutions[l]);                    
                        }
                    }                
                    
                    //If all solutions intersect than this is destiny  :) and just ignore the intersection filter
                    if(nonIntersectionSolutions.length != 0){
                        //reasign to solutions
                        solutions = nonIntersectionSolutions;   
                    }
                    
                    Log.info("\n\t nonIntersectionSolutions = " + solutions.length);
                }
                
                
                //4. get first class of solutions with same nr of points
                if(true){
                    Log.info("Get first class of solutions with same nr of points");
                    if(solutions.length == 0){
                        alert("This is not possible");
                    }
                    
                    var firstSolution = solutions[0][2]; //pick first solution
                    var nrOfPoints = firstSolution.length;
                    var sameNrPointsSolution = [];
                    
                    for(var l=0; l<solutions.length; l++){
                        var solution = solutions[l][2];
                        if(solution.length == nrOfPoints){
                            sameNrPointsSolution.push(solutions[l]);
                        }
                    }
                    
                    solutions = sameNrPointsSolution;
                }
                
                
                
                
                /*5. Pick the first solution with 90 degree angles (less turnarounds)
                *in case we have more than one solution in our class
                */
                if(true){
                    Log.info("pick the first solution with 90 degree angles (less turnarounds)");
                    var solIndex = 0;
                    for(var l=0; l<solutions.length; l++){
                        var solution = solutions[l][2];
                        if(Util.scorePath( solutions[solIndex][2] ) < Util.scorePath( solutions[l][2] ) ){
                            solIndex = l;
                        }
                    }
                    solutions = [solutions[solIndex]];
                }
                
                
                break;
        }
        
        Log.groupEnd();
        
        Log.level = LOG_LEVEL_INFO; 
        
        return solutions;
    },


    /**Score a ortogonal path made out of Points
     *Iterates over a set of points (minimum 3)
     *For each 3 points if the 3rd one is after the 2nd
     *  on the same line we add +1 if the 3rd is up or down rlated to the 2nd we do not do anything
     *  and if the 3rd goes back we imediatelly retun -1
     *@param {Array} v - an array of {Point}s
     *@param {Boolean} smooth - if true the smoothest path will have a greater score, if false the most jagged
     *  will have a bigger score.
     *@return {Number} - -1 if the path is wrong (goes back) or something >= 0 if is fine
     *  The bigger the number the smooth the path is
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    _scorePath:function(v, smooth){
        var n = v.length;
        if(n < 3){
            return -1;
        }

        var score = 0;
        for(var i=1;i<n-1;i++){
            if(v[i-1].x == v[i].x && v[i].x == v[i+1].x){ //on the same vertical
                if(signum(v[i+1].y - v[i].y) == signum(v[i].y - v[i-1].y)){ //same direction
                    if(smooth){
                        score++;
                    }                    
                }
                else{ //going back - no good
                    return -1;
                }
            }
            else if(v[i-1].y == v[i].y && v[i].y == v[i+1].y){ //on the same horizontal
                if(signum(v[i+1].x - v[i].x) == signum(v[i].x - v[i-1].x)){ //same direction
                    if(smooth){
                        score++;
                    }
                }
                else{ //going back - no good
                    return -1;
                }
            }
            else{ //not on same vertical nor horizontal
                if(!smooth){
                    score++;
                }
                //do nothing; is like adding 0
            }
        }

        return score;
    },


    /**
     *Tests if a vector of points is a valid path (not going back)
     *@param {Array} v - an {Array} of {Point}s
     *@return {Boolean} - true if path is valid, false otherwise
     *@author Alex <alex@scriptoid.com>
     **/
    _validPath:function(v){
        var n = v.length;
        if(n < 3){
            return false;
        }

        for(var i=1;i<n-1;i++){
            if(v[i-1].x == v[i].x && v[i].x == v[i+1].x){ //on the same vertical
                if(signum(v[i+1].y - v[i].y) != signum(v[i].y - v[i-1].y)){ //going back
                    return false;
                }
            }
            else if(v[i-1].y == v[i].y && v[i].y == v[i+1].y){ //on the same horizontal
                if(signum(v[i+1].x - v[i].x) != signum(v[i].x - v[i-1].x)){ //going back
                    return false;
                }
            }
        }

        return true;
    },
    

    /**Reset this ConnectionManager*/
    reset:function(){
        this.connectors = [];
        this.connectorSelectedIndex = -1;
        this.connectionPoints = [];
        this.connectionPointSelectedIndex = -1;
        this.connectionPointCurrentId = 0;
    },
    


    /****************************************************************/
    /**************************ConnectionPoint*****************************/
    /****************************************************************/

    /**Returns the selected connection point
     *@return a {ConnectionPoint} that is stored at position selectedConnectionPointIndex
     *or null if selectedConnectionPointIndex is not set (equal to -1)
     **/
    connectionPointGetSelected:function(){
        if(this.connectionPointSelectedIndex == -1){
            return null
        }
        return this.connectionPoints[this.connectionPointSelectedIndex];
    },

    /** Returns a connection point id based on an x and y and the ConnectionPoint.RADIUS
     * It will pick the first one that matches the criteria
     *@param {Number} x - the x coordinates of the point
     *@param {Number} y - the y coordinates of the point
     *@param {Boolean} type - the type of connector to select. Can be 'connector'(ConnectionPoint.TYPE_CONNECTOR)
     *  or 'figure' (ConnectionPoint.TYPE_FIGURE)
     *@author Alex Gheorghiu <alex@scriptoid.com>
     */
    connectionPointGetByXY:function(x,y, type){
        var id = -1;

        for(var i=0; i<this.connectionPoints.length; i++){
            if( this.connectionPoints[i].contains(x,y) && this.connectionPoints[i].type == type ){
                id = this.connectionPoints[i].id;
                break;
            }
        }

        return id;
    },
    
    
    /**Reset color to all connection points
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    connectionPointsResetColor : function(){
        for(var i=0; i<this.connectionPoints.length; i++){
            this.connectionPoints[i].color = ConnectionPoint.NORMAL_COLOR;
        }
    },

    /** Creates a new ConnectionPoint. Beside creating the ConnectionPoint it will also
     * inject the id and store the ConnectionPoint
     * 
     * @param {Number} parentId - the id of the parent ( Figure or Connector )this ConnectionPoint will belong to
     * @param {Point} point - the location
     * @param {String} type - the type of parent. It can be 'figure' (ConnectionPoint.TYPE_FIGURE)
     *      or 'connector' {ConnectionPoint.TYPE_CONNECTOR}
     * @return {ConnectionPoint} with a proper id set
     *
     * @author Alex Gheorghiu <alex@scriptoid.com>
     */
    connectionPointCreate:function(parentId, point, type){
        var conPoint = new ConnectionPoint(parentId, point.clone(), this.connectionPointCurrentId++, type);
        this.connectionPoints.push(conPoint);
        
        return conPoint;
    },


    /** Removes the connectionPoints associated with a parent (it can be either Figure or Connector)     
     * @param {Number} parentId - the figure id
     * @author Alex Gheorghiu <alex@scriptoid.com>
     */
    connectionPointRemoveAllByParent:function(parentId){
        for(var i=0; i<this.connectionPoints.length; i++){
            if(this.connectionPoints[i].parentId == parentId){
                this.connectionPoints.splice(i,1);
                i--;
            }
        }
    },


    /** Returns a ConnectionPoint based on its id
     * or null if none finded
     *@param {Number} connectionPointId - the id
     *@return {ConnectionPoint}
     */
    connectionPointGetById:function(connectionPointId){
        for(var i=0; i<this.connectionPoints.length; i++){
            if(this.connectionPoints[i].id == connectionPointId){
                return this.connectionPoints[i];
            }
        }
        return null;
    },
    
    
    /** Returns a ConnectionPoint based on its id
     * or null if none finded
     *@param {Number} parentId - the id of the parent
     *@param {Number} x - the x of the point
     *@param {Number} y - the y of the point
     *@return {ConnectionPoint}
     */
    connectionPointGetByParentAndCoordinates:function(parentId, x, y){
        for(var i=0; i<this.connectionPoints.length; i++){
            if(this.connectionPoints[i].parentId == parentId 
                && this.connectionPoints[i].point.x == x
                && this.connectionPoints[i].point.y == y

                )
                {
                return this.connectionPoints[i];
            }
        }
        return null;
    },


    /** Returns a subset of whole ConnectionPoints that belong to a figure or a connector
     *@param {Number} parentId - the figure or connector's id whom subset we want
     *@return {Array}{ConnectionPoint}s
     *@author Alex Gheorghiu <alex@scriptoid.com>
     */
    connectionPointGetAllByParent:function(parentId){
        var collectedPoints = [];
       
        for(var connectionPoint in this.connectionPoints){
            if(this.connectionPoints[connectionPoint].parentId == parentId){
                collectedPoints.push(this.connectionPoints[connectionPoint]);
            }
        }
        return collectedPoints;
    },
    
    
    /** Returns a subset of whole ConnectionPoints that belong to a figure or a connector
     *@param {Number} parentId - the figure or connector's id whom subset we want
     *@param {String} type - ConnectionPoint.TYPE_FIGURE or ConnectionPoint.TYPE_CONNECTOR. No more guessing.
     *@return {Array}{ConnectionPoint}s
     *@author Alex Gheorghiu <alex@scriptoid.com>
     */
    connectionPointGetAllByParentIdAndType:function(parentId, type){
        var collectedPoints = [];
       
        for(var cpIndex in this.connectionPoints){
            if(this.connectionPoints[cpIndex].parentId == parentId && this.connectionPoints[cpIndex].type == type){
                collectedPoints.push(this.connectionPoints[cpIndex]);
            }
        }
        return collectedPoints;
    },


    
    /** Get the connectionPoint the mouse is over
     * @param {Number} x - coordinate
     * @param {Number} y - coordinate
     * @param {Number} parentFigureId - the subset to obtain (optional)
     * If the parentFigureId is null we will get extend our search to all the ConnectionPoints on the canvas
     * If the parentFigureId is positive we will limit our search to that shape (Figure or Connector)
     * If the parentFigureId is negative we will search on all Canvas but except that shape (Figure or Connector)
     * @return {ConnectionPoint} that fit the criteria or null if none present
     * @author Alex Gheorghiu <alex@scriptoid.com>
     */
    connectionPointOver:function(x, y, parentFigureId){
        var foundedConnectionPoint = null;

        if(typeof(parentFigureId) == 'number'){ //we have a Figure id specified
            if(parentFigureId < 0 ){ //search whole canvas except a figure
                for(var canvasConnectionPoint in this.connectionPoints){
                    if(this.connectionPoints[canvasConnectionPoint].parentId != -parentFigureId && this.connectionPoints[canvasConnectionPoint].contains(x,y)){
                        this.connectionPoints[canvasConnectionPoint].color = ConnectionPoint.OVER_COLOR;
                        foundedConnectionPoint = this.connectionPoints[canvasConnectionPoint];
                    }
                }
            }
            else{ //search only a  figure
                var figureConnectionPoints = this.connectionPointGetAllByParent(parentFigureId);
                for(var figureConnectionPoint in figureConnectionPoints){
                    if(figureConnectionPoints[figureConnectionPoint].contains(x,y)){
                        figureConnectionPoints[figureConnectionPoint].color = ConnectionPoint.OVER_COLOR;
                        foundedConnectionPoint = figureConnectionPoints[figureConnectionPoint];
                    }
                }
            }
        }
        else{ //search whole canvas
            for(var connectionPoint in this.connectionPoints){
                if(this.connectionPoints[connectionPoint].contains(x,y)){
                    this.connectionPoints[connectionPoint].color = ConnectionPoint.OVER_COLOR;
                    foundedConnectionPoint = this.connectionPoints[connectionPoint];
                }
            }
        }
        

        return foundedConnectionPoint;
    },
    

    /**Paints ALL ConnectionPoints that are attached to a shape (Figure or Connector)
     *@param {Context} context - the HTML5 canvas' context
     *@param {Number} parentFigureId - the the parent figure's ID
     */
    connectionPointPaint:function(context, parentFigureId){
        var figureConnectionPoints = this.connectionPointGetAllByParent(parentFigureId);
        
        for(var conPoint in figureConnectionPoints){
            figureConnectionPoints[conPoint].paint(context);
        }
    },


    /**
     * Transform all ConnectionPoints of a  Figure
     * @param {Number} fId - the the parent figure's ID
     * @param {Matrix} matrix - the transformation matrix
     **/
    connectionPointTransform:function(fId, matrix){
        var fCps = this.connectionPointGetAllByParent(fId);
        //Log.info("ConnectionManager: connectionPointTransform()....1");
        //get all shape's connection points
        for(var i = 0 ; i < fCps.length; i++){
            //transform figure's connection points (no go for the other side)
            fCps[i].transform(matrix);
            //Log.info("\tConnectionManager: connectionPointTransform()....2");

            //get all glues for current connection point
            var glues = this.glueGetByFirstConnectionPointId(fCps[i].id);
            //Log.info("\tConnectionManager: connectionPointTransform()" + fCps[i].id + " glues = " + glues.length);
            for(var j=0; j<glues.length; j++){
                //get the ConnectionPoint from other side of the glue (from the connector)
                var conCp = this.connectionPointGetById( glues[j].id2);
                //Log.info("\t\tConnectionManager: connectionPointTransform() - connector's point " + conCp);
                conCp.transform(matrix);

                //get attached connector
//                var con = this.connectorGetById(conCp.parentId);

                //adjust attached Connector through the ConnectionPoint
//                con.adjust(matrix, conCp.point.clone());
                this.connectorAdjustByConnectionPoint(glues[j].id2 /*, x, y*/)
            //Log.info("ConnectionManager: connectionPointTransform()...");
            }
        }
    //alert("look ma!");
    },


    /**
     * See if two {ConnectionPoint}s are connected
     *@param id1 - a {ConnectionPoint}'s id
     *@param id2 - another {ConnectionPoint}'s id
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    connectionPointIsConnected:function(id1,id2){
        for (var i=0; i < this.glues.length; i++){
            if( (id1 == this.glues[i].id1 && id2 == this.glues[i].id2)
                || (id1 == this.glues[i].id2 && id2 == this.glues[i].id1) ){
                return true;
            }
        }
        return false;
    },


    /**
     *See if a {ConnectionPoint} has {Glue}s attached to it
     *@param {Number} conectionPointId - the {ConnectionPoint}'s id
     *@return true - if we have {Glue}s with it or false if not
     *@author Zack Newsham <zack_newsham@yahoo.co.uk>
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    connectionPointHasGlues:function(conectionPointId){
        for (var i=0; i<this.glues.length; i++){
            if(conectionPointId == this.glues[i].id1 || conectionPointId == this.glues[i].id2){
                return true;
            }
        }
        return false;
    },

    /****************************************************************/
    /**************************Glue*****************************/
    /****************************************************************/

    /** Returns all {Glue}s that have the first Id equals with a certain id value
     *@param {Number} pointId - {Figure}'s id
     *@return {Array}{Glue}s
     *@author Alex Gheorghiu <alex@scriptoid.com>
     */
    glueGetByFirstConnectionPointId:function(pointId){
        var collectedGlues = [];
        for(var i=0; i<this.glues.length; i++){
            if(this.glues[i].id1 == pointId){
                collectedGlues.push(this.glues[i]);
            }
        }
        return collectedGlues;
    },

    /** Returns all {Glue}s that have the second Id equals with a certain id value
     *@param {Number} pointId - {ConnectionPoint}'s id
     *@return {Array}{Glue}s
     *@author Alex Gheorghiu <alex@scriptoid.com>
     *TODO: as second id is usually connector AND a Connector can not be connected to more than one Figure
     *then it should be ONLY one returning value
     */
    glueGetBySecondConnectionPointId:function(pointId){
        var collectedGlues = [];
        for(var i=0; i<this.glues.length; i++){
            if(this.glues[i].id2 == pointId){
                collectedGlues.push(this.glues[i]);
            }
        }
        return collectedGlues;
    },



    /**Creates a new {Glue} and store it into the glue database. Use this instead
     *of creating the Glues by simply "new" operator
     *
     *@param {Number} firstId - the id of the first {ConnectionPoint} - usually the {Figure}'s {ConnectionPoint} id
     *@param {Number} secondId - the id of the second {ConnectionPoint} - usually the {Connector}'s {ConnectionPoint} id
     *@return {Glue} - the newly created Glue
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    glueCreate:function(firstId, secondId){
        var glue = new Glue(firstId, secondId);

        this.glues.push(glue);

        return glue;
    },


    /**Removes all the  {Glue}s  based on it's two IDs
     *@param {Number} id1 - the id of the first shape (usually the Figure)
     *@param {Number} id2 - the id of the second shape (usually the Connector)
     *
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    glueRemoveByIds:function(id1, id2){
        for (var i=0; i<this.glues.length; i++){
            if(id1 == this.glues[i].id1 && id2 == this.glues[i].id2){
                this.glues.splice(i,1);
            }
        }
    },
    
    
    /**Removes all the  {Glue}s  based on first Id (usually the Figure)
     *@param {Number} id - the id of the first shape (usually the Figure)
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    glueRemoveAllByFirstId:function(id){
        for (var i=0; i<this.glues.length; i++){
            if(id == this.glues[i].id1){
                this.glues.splice(i,1);
            }
        }
    },


    /**Removes all the  {Glue}s  based on first Id (usually the Connector)
     *@param {Number} id - the id of the second shape (usually the Connector)
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    glueRemoveAllBySecondId:function(id){
        for (var i=0; i<this.glues.length; i++){
            if(id == this.glues[i].id2){
                this.glues.splice(i,1);
            }
        }
    },

    /** Returns all {Glue}s that have the first Id equals with a certain id value
     *@param {Number} firstId - first id (usually {Figure}'s id)
     *@param {Number} secondId - second id (usually {Connector}'s id)
     *@return {Array}{Glue}s
     *@author Alex Gheorghiu <alex@scriptoid.com>
     */
    glueGetAllByIds:function(firstId, secondId){
        var collectedGlues = [];
        for(var i=0; i<this.glues.length; i++){
            if(this.glues[i].id1 == firstId && this.glues[i].id2 == secondId){
                collectedGlues.push(this.glues[i]);
            }
        }
        return collectedGlues;
    }
}
