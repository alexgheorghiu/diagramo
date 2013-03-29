/* 
 * This is triggered when a container was scaled/expanded
 * @this {ContainerScaleCommand} 
 * @constructor
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function ContainerScaleCommand(figureId, matrix, reverseMatrix){
    throw "Not finished";
    
    this.oType = 'ContainerScaleCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;
    
    this.figureId = figureId;
        
    this.matrix = matrix;           
    this.reverseMatrix = reverseMatrix;
        
}


ContainerScaleCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
//        var fig = STACK.figureGetById(this.figureId);                
//        fig.transform(this.matrix);        
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
//        var fig = STACK.figureGetById(this.figureId);
//        fig.transform(this.reverseMatrix);
    }
}


