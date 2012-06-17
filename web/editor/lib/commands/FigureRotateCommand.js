/* 
 * This is triggered when a figure was rotated
 * @this {FigureRotateCommand} 
 * @constructor
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function FigureRotateCommand(figureId, matrix, reverseMatrix){
    this.oType = 'FigureRotateCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;
    
    this.figureId = figureId;
        
    this.matrix = matrix;           
    this.reverseMatrix = reverseMatrix;
        
}


FigureRotateCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
        var fig = STACK.figureGetById(this.figureId);                
        fig.transform(this.matrix);        
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
        var fig = STACK.figureGetById(this.figureId);
        fig.transform(this.reverseMatrix);
    }
}
