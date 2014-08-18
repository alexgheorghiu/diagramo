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
 * Object that is used to undo actions when figures are moved from front to back
 * @this {FigureZOrderCommand} 
 * @constructor
 * @param figureId {Number} - {Figure}'s id
 * @param newPosition {Number} index
 */
function FigureZOrderCommand(figureId, newPosition){
    this.figureId = figureId;
    this.oType = "FigureZOrderCommand";
    
    this.oldPosition = STACK.idToIndex[figureId];
    this.newPosition = newPosition;
}

FigureZOrderCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        if(this.oldPosition + 1 == this.newPosition || this.oldPosition - 1 == this.newPosition){
            STACK.swapToPosition(this.figureId, this.newPosition);
        }
        else{
            STACK.setPosition(this.figureId, this.newPosition);
        }
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        if(this.newPosition + 1 == this.oldPosition || this.newPosition - 1 == this.oldPosition){
            STACK.swapToPosition(this.figureId, this.oldPosition);
        }
        else{
            STACK.setPosition(this.figureId, this.oldPosition);
        }
    }
    
}


