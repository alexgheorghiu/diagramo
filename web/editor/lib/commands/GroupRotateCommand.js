/* 
 * This is triggered when a group was rotated
 * @this {GroupRotateCommand} 
 * @constructor
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function GroupRotateCommand(groupId, matrix, reverseMatrix){
    this.oType = 'GroupRotateCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;
    
    this.groupId = groupId;
        
    this.matrix = matrix;           
    this.reverseMatrix = reverseMatrix;
        
}


GroupRotateCommand.prototype = {
    
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

