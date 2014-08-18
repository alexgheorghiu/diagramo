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
 * This is triggered when a figure was scaled/expanded
 * @this {GroupScaleCommand} 
 * @constructor
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function GroupScaleCommand(groupId, matrix, reverseMatrix){
    this.oType = 'GroupScaleCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;
    
    this.groupId = groupId;
        
    this.matrix = matrix;           
    this.reverseMatrix = reverseMatrix;
        
}


GroupScaleCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
        var group = STACK.groupGetById(this.groupId);                
        group.transform(this.matrix);        
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
        var group = STACK.groupGetById(this.groupId);                
        group.transform(this.reverseMatrix);        
    }
}