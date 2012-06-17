/**
 * Object that is used to undo actions when figures are moved from front to back
 * @this {FigureZOrderCommand} 
 * @constructor
 * @param figureId {Number} - {Figure}'s id
 * @param newPosition {Number} index
 */
function FigureZOrderCommand(figureId, newPosition){
    this.figureId = figureId;
    this.oType = "FigureZOrderCommand";
    
    this.oldPosition = STACK.idToIndex[figureId];
    this.newPosition = newPosition;
}

FigureZOrderCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        if(this.oldPosition + 1 == this.newPosition || this.oldPosition - 1 == this.newPosition){
            STACK.swapToPosition(this.figureId, this.newPosition);
        }
        else{
            STACK.setPosition(this.figureId, this.newPosition);
        }
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        if(this.newPosition + 1 == this.oldPosition || this.newPosition - 1 == this.oldPosition){
            STACK.swapToPosition(this.figureId, this.oldPosition);
        }
        else{
            STACK.setPosition(this.figureId, this.oldPosition);
        }
    }
    
}


