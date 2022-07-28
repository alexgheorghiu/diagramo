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

/** Group is ONLY a logical grouping of some figures.
 * It does not paint itself and it does not change the Z-Order of member figures
 * 
 * @constructor
 * @param {Numeric} id -  the id of group
 * @this {Group}
 * @author Alex, Zack Newsham zack_newsham@yahoo.co.uk
 */
function Group(id){
    
    /**Group's id*/
    if(id){
        this.id = id;
    }
    else{
        this.id = STACK.generateId();
    }
    
    
    /**By default all groups are temporary....so it's up to you make them permanent*/
    this.permanent = false;
    
    /**An {Array} of 2 {Point}s that keeps the rotation of the Group*/
    this.rotationCoords = [];
    
    /**Serialization type*/
    this.oType = 'Group';
}

/**Creates a {Group} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Group} a newly constructed Group
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Group.load = function(o){
    var newGroup = new Group(); //empty constructor

    newGroup.id = o.id;
    newGroup.permanent = o.permanent;
    newGroup.rotationCoords = Point.loadArray(o.rotationCoords);

    return newGroup;
}


/**Creates a new {Array} of {Group}s out of JSON parsed object
 *@param {JSONObject} v - the JSON parsed object
 *@return {Array} of newly constructed {Group}s
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Group.loadArray = function(v){
    var newGroups = [];

    for(var i=0; i<v.length; i++){
        newGroups.push(Group.load(v[i]));
    }

    return newGroups;
}


Group.prototype = {
    
    constructor : Group,

    /**Group is not painted. It is only a mental group
     * @deprecated
     */
    paint:function(context){
        throw "Group is not painted. It is only an abstract grouping";
    },



    /**See if a group contains a point
     *@param {Number} x - the x coordinate of the point
     *@param {Number} y - the y coordinate of the point
     **/
    contains:function(x,y){
        var figures = STACK.figureGetByGroupId(this.id);
        for(var i = 0; i < figures.length; i++){
            if(figures[i].contains(x,y) == true){
                return true;
            }
        }
        return false;
    },


    /**See if a point is near a group, within a radius
     *@param {Number} x - the x coordinate of the point
     *@param {Number} y - the y coordinate of the point
     *@param {Number} radius - the radius to search for
     **/
    near:function(x,y,radius){
        var figures = STACK.figureGetByGroupId(this.id);
        for(var i = 0; i < figures.length; i++){
            if(figures[i].near(x,y,radius) == true){
                return true;
            }
        }
        return false;
    },


    /**
     *Get a group bounds
     **/
    getBounds:function(){
        var figures = STACK.figureGetByGroupId(this.id);
        var points = [];
        for(var i = 0; i < figures.length; i++){
            var bounds = figures[i].getBounds();
            points.push(new Point(bounds[0], bounds[1]));
            points.push(new Point(bounds[2], bounds[3]));
        }
        return Util.getBounds(points);
    },


    /**
     *Get all points of a Group (collect them from all figures)
     **/
    getPoints:function(){
        var figures = STACK.figureGetByGroupId(this.id);
        var points = [];
        for(var i = 0; i < STACK.figureIds.length; i++){
            var fPoints = STACK.figureGetById(STACK.figureIds[i]).getPoints();
            points = points.concat(fPoints);
        }
        return points;
    },

    /**
     *Transform the group
     *@param {Matrix} matrix - the transformation matrix
     **/
    transform:function(matrix){
        this.rotationCoords[0].transform(matrix);
        this.rotationCoords[1].transform(matrix);
        var figures = STACK.figureGetByGroupId(this.id);
        for(var i = 0; i < figures.length; i++){

            figures[i].transform(matrix);
        }
    },
    
    /**Compares to another Group
     *@param {Group} group -  - the other glue
     *@return {Boolean} - true if equals, false otherwise
     **/
    equals:function(group){
        if(!group instanceof Group){
            return false;
        }

        for(var i=0; i<this.rotationCoords; i++){
            if(!this.rotationCoords[i].equals(group.rotationCoords[i])){
                return false;
            }
        }

        return this.permanent == group.permanent;
    },


    /**Clone this group
     *@return {Group} - the clone of current group*/
    clone:function(){
        var group = new Group();
        group.permanent = this.permanent;
        return group;
    },

    /**
     *String representation of a Group
     **/
    toString:function(){
        return "Group id: " + this.id + " permanent: " + this.permanent;
    }

}



