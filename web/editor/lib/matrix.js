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
 * A matrix math library.
 * Instead of creating of a so called Object we will only use matrixes as
 * array or arrays so Matrix will function more like a namespace instead
 * as an object.
 *
 * All function are "static" / class methods...so no need to instanciate a Matrix object
 * 
 * @namespace
 */

function Matrix(){
}


/**Add two matrixes.
 *It can be used to combine multiple transformations into one.
 *@param {Array} m1 - first matrix
 *@param {Array} m2 - second matrix
 *@return {Array} the sum of those 2 matrix
 *@see <a href="http://en.wikipedia.org/wiki/Transformation_matrix#Composing_and_inverting_transformations">http://en.wikipedia.org/wiki/Transformation_matrix#Composing_and_inverting_transformations></a>
 **/
Matrix.add = function(m1, m2){
    var mReturn=[];
    if(m1.length==m2.length){
        for(var row=0; row<m1.length; row++){
            mReturn[row]=[];
            for(var column=0; column<m1[row].length; column++){
                mReturn[row][column] = m1[row][column] + m2[row][column];
            }
        }
    }
    return mReturn;
};


/**Clones a matrix. Recursivelly
 *@param {Array} m - the matrix to clone
 *@return {Array} - the clone of orriginal matrix
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Matrix.clone = function(m){
    if(typeof(m) == 'undefined' || m == null){
        return null;
    }
    
    var mReturn=[];
    for(var i=0; i<m.length; i++){
        /*If the element is also an array. As we can not tell if this is an array or object as both array and object return objects
         *we will at least try to see if it's object and if it has some length */
        if(typeof(m) == 'object' && m[i].length){ 
            mReturn.push(Matrix.clone(m[i]));
        }
        else{
            mReturn.push(m[i]);
        }
    }
    return mReturn;
};




/**Substract matrix m2 from m1
 *@param {Array} m1 - first matrix
 *@param {Array} m2 - second matrix
 *@return {Array} the m1 - m2 matrix
 **/
Matrix.subtract = function(m1, m2){
    var mReturn=[];
    if(m1.length == m2.length){
        for(var row=0; row<m1.length; row++){
            mReturn[row]=[];
            for(var column=0; column<m1[row].length; column++){
                mReturn[row][column] = m1[row][column] - m2[row][column];
            }
        }
    }
    return mReturn;
};


/**Check againsts NaN values
 *@param {Array} m - the matrix
 *@return {boolean} true - if it contains NaN values, false otherwise
 **/
Matrix.isNaN = function(m){
    for(var row=0; row<m.length; row++){
        if(m[row] instanceof Array){
            for(var column=0; column<m[row].length; column++){
                if( isNaN(m[row][column])) {
                    return true;
                }
            }
        }
        else{
            if( isNaN(m[row])) {
                return true;
            }
        }
    }
    return false;
};


/**Multiply matrix m2 with m1
 *@param {Array} m1 - first matrix
 *@param {Array} m2 - second matrix
 *@return {Array} the multiplication of those 2 matrix
 *@see <a href="http://en.wikipedia.org/wiki/Matrix_multiplication">http://en.wikipedia.org/wiki/Matrix_multiplication</a>
 **/
Matrix.multiply = function(m1, m2){
    var mReturn = [];
    if(m1[0].length == m2.length){//check that width=height
        for(var m1Row=0; m1Row<m1.length; m1Row++){
            mReturn[m1Row] = [];
            for(var m2Column=0; m2Column< m2[0].length; m2Column++){
                mReturn[m1Row][m2Column] = 0
                for(var m2Row=0; m2Row<m2.length; m2Row++){
                    mReturn[m1Row][m2Column] += m1[m1Row][m2Row] * m2[m2Row][m2Column];
                }
            }
        }
    }
    return mReturn;
};


/**Multiply matrix m2 with m1
 *If you apply a transformation T to a point P the new point is:
 *  P' = T x P
 *So if you apply more then one transformation (T1, T2, T3) then the new point is:
 *  P'= T3 x (T2 x (T1 x P)))
 *@return {Array} the equivalent matrix ( of all transformations)
 *@see <a href="http://en.wikipedia.org/wiki/Transformation_matrix#Composing_and_inverting_transformations">http://en.wikipedia.org/wiki/Transformation_matrix#Composing_and_inverting_transformations</a>
 *@see <a href="http://en.wikipedia.org/wiki/Matrix_multiplication">http://en.wikipedia.org/wiki/Matrix_multiplication</a>
 **/
Matrix.mergeTransformations = function(){
    var mReturn = [];
    
    if(arguments.length > 0){
        mReturn = Matrix.clone( arguments[arguments.length-1] );
        
        for(var m = arguments.length - 2; m >= 0; m--){
            mReturn = Matrix.multiply(mReturn, arguments[m]);        
        }
    }

    return mReturn;
};

/**
 * Inverts a matrix
 *http://en.wikipedia.org/wiki/Invertible_matrix
 **/
Matrix.invertMatrix = function(m){
    
    };

/**Compares two matrixes
  *@param {Array} m1 - first matrix
  *@param {Array} m2 - second matrix
  *@return {Boolean} true if matrixes are equal , false otherwise
**/
Matrix.equals = function(m1, m2){
    if(m1.length != m2.length){ //nr or rows not equal
        return false;
    }
    else{
        for(var i in m1){
            if(m1[i].length != m2[i].length){ //nr or cols not equal
                return false;
            }
            else{
                for(var j in m1[i]){
                    if(m1[i][j] != m2[i][j]){
                        return false;
                    }
                }
            }
        }
    }

    return true;
}


/**Creates a clockwise rotation matrix around the origin.
 *
 *Note: don't use this to rotate a Figure. You must first move it to origin.
 *(by using a translation)
 *@param {Number} angle - the angle expressed in radians
 *@return {Array} - the ready to use rotation matrix
 *@see <a href="http://en.wikipedia.org/wiki/Rotation_matrix#In_an_oriented_plane">http://en.wikipedia.org/wiki/Rotation_matrix#In_an_oriented_plane</a>
 *@see <a href="http://en.wikipedia.org/wiki/Rotation_matrix">http://en.wikipedia.org/wiki/Rotation_matrix</a>
 *@see <a href="http://en.wikipedia.org/wiki/Transformation_matrix#Rotation">http://en.wikipedia.org/wiki/Transformation_matrix#Rotation</a>
 **/
Matrix.rotationMatrix = function(angle){
    var mReturn=[
    [Math.cos(angle), -Math.sin(angle), 0],
    [Math.sin(angle), Math.cos(angle),   0],
    [0,0, 1]];
    return mReturn;
};

    
/**Creates a translation matrix
 *@param {Number} dx - variation of movement on [Ox axis
 *@param {Number} dy - variation of movement on [Oy axis
 *@return {Array} - the ready to use translation matrix
 **/
Matrix.translationMatrix = function(dx, dy){
    return [
    [1, 0, dx],
    [0, 1, dy],
    [0, 0,  1]
    ];
};
    
/**Creates a scale matrix
 *@param {Number} sx - scale factor by which the x will be multiply
 *@param {Number} sy - scale factor by which the y will be multiply
 *@return {Array} - the ready to use scale matrix
 *@see <a href="http://en.wikipedia.org/wiki/Transformation_matrix#Scaling">http://en.wikipedia.org/wiki/Transformation_matrix#Scaling</a>
 **/
Matrix.scaleMatrix = function(sx, sy){
    if(sy == null) {
        sy = sx;
    }

    
    return [
    [sx,0,0],
    [0,sy,0],
    [0,0,1]
    ];
//we should allow a single parameter too, in which case we will have sx = sy
};


/**A ready to use matrix to make a 90 degree rotation.
 *It acts like a singleton.
 *It's more used for example and testings
 **/
Matrix.R90 = [[0, -1, 0], [0,  1, 0], [0,  0, 1]];

/**The identity matrix*/
Matrix.IDENTITY = [[1,0,0],[0,1,0],[0,0,1]];

/**The move up by 1 unit matrix*/
Matrix.UP = [
    [1, 0, 0],
    [0, 1, -1],
    [0, 0, 1]
    ];
    
/**The move down by 1 unit matrix*/
Matrix.DOWN = [
    [1, 0, 0],
    [0, 1, 1],
    [0, 0, 1]
    ];
    
/**The move left by 1 unit matrix*/
Matrix.LEFT = [
    [1, 0, -1],
    [0, 1, 0],
    [0, 0, 1]
    ];

/**The move right by 1 unit matrix*/
Matrix.RIGHT = [
    [1, 0, 1],
    [0, 1, 0],
    [0, 0, 1]
    ];

