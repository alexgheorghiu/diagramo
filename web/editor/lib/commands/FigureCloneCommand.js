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
 * This command just clones an existing {Figure}. All it needs is an id of
 * cloned {Figure}
 * @this {FigureCloneCommand} 
 * @constructor
 * @param {Number} parentFigureId - the Id of parent {Figure}
 * @author Alex <alex@scriptoid.com>
 * @author Janis Sejans <janis.sejans@towntech.lv>
 */
function FigureCloneCommand(parentFigureId){
    this.oType = 'FigureCloneCommand';
    
    this.firstExecute = true;
    
    /**This will keep the newly created  Figure id*/
    this.figureId = null; 
    
    /**This keeps the cloned figure Id*/
    this.parentFigureId = parentFigureId;    
}


FigureCloneCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){
        if(this.firstExecute){
            //get old figure and clone it
            var createdFigure = STACK.figureGetById(this.parentFigureId).clone();
            
            //move it 10px low and 10px right
            createdFigure.transform(Matrix.translationMatrix(10,10));
            
            //store newly created figure
            STACK.figureAdd(createdFigure);
            
            //store newly created figure id
            this.figureId = createdFigure.id;
            
            //update diagram state
            selectedFigureId = this.figureId;
            setUpEditPanel(createdFigure);
            state = STATE_FIGURE_SELECTED;
            
            this.firstExecute = false;
        }
        else{ //redo
            throw "Not implemented";
        }
    },
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){ 
        STACK.figureRemoveById(this.figureId);
        state = STATE_NONE;
    }
}