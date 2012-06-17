/* 
 * This is triggered when a figure was translated
 * @this {FigureTranslateCommand} 
 * @constructor
 * @param {Integer} figureId - the id of the figure translated
 * @param {Array} matrix - the transformation matrix of translation
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function FigureTranslateCommand(figureId, matrix){
    this.oType = 'FigureTranslateCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;
    
    this.figureId = figureId;
    
    //compute the translation matrix
//    this.matrix = generateMoveMatrix(STACK.figureGetById(figureId), this.x,this. y);
    this.matrix = matrix
        
    //compute the reverse matrix
    this.reverseMatrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
    ];
    this.reverseMatrix[0][2] = -this.matrix[0][2];
    this.reverseMatrix[1][2] = -this.matrix[1][2];
        
}


FigureTranslateCommand.prototype = {
    
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


