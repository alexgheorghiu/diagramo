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
        
}


ContainerTranslateCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
        var container = STACK.containerGetById(this.containerId);                
        container.transform(this.matrix);        
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
        var container = STACK.containerGetById(this.containerId);
        container.transform(this.reverseMatrix);
    }
};

