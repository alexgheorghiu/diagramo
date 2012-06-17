/* 
 * This is triggered when a figure was moved
 * @this {GroupTranslateCommand} 
 * @constructor
 * @author Alex Gheorghiu <alex@scriptoid.com>
 * @param {Integer} groupId - the id of the figure translated
 * @param {Array} matrix - the transformation matrix of translation
 */
function GroupTranslateCommand(groupId, matrix){
    this.oType = 'GroupTranslateCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;
    
    this.groupId = groupId;
    
    //compute the translation matrix
    this.matrix = matrix;
        
    //compute the reverse matrix
    this.reverseMatrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
    ];
    this.reverseMatrix[0][2] = -this.matrix[0][2];
    this.reverseMatrix[1][2] = -this.matrix[1][2];
        
}


GroupTranslateCommand.prototype = {
    
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


