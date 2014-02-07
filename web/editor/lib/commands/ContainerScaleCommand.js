"use strict";
/* 
 * This is triggered when a container was scaled/expanded
 * @this {ContainerScaleCommand} 
 * @constructor
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function ContainerScaleCommand(containerId, matrix, reverseMatrix){
    
    this.oType = 'ContainerScaleCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;
    
    this.containerId = containerId;
        
    this.matrix = matrix;           
    this.reverseMatrix = reverseMatrix;
        
}


ContainerScaleCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
        var cont = STACK.containerGetById(this.containerId);                
        cont.transform(this.matrix);        
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
        var cont = STACK.containerGetById(this.containerId);                
        cont.transform(this.reverseMatrix);  
    }
};


