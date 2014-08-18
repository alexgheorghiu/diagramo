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
 * This is triggered when you delete a Container
 * @this {ContainerDeleteCommand} 
 * @constructor
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function ContainerDeleteCommand(containerId){
    this.oType = 'ContainerDeleteCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = false;
    
    this.containerId = containerId;
            
    this.firstExecute = true;
       
}


ContainerDeleteCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
        if(this.firstExecute){
            
            //first unglue all contained figures
            var figuresIds = CONTAINER_MANAGER.getAllFigures(this.containerId);
            for(var i=0;i<figuresIds; i++){
                CONTAINER_MANAGER.removeFigure(this.containerId, figuresIds[i]);
            }
            
            //remove the actual container           
            STACK.containerRemoveById(this.containerId);
            selectedContainerId = -1;
            setUpEditPanel(canvasProps);
            state = STATE_NONE;  
            
            
            redraw = true; 
            this.firstExecute = false;
        }
        else{ //a redo
            throw "Not implemented";
        }
    },

    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
        throw "Not implemented";
    }
};

