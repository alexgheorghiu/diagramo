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
 *Stack holds all the figures on the screen
 *It will also hold the groups formed on the screen
 *@this {Stack}
 *@constructor
 **/
function Stack(){
    /**Keeps all the figures on the canvas*/
    this.figures = []; 
    
    /**Keeps all the groups in the canvas*/
    this.groups = [];
    
    this.containers = [];
    
    /**Keeps current generated Id. Not for direct access*/
    this.currentId = 0;
    
    /**Keeps a map like (figure Id, figure index). It is similar to an index*/
    this.idToIndex = [];
    
    /**Type used in serialization*/
    this.oType = 'Stack';
}



/**Creates a {Stack} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Stack} a newly constructed Stack
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Stack.load = function(o){
    var newStack = new Stack(); //empty constructor
    

    newStack.figures = Figure.loadArray(o.figures);
    newStack.containers = Container.loadArray(o.containers);
    newStack.groups = Group.loadArray(o.groups);
    newStack.figureSelectedIndex = o.figureSelectedIndex;
    newStack.currentId = o.currentId;
    newStack.idToIndex = o.idToIndex;

    return newStack;
}


Stack.prototype = {

    constructor : Stack,
    
    /**Creates a {Group} based on a set of figure IDs
     * Group is created by 1. creating a Group and 2. setting Figure's groupId property to the new id of the Group
     *@param {Array} figureIds - all the ids of {Figure}s
     *@param {Number} groupId - the id of the {Group} (optional) 
     *@return {Number} - the id of newly created Group
     **/
    groupCreate:function (figureIds, groupId){

        //we should allow to create more than one temporary group
        for(var i=0; i<this.groups.length; i++){
            if(this.groups[i].permanent == false){
                throw 'Stack::groupCreate()  You can not create new groups while you have temporary groups alive';
            }
        }
        
        //create group
        var g = new Group(groupId);

        //add figures to group
        for(var i=0; i < figureIds.length; i++){
            var f = this.figureGetById(figureIds[i]);
            f.groupId = g.id;
        }
        var bounds = g.getBounds();
        g.rotationCoords.push(new Point(bounds[0]+(bounds[2]-bounds[0])/2, bounds[1] + (bounds[3] - bounds[1]) / 2));
        g.rotationCoords.push(new Point(bounds[0]+(bounds[2]-bounds[0])/2, bounds[1]));

        //save group to STACK
        this.groups.push(g);

        return g.id;
    },


    /**Finds a {Group} by it's id
     *@param {Number} groupId - the {Group}'s id
     *@return {Group} founded group of null if none finded
     **/
    groupGetById : function(groupId){
        for(var i=0; i<this.groups.length; i++){
            if(this.groups[i].id == groupId){
                return this.groups[i];
            }
        }
        return null;
    },

    /**Destroy a group by it's Id. 
     *I will be removed from Stack's groups and any member figure will be removed
     *from group (by set the groupId to -1)
     * @param {Number} groupId - the id of the group
     **/
    groupDestroy: function(groupId){
        var index = -1;
        
        //search for the group
        for(var i=0; i<this.groups.length; i++ ){
            if(this.groups[i].id == groupId){
                index = i;
                break;
            }
        }

        //remove it
        if(index > -1){
            //remove Group
            this.groups.splice(index, 1);

            //remove the Figures from Group
            var groupFigures = this.figureGetByGroupId(groupId);
            for(var i=0; i<groupFigures.length; i++ ){
                groupFigures[i].groupId = -1;
            }
        } 
    },
    
    /**Removes any temporary group*/
    groupRemoveTemporary : function(){
        throw Exception("Not implemented");
    },
    
    /**See if this STACK is equal to another. It is a shallow compare.
     *@param {Stack} anotherStack - the other STACK object
     *@return {Boolean} - true if equals, false otherwise
     **/
    equals: function(anotherStack){
        var msg = '';
        if(!anotherStack instanceof Stack){
            return false;
            msg += 'not same class';
        }

        
        
        //test figures
        if(this.figures.length != anotherStack.figures.length){
            msg += 'not same nr of figures';
            return false;
        }
        
        
        for(var i =0; i<this.figures.length; i++){
            if( !this.figures[i].equals(anotherStack.figures[i]) ){
                msg += 'figures not the same';
                return false;                
            }
        }

        
        
        //test groups
        if(this.groups.length != anotherStack.groups.length){
            msg += 'not same nr of groups';
            return false;
        }

        for(var i =0; i<this.groups.length; i++){
            if( !this.groups[i].equals(anotherStack.groups[i]) ){
                msg += 'groups not the same';
                return false;
            }
        }



        //test idToIndex
        for(var i =0; i<this.figures.idToIndex; i++){
            if(this.idToIndex[i] != undefined //if not undefined
                && anotherStack.idToIndex != undefined //if not undefined
                && this.idToIndex[i] != anotherStack.idToIndex[i] )
                {

                msg += 'not same idToIndex';
                return false;
                }
        }

        if(this.currentId != anotherStack.currentId){
            msg += 'not same currentId';
            return false;
        }

        if(msg != ''){
            alert(msg);
        }

        return true;
            
    },

    /**Generates an returns a new unique ID
     *@return {Number} - next id*/
    generateId:function(){
        return this.currentId++;
    },
    
    /**Adds a figure to the Stack of figures
     *@param {Figure} figure - the figure to add
     **/
    figureAdd:function(figure){
        this.figures.push(figure);
        this.idToIndex[figure.id] = this.figures.length-1;
    },
    
    
    containerAdd : function(container){
        this.containers.push(container);
    },

    /*code taken from ConnectionPoint.removeConnector
     *@param {Figure} figure - the figure to remove
     *@deprecated
     **/
    figureRemove_deprecated:function(figure){
        var index = -1;
        for(var i=0; i<this.figures.length; i++ ){
            if(this.figures[i] == figure){
                index = i;
                break;
            }
        }
        CONNECTOR_MANAGER.connectionPointRemoveAllByParent(figure.id);
        if(index > -1){
            this.figures.splice(index, 1);
            for(var i=index; i<this.figures.length; i++){
                this.idToIndex[this.figures[i].id]=i;
            }
        }
        if(index<this.figureSelectedIndex && index!=-1){
            this.figureSelectedIndex--;
        }
    },
            
    /**Removes a container by it's id
     *@param {Number} containerId - the {Container}'s id
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    containerRemoveById :function(containerId){
        var index = -1;
        for(var i=0; i<this.containers.length; i++ ){
            if(this.containers[i].id === containerId){
                index = i;
                break;
            }
        }

        if(index > -1){
            //remove figure
            this.containers.splice(index, 1);

            //reindex
//            this.reindex();
        }                
    },            

    /**Removes a figure by it's id
     *@param {Number} figId - the {Figure}'s id
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    figureRemoveById :function(figId){
        var index = -1;
        for(var i=0; i<this.figures.length; i++ ){
            if(this.figures[i].id == figId){
                index = i;
                break;
            }
        }

        if(index > -1){
            //remove all affected Glues
            var cCPs = CONNECTOR_MANAGER.connectionPointGetAllByParent(figId); //get all connection points
            var length = cCPs.length;
            var k;
            for(k = 0; k < length; k++) {
                CONNECTOR_MANAGER.glueRemoveAllByFirstId(cCPs[k].id);
            }

            // remove figure's connection points
            CONNECTOR_MANAGER.connectionPointRemoveAllByParent(figId);

            //remove figure
            this.figures.splice(index, 1);

            //reindex
            this.reindex();
        }                
    },


    /**Recreates the index (id, index)
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    reindex : function(){
        for(var i=0; i<this.figures.length; i++){
            this.idToIndex[this.figures[i].id] = i;
        }
    },

    /**Deletes all the figure and reset any index*/
    reset:function(){
        this.figures = [];
        this.figureSelectedIndex = -1;
        this.currentId = 0;
    },

    /**Find the storage index of a figure
     *@param {Figure} figure - the figure you search for
     *@return {Number} - the index where you can find the Figure or -1 if not founded
     **/
    getIndex:function(figure){
        for(var i=0; i<this.figures.length; i++){
            if(this.figures[i]==figure){
                return i;
            }
        }
        return -1;
    },



    /**Returns all figures from a group
     *@param {Number} groupId - the id of the group
     *@return {Array} - the {Array} of {Figure}s that belong to the group
     **/
    figureGetByGroupId:function(groupId){
        var groupFigures = [];
        for(var i=0; i<this.figures.length; i++){
            if(this.figures[i].groupId == groupId){
                groupFigures.push(this.figures[i]);
            }
        }
        
        return groupFigures;
    },


    /**Returns all figures ids from a group
     *@param {Number} groupId - the id of the group
     *@return {Array} - the {Array} of {Number}s that belong to the group
     **/
    figureGetIdsByGroupId:function(groupId){
        var groupFiguresIds = [];
        for(var i=0; i<this.figures.length; i++){
            if(this.figures[i].groupId == groupId){
                groupFiguresIds.push(this.figures[i].id);
            }
        }

        return groupFiguresIds;
    },

    /**Returns a figure by id
     *@param {Number} id - the id of the figure
     *@return {Figure} - the figure object or null if no figure with that id found
     *TODO: use idToIndex to speed up the search....well there is no search at all :)
     **/
    figureGetById:function(id){
        for(var i=0; i<this.figures.length; i++){
            if(this.figures[i].id == id){
                return this.figures[i];
            }
        }
        return null;
    },
    
    
    /**
     *Returns first figure glued to a connector
     *@param {Number} connectorId - the id of the connector
     *@return {Figure} - the figure connected, or null if none 
     **/
    figureGetAsFirstFigureForConnector: function(connectorId){
        Log.group("Stack:figureGetAsFirstFigureForConnector");
        
        /*Algorithm
         *Connector -> first Connector's ConnectionPoint-> Glue -> Figure's ConnectionPoint -> Figure
         **/
        var figure = null;
        
        //var connector = CONNECTOR_MANAGER.connectorGetById(connectorId);        
        Log.debug("Connector id = " + connectorId);
        
        var startConnectionPoint = CONNECTOR_MANAGER.connectionPointGetFirstForConnector(connectorId);
        Log.debug("ConnectionPoint id = " + startConnectionPoint.id);
        
        var startGlue = CONNECTOR_MANAGER.glueGetBySecondConnectionPointId(startConnectionPoint.id)[0];
        if(startGlue){
            Log.debug("Glue id1 = (" + startGlue.id1 + ", " + startGlue.id2 + ')');

            var figureConnectionPoint = CONNECTOR_MANAGER.connectionPointGetById(startGlue.id1);
            Log.debug("Figure's ConnectionPoint id = " + figureConnectionPoint.id);

            figure = this.figureGetById(figureConnectionPoint.parentId);
        }
        else{
            Log.debug("no glue");
        }
                                
        Log.groupEnd();
        
        return figure;
    },
    
    
    /**
     *Returns second figure glued to a connector
     *@param {Number} connectorId - the id of the connector
     *@return {Figure} - the figure connected, or null if none 
     **/
    figureGetAsSecondFigureForConnector: function(connectorId){
        Log.group("Stack:figureGetAsSecondFigureForConnector");
        
        /*Algorithm
         *Connector -> first Connector's ConnectionPoint-> Glue -> Figure's ConnectionPoint -> Figure
         **/
        var figure = null;
        
        //var connector = CONNECTOR_MANAGER.connectorGetById(connectorId);        
        Log.debug("Connector id = " + connectorId);
        
        var endConnectionPoint = CONNECTOR_MANAGER.connectionPointGetSecondForConnector(connectorId);
        Log.debug("ConnectionPoint id = " + endConnectionPoint.id);
        
        var startGlue = CONNECTOR_MANAGER.glueGetBySecondConnectionPointId(endConnectionPoint.id)[0];
        if(startGlue){
            Log.debug("Glue id1 = (" + startGlue.id1 + ", " + startGlue.id2 + ')');

            var figureConnectionPoint = CONNECTOR_MANAGER.connectionPointGetById(startGlue.id1);
            Log.debug("Figure's ConnectionPoint id = " + figureConnectionPoint.id);

            figure = this.figureGetById(figureConnectionPoint.parentId);
        }
        else{
            Log.debug("no glue");
        }
                                
        Log.groupEnd();
        
        return figure;
    },



    /**
     *Returns the Figure's id if there is a figure for the given coordinates
     *It will return the first figure we found from top to bottom (Z-order)
     *@param {Number} x - the value on Ox axis
     *@param {Number} y - the value on Ox axis
     *@return {Number} - the id of the figure or -1 if none found
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    figureGetByXY:function(x,y){
        var id = -1;
        for(var i= this.figures.length-1; i>=0; i--){
            if(this.figures[i].contains(x, y)){
                id = this.figures[i].id;
                break;
            /*
                 *Some old stuff left from a previous version. 
                 *TODO: delete it if no longer needed after the grouping has been (re)done
                 *we always want to get the group of a figure, not the figure itself where possible
                *(this section only does anything when we change the order of some items
                *var figure = this.figures[i];
                *While the figure belongs to a group or the group is part of another group
                *we will go up in the ancestor hierarchy
                * while(figure.groupId >= 0){
                *     figure = this.figureGetById(figure.groupId);
                * }
                return figure;
                */
            } //end if
        }//end for
        return id;
    },

    /**
     *Returns the Text primitive of parent figure for the given coordinates
     *It will return the first Text primitive we found from top to bottom (Z-order)
     *@param {Number} fId - the id of figure - parent of target Text primitive
     *@param {Number} x - the value on Ox axis
     *@param {Number} y - the value on Oy axis
     *@return {Number} - the id value of Text primitive or -1 if none found
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    textGetByFigureXY:function(fId, x, y){
        var figureLength = this.figures.length;
        for(var i = figureLength - 1; i >= 0; i--){
            var figure = this.figures[i];
            if(figure.id === fId){
                var primitiveLength = figure.primitives.length;
                for (var j = primitiveLength - 1; j >= 0; j--) { //top to bottom
                    var primitive = figure.primitives[j];
                    if( (primitive.oType === "Text") && primitive.contains(x, y) ){
                        return primitive.id;
                    }
                }
            } //end if
        }//end for
        return -1;
    },

    /**
     *Returns the Text primitive of parent container for the given coordinates
     *It will return the first Text primitive we found from top to bottom (Z-order)
     *@param {Number} cId - the id of container - parent of target Text primitive
     *@param {Number} x - the value on Ox axis
     *@param {Number} y - the value on Oy axis
     *@return {Number} - the id value of Text primitive or -1 if none found
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    textGetByContainerXY:function(cId, x, y){
        var containerLength = this.containers.length;
        for(var i = containerLength - 1; i >= 0; i--){
            var container = this.containers[i];
            if(container.id === cId){
                var primitiveLength = container.primitives.length;
                for (var j = primitiveLength - 1; j >= 0; j--) {
                    var primitive = container.primitives[j];
                    if( (primitive.oType == "Text") && primitive.contains(x, y) ){
                        return primitive.id;
                    }
                }
            } //end if
        }//end for
        return -1;
    },
    
    /**
     *Returns the Container's id if there is a container for the given coordinates
     *It will return the first container we found from top to bottom (Z-order)
     *@param {Number} x - the value on Ox axis
     *@param {Number} y - the value on Ox axis
     *@return {Number} - the id of the container or -1 if none found
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    containerGetByXY:function(x,y){
        var id = -1;
        for(var i= this.containers.length-1; i>=0; i--){
            if(this.containers[i].contains(x, y)){
                id = this.containers[i].id;
                break;
            } //end if
        }//end for
        return id;
    },
    
    
    /**
     *Returns the Container's id if there is a container for the given coordinates
     *It will return the first container we found from top to bottom (Z-order)
     *@param {Number} x - the value on Ox axis
     *@param {Number} y - the value on Ox axis
     *@return {Number} - the id of the {Container} or -1 if none found
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    containerGetByXYOnEdge:function(x,y){
        var id = -1;
        for(var i= this.containers.length-1; i>=0; i--){
            if(this.containers[i].onEdge(x, y)){
                id = this.containers[i].id;
                break;
            } //end if
        }//end for
        
        return id;
    },
    
    
    /**Returns a container by id
     *@param {Number} id - the id of the container
     *@return {Container} - the container object or null if no container with that id found
     **/
    containerGetById:function(id){
        for(var i=0; i<this.containers.length; i++){
            if(this.containers[i].id == id){
                return this.containers[i];
            }
        }
        return null;
    },
    
    /**
     *Returns an Array of Figure's id if there are figures for the given coordinates
     *@param {Number} x - the value on Ox axis
     *@param {Number} y - the value on Ox axis
     *@return {Array} of {Number} - the array of {Figure} ids. Figures are arranged from top (closer to viewer)
     * to bottom (far from viewer)
     *@author Alex Gheorghiu <alex@scriptoid.com>
     **/
    figuresGetByXY:function(x,y){
        var ids = [];
        
        for(var i= this.figures.length-1; i>=0; i--){
            if(this.figures[i].contains(x, y)){
                ids.push(this.figures[i].id);
            } 
        }
        
        return ids;
    },


    /* Sets the z index of a figure
     * @param {Figure} figure - the figure to move
     * @param {Number} position - the Z index. The bigger value means  closer to user (last painted);
     * @deprecated
     * */
    setPosition_deprecated:function(figure, position){
        var figureIndex=-1;
        for (var i=0; i<this.figures.length; i++){
            if(this.figures[i]==figure){
                figureIndex=i;
            }
        }
        if(figureIndex!=-1 && position>=0 && position<this.figures.length){
            //tempFigures=[];
            //tempFigures.spli
            //if(position<figureIndex){
            var tempFigure=this.figures.splice(figureIndex,1); //the figure to move
            this.figures.splice(position,0,tempFigure[0]);
            //}
            var added=false
            for(var i=0; i<this.figures.length; i++){
                this.idToIndex[this.figures[i].id] = i;
            }
            this.figureSelectedIndex=position;
        //this.figures=tempFigures;
        }
    },
    
    /** Sets the new z position of a currently selected figure (if present)
     * It actually swap figures.
     * <p/>
     * Note: it's just a simple switch between current position and new position
     * <p/>
     * Zack: Is it just a switch? All you are doing is swapping, what if the user didn't want to swap, but shift up
     * using this method, if you have 5 figures, and bring the very back one to the front, the front figure
     * is moved to the very back, surely the correct solution is to move everything back 1, and move the selected
     * figure to the front
     * <p/>
     * Alex: What you are saying is an insert at a certain position which is not what we want with this method.
     * Maybe we should rename it swapToPosition(...) or swapIntoPosition(...)
     * <p/>
     * @param {Number} figureId - the id of the {Figure}
     * @param {Number} newPosition - the new Z index of the figure. The bigger the value, close to user (last painted);
     * @author Alex Gheorghiu <alex@scriptoid.com>

     * */
    swapToPosition:function(figureId, newPosition){
        var oldPosition = this.idToIndex[figureId];
        
        if(oldPosition != -1 /**oldPosition valid*/
            && newPosition >= 0 && newPosition < this.figures.length /**newPosition in vector bounds*/){
            
            //update idToIndex index
            this.idToIndex[figureId] = newPosition;
            this.idToIndex[this.figures[newPosition].id] = oldPosition;
            
            //switch figures
            var temp = this.figures[oldPosition];
            this.figures[oldPosition] = this.figures[newPosition];
            this.figures[newPosition] = temp;
        }
    },

    
    /**
     *Insert a figure into a position and shifts all other figures
     *Used by moveToBack and moveToFront, sets the selected figure to the selected position, and rotates all other figures away
     *@example
     *[0] = 0
     *[1] = 1
     *[2] = 2
     *
     *change to
     *
     *@example
     *[0] = 1
     *[1] = 2
     *[2] = 0
     *
     *@example
     *figureA
     *figureB
     *figureC
     *
     *change to
     *
     *@example
     *figureB
     *figureC
     *figureA
     *@param {Number} figureId - the id of the figure
     *@param {Number} newPosition - the new position of the figure
     *@author Zack Newsham
     */
    setPosition:function(figureId, newPosition){
        //are we moving forward or back?
        var oldPosition = this.idToIndex[figureId];
        var temp = this.figures[oldPosition];
        var direction = -1;//move to back
        if(oldPosition < newPosition){//move to front
            direction = 1;
        }
        Log.info(direction);
        //while i between oldposition and new position, move 1 in given direction
        for(var i = oldPosition; i != newPosition; i+=direction){
            this.figures[i] = this.figures[i + direction];//set the figure
            this.idToIndex[this.figures[i].id] = i;//change the index
        }
        this.figures[newPosition] = temp; //replace the temp
        this.idToIndex[this.figures[newPosition].id] = newPosition;
    },
    
    
    /**Test if an (x,y) is over a figure
     *@param {Number} x - the x coordinates
     *@param {Number} y - the y coordinates
     *@return {Boolean} - true if over a figure, false otherwise
     **/
    figureIsOver:function(x, y){
        var found = false;
        for(var i=0; i< this.figures.length; i++){
            var figure = this.figures[i];
            if(figure.contains(x, y)){
                found = true;
                break;
            }
        }
        return found;
    },
        
        
    /**Test if an (x,y) is over a container
     *@param {Number} x - the x coordinates
     *@param {Number} y - the y coordinates
     *@return {Boolean} - true if over a container, false otherwise
     **/
    containerIsOver:function(x, y){
        var found = false;
        for(var i=0; i< this.containers.length; i++){
            var container = this.containers[i];
            if(container.contains(x, y)){
                found = true;
                break;
            }
        }
        return found;
    },
        
        
    /**Test if an (x,y) is over a Container's edge (rigt on its edge)
     *@param {Number} x - the x coordinates
     *@param {Number} y - the y coordinates
     *@return {Boolean} - true if over a container, false otherwise
     **/
    containerIsOnEdge:function(x, y){
        var found = false;
        for(var i=0; i< this.containers.length; i++){
            var container = this.containers[i];
            if(container.onEdge(x, y)){
                found = true;
                break;
            }
        }
        return found;
    },

    /**Return the bounds for all objects on work area (canvas).
     *
     *@return {Array<Number>} - returns [minX, minY, maxX, maxY] - bounds, where
     *  all objects on canvas (Figures/Containers/Connectors) are in the bounds.
     *
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    getWorkAreaBounds:function() {
        var minX;
        var maxX;
        var minY;
        var maxY;
        var unset = true;   // defines if there were no object - no bounds set

        // function to run for any bounds in format [minX, minY, maxX, maxY]
        // compares given bounds with current values of canvas
        var compareAndSet = function (bounds){
            // if minX is unset or bigger than given
            if (typeof(minX) === 'undefined' || minX > bounds[0]) {
                minX = bounds[0];
            }
            // if minY is unset or bigger than given
            if (typeof(minY) === 'undefined' || minY > bounds[1]) {
                minY = bounds[1];
            }
            // if maxX is unset or bigger than given
            if (typeof(maxX) === 'undefined' || bounds[2] > maxX) {
                maxX = bounds[2];
            }
            // if maxY is unset or bigger than given
            if (typeof(maxY) === 'undefined' || bounds[3] > maxY) {
                maxY = bounds[3];
            }

            // if once function were ran - one object setted it's bounds
            unset = false;
        };

        var i;
        // get bounds of containers
        var containerLength = this.containers.length;
        for (i = 0; i < containerLength; i++) {
            compareAndSet(this.containers[i].getBounds());
        }

        // get bounds of figures
        var figureLength = this.figures.length;
        for (i = 0; i < figureLength; i++) {
            compareAndSet(this.figures[i].getBounds());
        }

        // get bounds of connectors
        var connectorLength = CONNECTOR_MANAGER.connectors.length;
        for (i = 0; i < connectorLength; i++) {
            compareAndSet(CONNECTOR_MANAGER.connectors[i].getBounds());
        }

        // bounds were setted/changed?
        if (unset) {
            // return full canvas size
            return [0, 0, canvasProps.getWidth(), canvasProps.getHeight()];
        } else {
            // return setted new bounds
            return [minX, minY, maxX, maxY];
        }
    },


    /**
     *Apply a transformation to all Figures and Containers in Stack
     *@param {Matrix} matrix - a matrix of numbers
     *
     *@author Artyom Pokatilov <artyom.pokatilov@gmail.com>
     **/
    transform:function(matrix) {
        // translate Containers
        var i;
        var containerLength = this.containers.length;
        for (i = 0; i < containerLength; i++) {
            this.containers[i].transform(matrix);
        }

        // translate Figures
        var figureLength = this.figures.length;
        for (i = 0; i < figureLength; i++) {
            // Does Figure is placed outside of container?
            if (CONTAINER_MANAGER.getContainerForFigure(this.figures[i].id) === -1) {
                this.figures[i].transform(matrix);
            }
            // otherwise it is already transformed
        }
    },


    /**Paints all {Figure}s from back to top (Z order)
     *@param  {Context} context - the 2D context
     *@param  {boolean} ignoreSelection - if ignoreSelection is set to true selections will not be painted
     **/
    paint:function(context, ignoreSelection){
//        Log.group("STACK: paint");
        /*The idea is to paint from bottom to top
         * 1. figures (first)
         * 2. connectors
         * 3. handlers
         * 4. selection area (last) 
         **/
        
        if(DIAGRAMO.debug){
            var  pos = 1;
            context.save();
            context.font = "10px Arial";
            context.fillStyle= '#000000';
            context.strokeStyle= '#000000';
            context.lineWidth = 1;  
            context.fillText("state: " + state, 0, 10 * pos++);
            context.fillText("selectedFigureId: : " + selectedFigureId, 0, 10 * pos++);
            context.fillText("selectedGroupId: : " + selectedGroupId, 0, 10 * pos++);
            context.fillText("selectedContainerId: : " + selectedContainerId, 0, 10 * pos++);
            if(selectedGroupId != -1){
                var logGroup = this.groupGetById(selectedGroupId);
                context.fillText("permanent: : " + logGroup.permanent, 0, 10 * pos++);
            }
            context.fillText("selectedConnectorId: : " + selectedConnectorId, 0, 10 * pos++);
            if(selectedConnectorId != -1){
                var connector = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
                context.fillText("connector type: : " + connector.type, 0, 10 * pos++);
            }
                
            context.restore();
        }
        
        //paint containers
        for(var i=0; i<this.containers.length; i++){
            context.save();
            
            this.containers[i].paint(context);
            
            context.restore();
        }
        //end paint containers
        
        
        //paint figures
        for (var i=0; i<this.figures.length; i++) {

            
            if(!context.save){
                alert("save() no present")
            }
            context.save();

            this.figures[i].paint(context);
            context.restore();

            //if we are connecting something we should paint connection points too
            if(state == STATE_CONNECTOR_PICK_FIRST || state == STATE_CONNECTOR_PICK_SECOND
                || state == STATE_CONNECTOR_MOVE_POINT )
                {
                CONNECTOR_MANAGER.connectionPointPaint(context, this.figures[i].id);
            }
            
        }//end for


        //if we are connecting something we should paint currentCloud too
        if( state == STATE_CONNECTOR_PICK_FIRST || state == STATE_CONNECTOR_PICK_SECOND
            || state == STATE_CONNECTOR_MOVE_POINT )
        {
            CONNECTOR_MANAGER.connectionCloudPaint(context);
        }


        //paint connector(s)
        CONNECTOR_MANAGER.connectorPaint(context, selectedConnectorId);
        
        
        //paint handlers for selected shape
        if(state == STATE_FIGURE_SELECTED){ //FIGURE
            var f = this.figureGetById(selectedFigureId);
            HandleManager.shapeSet(f);
            //alert('Paint handles');
			if(!ignoreSelection){
				HandleManager.paint(context);
			}
        }
        else if(state == STATE_CONNECTOR_SELECTED){ //CONNECTOR
            var c = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
            HandleManager.shapeSet(c);
			if(!ignoreSelection){
				HandleManager.paint(context);
			}
        }
        else if(state == STATE_CONTAINER_SELECTED){ //CONTAINER
            var cont = STACK.containerGetById(selectedContainerId);
            HandleManager.shapeSet(cont);
            if(!ignoreSelection){
                HandleManager.paint(context);
            }
        }
        else if(state == STATE_GROUP_SELECTED){ //GROUP 
            var g = this.groupGetById(selectedGroupId);
            HandleManager.shapeSet(g);
			if(!ignoreSelection){
				HandleManager.paint(context);
			}
        }
        else if(state == STATE_SELECTING_MULTIPLE){ //SELECTION
            /* If shift is pressed, then leave the selected figure 
             * or group drawn on screen and allow drawing region in same time*/
            if(SHIFT_PRESSED){
                if (selectedFigureId != -1){
                    var f = this.figureGetById(selectedFigureId);
                    HandleManager.paint(context);
                }
                if (selectedGroupId != -1){
                    var g = this.groupGetById(selectedGroupId);
                    HandleManager.paint(context);
                }
            }
            
            selectionArea.paint(context);
            Log.info(selectionArea.toString());
        }
        
        if(DIAGRAMO.debug){
//            Log.group("Visual debug");
            var colors = {
                's0' : '#ff0000',
                's1_1' : '#009900',
                's1_2' : '#0033ff',
                's2_1' : '#00ff33',
                's2_2' : '#ff3399',
                's2_3' : '#808019',
                's2_4' : '#e6e64c',
                's2_5' : '#e67814',
                's2_6' : '#309bda'
            };
            
            context.save();
            for(var i=0; i<DIAGRAMO.debugSolutions.length; i++){
                var shift = 3 + i * 3;
                var solution = DIAGRAMO.debugSolutions[i];
//                Log.info("Solution: " + solution + " type of " + typeof(solution[2]) + " length: " + solution.length );
//                Log.info("Solution points: " + solution[2]);
                var points = solution[2]; //get points
                
                
                //paint line                                
                context.save();
                context.strokeStyle = colors[solution[1]];
                context.lineWidth = 1;  
                context.beginPath();
                context.moveTo(points[0].x + shift, points[0].y + shift);                
                for(var j=1; j<points.length; j++){                                        
                    context.lineTo(points[j].x + shift, points[j].y + shift)
                }
                //context.closePath();
                context.stroke();
                context.restore();                    


                //paint points
                for(var j=0; j<points.length; j++){
                    context.save();
//                    points[j].style.strokeStyle = '#FF0000';
//                    points[j].paint(context);
                    context.beginPath();
                    //context.strokeStyle= colors[solution[1]];
                    context.strokeStyle= '#cccccc';
                    //context.arc(points[j].x,points[j].y, 2 + i * 3, 0, Math.PI*2, true);
                    context.arc(points[j].x,points[j].y, 3, 0, Math.PI*2, true);
                    //context.closePath();
                    context.stroke();
                    context.restore();                    
                }                                
            }
            
            //paint the legend
            pos += 4;
            for(var solName in colors){
                context.save();
                context.strokeText(solName, 0, 10 * pos);
                context.strokeStyle = colors[solName];
                context.beginPath();
                context.moveTo(50, 10 * pos);
                context.lineTo(150, 10 * pos);
                //context.endPath();
                context.stroke();
                context.restore();
                pos += 2;
            }
            context.restore();
            
//            Log.groupEnd();
        }
        
//        Log.groupEnd();
    },

    /**Convert all STACK to SVG representation
     *@return {String} - the SVG string representation*/
    toSVG : function(){
        var svg = '';

        for (var i=0; i<this.figures.length; i++) {
            svg += this.figures[i].toSVG();
        }
        
        return svg;
    }
}






