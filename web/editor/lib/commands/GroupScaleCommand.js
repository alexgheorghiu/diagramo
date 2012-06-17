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