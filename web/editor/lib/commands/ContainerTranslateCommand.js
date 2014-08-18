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

/* 
 * This is triggered when a container was translated
 * @this {ContainerTranslateCommand} 
 * @constructor
 * @param {Integer} containerId - the id of the container translated
 * @param {Array} matrix - the transformation matrix of translation
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function ContainerTranslateCommand(containerId, matrix){
    this.oType = 'ContainerTranslateCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;
    
    this.containerId = containerId;
    
    //compute the translation matrix
//    this.matrix = generateMoveMatrix(STACK.figureGetById(figureId), this.x,this. y);
    this.matrix = matrix;
        
    //compute the reverse matrix
    this.reverseMatrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
    ];
    this.reverseMatrix[0][2] = -this.matrix[0][2];
    this.reverseMatrix[1][2] = -this.matrix[1][2];
    
    /**contained figures' ids. Neded in case of undo */
    this.containedFigures = [];
        
}


ContainerTranslateCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
        var container = STACK.containerGetById(this.containerId);                
        container.transform(this.matrix);        
        
        //find all containing figures and translate them
        this.containedFigures = CONTAINER_MANAGER.getAllFigures(this.containerId);
        for(var i=0; i<this.containedFigures.length; i++){
            var figure = STACK.figureGetById(this.containedFigures[i]);
            figure.transform(this.matrix);
        }
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
        var container = STACK.containerGetById(this.containerId);
        container.transform(this.reverseMatrix);
        
        //find all containing figures and translate them back
        for(var i=0; i<this.containedFigures.length; i++){
            var figure = STACK.figureGetById(this.containedFigures[i]);
            figure.transform(this.reverseMatrix);
        }
    }
};

