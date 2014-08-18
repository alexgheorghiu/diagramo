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

// defines current cloud's paint details
ConnectorManager.CLOUD_RADIUS = 12;
ConnectorManager.CLOUD_LINEWIDTH = 3;
ConnectorManager.CLOUD_STROKE_STYLE = "rgba(255, 153, 0, 0.8)"; //orange

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
        var id = STACK.generateId();

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
            this.glueCreate(nonFigurePoint.id,figurePoint.id, false);
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


    /**
     *Returns the id value of connector for the given coordinates of it's middle text
     *@param {Number} x - the value on Ox axis
     *@param {Number} y - the value on Oy axis
     *@return {Number} - id value of connector (parent of the text primitive with XY) otherwise -1
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    connectorGetByTextXY: function(x, y) {
        var connectorsLength = this.connectors.length;
        for(var i = connectorsLength - 1; i >= 0; i--){
            var connector = this.connectors[i];
            if( connector.middleText.contains(x, y) ) {
                return connector.id;
            }
        }//end for
        return -1;
    },


    /**Adjust a Connector by its (one) ConnectionPoint
     *@param {Integer} cpId - the id of the connector
     *@param {Number} x - the x coordinates of the point
     *@param {Number} y - the y coordinates of the point
     *@deprecated This function seems to no longer be used. 
     *See ConnectionMamager.connectionPointTransform(...)
     **/
    connectorAdjustByConnectionPoint: function(cpId, x, y){
        var cp = this.connectionPointGetById(cpId); //ConnectionPoint
        Log.debug("connectorAdjustByConnectionPoint() - Cp is :" + cp);
        var con = this.connectorGetById(cp.parentId); //Connector
        var conCps = this.connectionPointGetAllByParent(con.id); //Conector's ConnectionPoints
        
        if(con.type === Connector.TYPE_STRAIGHT){
            /**For STRAIGHT is very simple just update the tunrning points to the start and end connection points*/
            var start = conCps[0].point.clone();
            var end = conCps[1].point.clone();
            con.turningPoints = [start, end];
        }
        else if(con.type === Connector.TYPE_JAGGED || con.type === Connector.TYPE_ORGANIC){
            //first ConnectionPoint
            var startPoint = conCps[0].point.clone();
            
            //second ConnectionPoint
            var endPoint = conCps[1].point.clone();
            
            //first bounds (of start figure)
            var sFigure = STACK.figureGetAsFirstFigureForConnector(con.id);
            var sBounds =  sFigure == null ? null : sFigure.getBounds();

            //second bounds (of end figure)
            var eFigure = STACK.figureGetAsSecondFigureForConnector(con.id);
            var eBounds = eFigure == null ? null : eFigure.getBounds();
            
            //adjust connector
            var solutions = this.connector2Points(Connector.TYPE_JAGGED, startPoint, endPoint, sBounds, eBounds);

            // apply solution to Connector (for delta changes made by user)
            con.applySolution(solutions);

            conCps[0].point = con.turningPoints[0].clone();
            conCps[1].point = con.turningPoints[con.turningPoints.length - 1].clone();
        }
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


    /**
     * This function simply takes 2 points: M, N from 2 figures A, B (M belongs to A, 
     * N belongs to B) and tries to find the
     * nearest {ConnectionPoint}s to M ( C1i ) and nearest {ConnectionPoint}s to N  ( C2i ) and then
     * pick those that have a minimum distance between them (minimum C1-C2 distance]
     *   
     *@param {Boolean} startAutomatic - flag defines if start of connection is automatic
     *@param {Boolean} endAutomatic - flag defines if end of connection is automatic
     *@param {Number} startFigureId - Start {Figure}'s id or -1 if no start {Figure} present
     *@param {Point} startPoint - Start {Point} of connection
     *@param {Number} endFigureId - End {Figure}'s id or -1 if no start {Figure} present
     *@param {Point} endPoint - End {Point} of connection
     *
     *@retun {Array} - in a form of 
     *  [
     *  startPoint, 
     *  endPoint, 
     *  start {Figure}'s {ConnectionPoint} Id - or -1 if none, 
     *  end {Figure}'s {ConnectionPoint}'s Id - or -1 if none
     *  ]
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    getClosestPointsOfConnection: function(startAutomatic, endAutomatic, startFigureId, startPoint, endFigureId, endPoint) {

        //We will have 4 cases depending on automaticStart and automaticEnd values        
        
        //Case 1
        // both points have locked position
        // we are taking defined {Point}s of connection
        if (!startAutomatic && !endAutomatic) {
            
            //TODO: not fair not to return CPs'ids where we know for sure they 
            //are present( !automaticStart && !automaticEnd)
            return this.closestPointsFixed2Fixed(startPoint, endPoint);
        }

        //Case 2
        // end point has locked position:
        // we are taking 1 point as position of closest {ConnectionPoint} connected with startPoint
        // and 2 point as end {ConnectionPoint}
        if (startAutomatic && !endAutomatic) {
            return this.closestPointsAuto2Fixed(startFigureId, endPoint);
        }

        //Case 3
        // start point has locked position:
        // we taking 1 point as clone of {ConnectionPoint}
        // and 2 point as position of closest {ConnectionPoint} connected with end point
        if (!startAutomatic && endAutomatic) {
            return this.closestPointsFixed2Auto(startPoint, endFigureId);
        }

        //Case 4
        // start and end points have locked position:
        // we taking both as position of closest {ConnectionPoint} connected with start and end point
        if (startAutomatic && endAutomatic) {
            return this.closestPointsAuto2Auto(startFigureId, startPoint, endFigureId, endPoint);
        }
    },
    
    
    /**
     * Special case of getClosestPointsOfConnection() when
     * startAutomatic = true
     * and 
     * endAutomatic = true
     * */
    closestPointsAuto2Auto : function(startFigureId, startPoint, endFigureId, endPoint){
        // special case when figure is connected to itself
        if (startFigureId == endFigureId) {
            // we will find closest to end point (mouse coordinates)
            // this means solutions will be the same as connecting to end point
            // from automatic start where start and end connection point match
            var candidate = this.closestPointsAuto2Fixed(
                startFigureId,  //start figure's id
                startPoint, //start point
                endFigureId, //end figure's id
                endPoint //end 
            );

            candidate[1] = candidate[0];
            candidate[3] = candidate[2];
            return candidate;
        }

        //get all connection points of start figure
        var startFCps = this.connectionPointGetAllByParent(startFigureId),
            startFCpLength = startFCps.length,
            curStartPoint,
            closestStartPoint = startFCps[0].point,
            closestStartConnectionPointId = startFCps[0].id,
            endFCps = this.connectionPointGetAllByParent(endFigureId),
            endFCpLength = endFCps.length,
            curEndPoint,
            closestEndPoint = endFCps[0].point,
            closestEndConnectionPointId = endFCps[0].id,
            minDistance = Util.distance(closestStartPoint,closestEndPoint),
            curDistance;

        // find closest to endPoint
        for(var i = 0; i < startFCpLength; i++){
            curStartPoint = startFCps[i].point;
            for(var j = 0; j < endFCpLength; j++){
                curEndPoint = endFCps[j].point;
                curDistance = Util.distance(curStartPoint, curEndPoint);
                if (curDistance < minDistance) {
                    minDistance = curDistance;

                    closestStartPoint = curStartPoint;
                    closestStartConnectionPointId = startFCps[i].id;

                    closestEndPoint = curEndPoint;
                    closestEndConnectionPointId = endFCps[j].id;
                }
            }
        }

        return [closestStartPoint.clone(), closestEndPoint.clone(), closestStartConnectionPointId, closestEndConnectionPointId];
    },
    
    /**
     * Special case of getClosestPointsOfConnection() when
     * startAutomatic = false
     * and 
     * endAutomatic = true
     * */
    closestPointsFixed2Auto : function(startPoint, endFigureId){
        //
        //get all connection points of end figure
        var fCps = this.connectionPointGetAllByParent(endFigureId),
            fCpLength = fCps.length,
            closestPoint = fCps[0].point,
            closestConnectionPointId = fCps[0].id,
            minDistance = Util.distance(startPoint, closestPoint),
            curPoint,
            curDistance;

        // find closest to startPoint
        for(var i = 1; i < fCpLength; i++){
            curPoint = fCps[i].point;
            curDistance = Util.distance(startPoint, curPoint);
            if (curDistance < minDistance) {
                minDistance = curDistance;
                closestPoint = curPoint;
                closestConnectionPointId = fCps[i].id;
            }
        }
        return [startPoint, closestPoint.clone(), -1, closestConnectionPointId];
    },


    /**
     * Special case of getClosestPointsOfConnection() when
     * startAutomatic = true
     * and 
     * endAutomatic = false
     * */
    closestPointsAuto2Fixed: function(startFigureId, endPoint){
        //get all connection points of start figure
        var fCps = this.connectionPointGetAllByParent(startFigureId),
            fCpLength = fCps.length,
            closestPoint = fCps[0].point,
            closestConnectionPointId = fCps[0].id,
            minDistance = Util.distance(closestPoint, endPoint),
            curPoint,
            curDistance;

        // find closest to endPoint
        for(var i = 1; i < fCpLength; i++){
            curPoint = fCps[i].point;
            curDistance = Util.distance(curPoint, endPoint);
            if (curDistance < minDistance) {
                minDistance = curDistance;
                closestPoint = curPoint;
                closestConnectionPointId = fCps[i].id;
            }
        }
        return [closestPoint.clone(), endPoint, closestConnectionPointId, -1];
    },
    
    
    /**
     * Special case of getClosestPointsOfConnection() when
     * startAutomatic = false
     * and 
     * endAutomatic = false
     * */
    closestPointsFixed2Fixed : function (startPoint, endPoint){
        return [startPoint, endPoint, -1, -1];
    },
    

    /**This function returns a "temp" connector between 2 points. The points
     * are usually inside some boundaries and we need to "discover" a path
     * from start point to the end point.
     * 
     * Note: We are not using {ConnectionPoint}s here are this somehow a generic algorithm
     * where we have a type of drawing, a start point, and end point and 2 boundaries to
     * consider.
     * 
     * Note 2: For organic connector the solution(s) is "injected" with 2 additional
     * points: in the middle of start and end segment (of turning points) so that 
     * the curve will look more natural.
     * 
     *@param {Number} type - Connector.TYPE_STRAIGHT, Connector.TYPE_JAGGED or Connector.TYPE_ORGANIC
     *@param {Point} startPoint - the start {Point}
     *@param {Point} endPoint - the end {Point}
     *@param {Array} sBounds - the starting bounds (of a Figure) as [left, top, right, bottom] - area we should avoid
     *@param {Array} eBounds - the ending bounds (of a Figure) as [left, top, right, bottom] - area we shoudl avoid
     *
     *@return {Array} solution - in a form ('generic solution name', 'specific solution name', [point1, point2, ...])
     *Example: ['s1', 's1_1', [point1, point2, point3, ...]] where 's1 - is the generic solution name,
     * s1_1 - the specific solution name (Case 1 of Solution 1)
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    connector2Points: function(type,  startPoint, endPoint, sBounds, eBounds ){
        var oldLogLevel = Log.level;
//        Log.level = Log.LOG_LEVEL_DEBUG; 
        
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
        
        //SMOOTHING curve        
        if(type === Connector.TYPE_ORGANIC){
            this.smoothOrganic(solutions);
        }
        //END SMOOTHING curve
        
        Log.groupEnd();
        
        Log.level = oldLogLevel; 
        
        return solutions;
    },
    
    
    /**
     * Tries to smooth the solution.
     * Made mainly for organic connectors
     * @param {Array} solutions - in a form ('generic solution name', 'specific solution name', [point1, point2, ...])
     * Example: ['s1', 's1_1', [point1, point2, point3, ...]] where 's1 - is the generic solution name,
     * s1_1 - the specific solution name (Case 1 of Solution 1)
     * */
    smoothOrganic: function(solutions){
        var option = 3;
        
        switch(option){
            case 0:
                //do nothing
                break;
            
            case 1: //add intermediate points
                //Add the middle point for start and end segment so that we "force" the 
                //curve to both come "perpendicular" on bounds and also make the curve
                //"flee" more from bounds (on exit)
                for(var s=0; s<solutions.length; s++){
                    var solTurningPoints = solutions[s][2];

                    //first segment
                    var a1 = solTurningPoints[0];
                    var a2 = solTurningPoints[1];
                    var startMiddlePoint = Util.getMiddle(a1, a2);
                    solTurningPoints.splice(1,0, startMiddlePoint);

                    //last segment
                    var a3 = solTurningPoints[solTurningPoints.length - 2];
                    var a4 = solTurningPoints[solTurningPoints.length - 1];                
                    var endMiddlePoint = Util.getMiddle(a3, a4);
                    solTurningPoints.splice(solTurningPoints.length - 1, 0, endMiddlePoint);
                }
                break;
                
            case 2: //remove points 
                for(var s=0; s<solutions.length; s++){
                    var solType= solutions[s][0];
                    if(solType == 's1' || solType == 's2'){
                        var solTurningPoints = solutions[s][2];
                        solTurningPoints.splice(1,1);
                        solTurningPoints.splice(solTurningPoints.length - 2, 1);
                    }
                }
                break;
                
            case 3: 
                /*remove colinear point for s1 as it seems that more colinear points do not look good 
                 * on organic solutions >:D*/
                for(var s=0; s<solutions.length; s++){
                    var solType= solutions[s][0];
                    if(solType == 's1'){
                        var solTurningPoints = solutions[s][2];
                        var reducedSolution = Util.collinearReduction(solTurningPoints);
                        solutions[s][2] = reducedSolution;
                    }
                }
                break;
        }//end switch
        
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
     *@param {String} type - the type of connector to select. Can be 'connector'(ConnectionPoint.TYPE_CONNECTOR)
     *  or 'figure' (ConnectionPoint.TYPE_FIGURE)
     *@return {Number} the Id of the {ConnectionPoint} or -1 if none found
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

    /** Returns closest connection point id based on an x, y, radius and the ConnectionPoint.RADIUS
     * It will pick the first one that matches the criteria
     *@param {Number} x - the x coordinates of the point
     *@param {Number} y - the y coordinates of the point
     *@param {Number} radius - max distance from (x,y) point
     *@param {String} type - the type of connector to select. Can be 'connector'(ConnectionPoint.TYPE_CONNECTOR)
     *  or 'figure' (ConnectionPoint.TYPE_FIGURE)
     *@param {ConnectionPoint} ignoreConPoint - the ConnectionPoint to ignore in search
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     */
    connectionPointGetByXYRadius: function(x,y, radius, type, ignoreConPoint) {
        var curId = -1,
            closestId = -1,
            curX,
            curY,
            minDistance = -1,
            curDistance;

        for (curX = x - radius; curX <= x + radius; curX++) {
            for (curY = y - radius; curY <= y + radius; curY++) {
                if ( !ignoreConPoint.contains(curX,curY) ) {
                    curId = this.connectionPointGetByXY(curX, curY, type);
                    if (curId !== -1) {
                        curDistance = Math.sqrt( Math.pow(curX - x, 2) + Math.pow(curY - y, 2) );
                        if (minDistance === -1 || curDistance < minDistance) {
                            minDistance = curDistance;
                            closestId = curId;
                        }
                    }
                }
            }
        }

        return closestId;
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


    /**Adds an existing ConnectionPoint to the connectionPoints array
     *@param {ConnectionPoint} connectionPoint - the ConnectionPoint to add
     *
     * @author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    connectionPointAdd:function(connectionPoint){
        this.connectionPoints.push(connectionPoint);
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
        var currentFigure = STACK.figureGetById(fId);

        //Log.info("ConnectionManager: connectionPointTransform()....1");
        //get all shape's connection points
        for(var i = 0 ; i < fCps.length; i++){
            //transform figure's connection points (no go for the other side)
            fCps[i].transform(matrix);
            //Log.info("\tConnectionManager: connectionPointTransform()....2");

            /* TODO: can we have more than one Glue for single ConnectionPoint? Do we need this cycle? */
            //get all glues for current connection point
            var glues = this.glueGetByFirstConnectionPointId(fCps[i].id);
            var gluesLength = glues.length;
            //Log.info("\tConnectionManager: connectionPointTransform()" + fCps[i].id + " glues = " + gluesLength);
            for(var j = 0; j < gluesLength; j++){
                
                // get the ConnectionPoint from other side of current Glue (from the Connector)
                var firstCP = this.connectionPointGetById(glues[j].id2);

                // get the Connector - parent of firstCP ConnectionPoint
                var connector = this.connectorGetById(firstCP.parentId);
                
                // get ConnectionPoints of the Connector
                var cCPs = this.connectionPointGetAllByParent(connector.id);

                /* In case of having connections where first or second ConnectionPoint glued automatically -
                 * current ConnectionPoints can change it's position and maybe to another ConnectionPoints.
                 * Variables used in finding solution of ConnectionPoints. we need to find
                 * who is the start Figure, end Figure, starting Glue, ending Glue, etc*/
                var startPoint = cCPs[0].point;
                var endPoint = cCPs[1].point;
                var startFigure;
                var endFigure;
                var startBounds;
                var endBounds;
                var automaticStart;
                var automaticEnd;

                // if current Figure is glued with startPoint of the Connector
                if (firstCP.id == cCPs[0].id) {
                    // ConnectionPoint connected with moved (transformed) Figure must be moved (transformed) as well
                    cCPs[0].transform(matrix);
                    
                    // in this case current Figure is startFigure of the connection
                    startFigure = currentFigure;

                    // get Glue for second ConnectionPoint of the Connector
                    var endGlue = this.glueGetBySecondConnectionPointId(cCPs[1].id)[0];
                    
                    // get Figure's ConnectionPoint which is glued with second ConnectionPoint of the Connector
                    var endFigureCP = endGlue ? this.connectionPointGetById(endGlue.id1) : null;
                    
                    // get endFigure as parent of endFigureCP
                    endFigure = endFigureCP ? STACK.figureGetById(endFigureCP.parentId) : null;

                    // if startPoint has automatic Glue -> connection has automatic start
                    automaticStart = glues[j].automatic;
                    
                    // if endPoint has Glue and it's automatic -> connection has automatic end
                    automaticEnd = endGlue && endGlue.automatic;
                } else {    // if current Figure is glued with endPoint of the Connector
                    // ConnectionPoint connected with moved (transformed) Figure must be moved (transformed) as well
                    cCPs[1].transform(matrix);
                    
                    // in this case current Figure is endFigure of the connection
                    endFigure = currentFigure;

                    // get Glue for first ConnectionPoint of the Connector
                    var startGlue = this.glueGetBySecondConnectionPointId(cCPs[0].id)[0];
                    
                    // get Figure's ConnectionPoint which is glued with first ConnectionPoint of the Connector
                    var startFigureCP = startGlue ? this.connectionPointGetById(startGlue.id1) : null;
                    
                    // get startFigure as parent of startFigureCP
                    startFigure = startFigureCP ? STACK.figureGetById(startFigureCP.parentId) : null;

                    // if startPoint has Glue and it's automatic -> connection has automatic start
                    automaticStart = startGlue && startGlue.automatic;
                    // if endPoint has automatic Glue -> connection has automatic end
                    automaticEnd = glues[j].automatic;
                }

                startBounds = startFigure ? startFigure.getBounds(): null;
                endBounds = endFigure ? endFigure.getBounds() : null;

                //find best candidate for start and end point
                var candidate = CONNECTOR_MANAGER.getClosestPointsOfConnection(
                    automaticStart, //start automatic
                    automaticEnd, //end automatic
                    startFigure ? startFigure.id : -1, //start figure's id
                    startPoint, //start point
                    endFigure ? endFigure.id : -1, //end figure's id
                    endPoint //end point
                );

                //solutions
                DIAGRAMO.debugSolutions = CONNECTOR_MANAGER.connector2Points(connector.type, candidate[0], candidate[1], startBounds, endBounds);

            
                // apply solution to Connector
                connector.applySolution(DIAGRAMO.debugSolutions);

                // update position of Connector's ConnectionPoints
                cCPs[0].point = connector.turningPoints[0].clone();
                cCPs[1].point = connector.turningPoints[connector.turningPoints.length - 1].clone();


                //Log.info("\t\tConnectionManager: connectionPointTransform() - connector's point " + conCp);
//                firstCP.transform(matrix);

                //get attached connector
//                var con = this.connectorGetById(conCp.parentId);

                //adjust attached Connector through the ConnectionPoint
//                con.adjust(matrix, conCp.point.clone());
//                this.connectorAdjustByConnectionPoint(glues[j].id2 /*, x, y*/);
            }


        }
/*
        //get all shape's automatic glues
        var automaticGlues = this.glueGetByFigureId(fId);
        var automaticGluesLength = automaticGlues.length;
        //transform all {ConnectionPoint}s and {Connector}s in automatic connection
        for(j = 0; j < automaticGluesLength; j++){
            //get the ConnectionPoint from other side of the glue (from the connector)
            var conCpId = automaticGlues[j].id2;
            var conCp = this.connectionPointGetById(conCpId);
            //Log.info("\t\tConnectionManager: connectionPointTransform() - connector's point " + conCp);
            conCp.transform(matrix);

            //adjust attached Connector through the ConnectionPoint
            this.connectorAdjustByConnectionPoint(conCpId);
        }
        */

        //Log.info("ConnectionManager: connectionPointTransform()...");
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
     *@param {Number} pointId - {Figure}'s {ConnectionPoint} id
     *@return {Array}{Glue}s
     *@author Alex Gheorghiu <alex@scriptoid.com>
     */
    glueGetByFirstConnectionPointId:function(pointId){
        var collectedGlues = [];
        var currentGlue;
        for(var i=0; i<this.glues.length; i++){
            currentGlue = this.glues[i];
            if(currentGlue.id1 == pointId){
                collectedGlues.push(currentGlue);
            }
        }
        return collectedGlues;
    },

    /** Returns all {Glue}s that have the second Id equals with a certain id value
     *@param {Number} pointId - {Connector}'s {ConnectionPoint} id
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
    glueCreate:function(firstId, secondId, automatic){
        var glue = new Glue(firstId, secondId, automatic);

        this.glues.push(glue);

        return glue;
    },


    /**Adds an existing Glue to the glues array
     *@param {Glue} glue - the Glue to add
     *
     * @author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    glueAdd:function(glue){
        this.glues.push(glue);
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


    /**Removes all the  {Glue}s  based on second Id (usually the Connector)
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
    },


    /**
     *Paints the Cloud into a Context
     *@param {Context} context - the 2D context
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     *@author Alex <alex@scriptoid.com>
     **/
    connectionCloudPaint: function(context) {
        if (DIAGRAMO.visualMagnet) {
            if (currentCloud.length) { //draw only if we have a cloud
                var conPoint1 = this.connectionPointGetById(currentCloud[0]);
                var conPoint2 = this.connectionPointGetById(currentCloud[1]);
                var centerX = (conPoint2.point.x + conPoint1.point.x) / 2; //x coordinates of the ellipse
                var centerY = (conPoint2.point.y + conPoint1.point.y) / 2; //y coordinates of the ellipse
                var radiusX = ConnectorManager.CLOUD_RADIUS;
                var radiusY = ConnectorManager.CLOUD_RADIUS / 2;

                /*
                 *   Using formula from http://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Application:_finding_the_angle_of_a_right_triangle
                 *   2. Finding angle from arctan, where opposite is (conPoint2.point.y - conPoint1.point.y)
                 *   and adjacent is (conPoint2.point.x - conPoint1.point.x)
                 */
                var rotationAngle = Math.atan( (conPoint2.point.y - conPoint1.point.y) / (conPoint2.point.x - conPoint1.point.x));

                context.save();
                context.beginPath();

                if (context.ellipse) {  // if context.ellipse() function implemented
                    context.ellipse(centerX, centerY, radiusX, radiusY, rotationAngle, 0, 2 * Math.PI, false);
                } else { // TODO: when ellipse will be implemented in all browsers - remove it
                    /*We will construct an ellipse by 2 Bezier curves
                    * Algorithm described in /web/editor/test/issues/3/Demo.html
                    * and on a Bitbucket (if it still alive :)) https://bitbucket.org/scriptoid/diagramo/issue/3/highlight-about-to-connect-connection#comment-8643442
                    * */
                    var width_two_thirds = radiusX * 4 / 3;

                    var dx1 = Math.sin(rotationAngle) * radiusY;
                    var dy1 = Math.cos(rotationAngle) * radiusY;
                    var dx2 = Math.cos(rotationAngle) * width_two_thirds;
                    var dy2 = Math.sin(rotationAngle) * width_two_thirds;

                    var P3x = centerX - dx1;
                    var P3y = centerY + dy1;
                    var P2x = P3x + dx2;
                    var P2y = P3y + dy2;
                    var P4x = P3x - dx2;
                    var P4y = P3y - dy2;

                    var P6x = centerX + dx1;
                    var P6y = centerY - dy1;
                    var P1x = P6x + dx2;
                    var P1y = P6y + dy2;
                    var P5x = P6x - dx2;
                    var P5y = P6y - dy2;

                    context.moveTo(P6x, P6y);
                    context.bezierCurveTo(P1x, P1y, P2x, P2y, P3x, P3y);
                    context.bezierCurveTo(P4x, P4y, P5x, P5y, P6x, P6y);
                 }

                context.lineWidth = ConnectorManager.CLOUD_LINEWIDTH;
                context.strokeStyle = ConnectorManager.CLOUD_STROKE_STYLE;
                context.stroke();
                context.closePath();
                context.restore();
            }
        }
    }
}
